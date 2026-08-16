import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { processMessage } from '../services/ai.service.js';
import { sendMessage, getSubscriberByPhoneNumberId } from '../services/whatsapp.service.js';
import { db } from '../config/database.js';
import {
  isOptOutKeyword, isResumeKeyword, markOptedOut, markOptedIn, isOptedOut, OPT_OUT_ACK,
} from '../services/optout.service.js';
import { isWithinWindow } from '../services/window.service.js';
import { auditConversation } from '../services/sentiment.service.js';
import { findFaqAnswer } from '../services/faq.service.js';
import { enqueueMessage } from '../services/queue.service.js';

// GET /api/webhook — Meta hub verification challenge
export const verifyWebhook = (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === env.META_VERIFY_TOKEN) {
    console.log('Webhook verified by Meta');
    return res.status(200).send(challenge);
  }
  res.status(403).json({ error: 'Verification failed' });
};

// POST /api/webhook — inbound WhatsApp messages from Meta.
// Always ACKs immediately (Meta retries if we don't respond in a few seconds), then
// hands off to the debounce queue so rapid-fire messages get batched into one prompt.
export const receiveWebhook = asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'ok' });

  const body = typeof req.body === 'string' || Buffer.isBuffer(req.body)
    ? JSON.parse(req.body.toString())
    : req.body;

  if (body.object !== 'whatsapp_business_account') return;

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== 'messages') continue;

      const value         = change.value;
      const phoneNumberId = value?.metadata?.phone_number_id;
      const messages      = value?.messages ?? [];

      for (const msg of messages) {
        if (msg.type !== 'text') continue;
        const customerPhone = msg.from;
        const text          = msg.text?.body?.trim();
        if (!text) continue;

        // Fire and forget — safe to ignore return value
        onIncomingText(phoneNumberId, customerPhone, text).catch((err) =>
          console.error('[webhook] onIncomingText failed:', err.message),
        );
      }
    }
  }
});

// Top-level handler for a single inbound message. Runs the fast-path checks
// (opt-out, resume) synchronously, then hands to the debounce queue for the AI flow.
async function onIncomingText(phoneNumberId, customerPhone, text) {
  const connection = await getSubscriberByPhoneNumberId(phoneNumberId);
  if (!connection) {
    console.warn('[webhook] no subscriber for phone_number_id:', phoneNumberId);
    return;
  }

  const { subscriber } = connection;

  // Always update lastCustomerMessageAt so the 24h window is tracked accurately.
  await db.conversation.upsert({
    where:  { subscriberId_customerPhone: { subscriberId: subscriber.id, customerPhone } },
    create: {
      subscriberId: subscriber.id, customerPhone, messages: [], stage: 'QUALIFICATION',
      lastCustomerMessageAt: new Date(),
    },
    update: { lastCustomerMessageAt: new Date() },
  });

  // 1️⃣ RESUME — customer wants back in. Un-opt-out and confirm.
  if (isResumeKeyword(text)) {
    await markOptedIn(subscriber.id, customerPhone);
    await sendPlain(connection, customerPhone, "You've been re-subscribed. How can we help?");
    return;
  }

  // 2️⃣ STOP — customer wants out. Mark opt-out, send confirmation, halt AI pipeline.
  if (isOptOutKeyword(text)) {
    await markOptedOut(subscriber.id, customerPhone);
    await sendPlain(connection, customerPhone, OPT_OUT_ACK);
    return;
  }

  // 3️⃣ If already opted out — save the message but do NOT send any auto-reply.
  //     (Customer can still see their own messages in our chats UI, but Meta compliance
  //      forbids us reaching out until they explicitly opt back in.)
  if (await isOptedOut(subscriber.id, customerPhone)) {
    await appendCustomerMessage(subscriber.id, customerPhone, text);
    return;
  }

  // 4️⃣ Human takeover for this conversation — save message, don't invoke AI.
  const convo = await db.conversation.findUnique({
    where:  { subscriberId_customerPhone: { subscriberId: subscriber.id, customerPhone } },
    select: { humanTakeover: true },
  });
  if (convo?.humanTakeover) {
    await appendCustomerMessage(subscriber.id, customerPhone, text);
    return;
  }

  // 5️⃣ Global bot pause (subscriber flipped the switch in Settings).
  if (subscriber.botEnabled === false) {
    await appendCustomerMessage(subscriber.id, customerPhone, text);
    return;
  }

  // 6️⃣ Debounce queue — batch rapid messages before hitting the AI.
  enqueueMessage(subscriber.id, customerPhone, text, (combined) =>
    runAiPipeline(connection, customerPhone, combined),
  );
}

// The full AI reply pipeline. Only runs after the debounce queue flushes.
async function runAiPipeline(connection, customerPhone, combinedText) {
  const { subscriber, phoneNumberId, accessToken } = connection;
  const businessConfig = subscriber.businessConfig;

  if (!businessConfig?.isComplete) {
    console.warn(`[webhook] subscriber ${subscriber.id} has incomplete business config — skipping AI`);
    return;
  }

  // ⚡ FAST PATH: check FAQ cache. If exact/high-overlap match, reply instantly and skip Claude.
  const faqAnswer = findFaqAnswer(combinedText, businessConfig.faqs);
  if (faqAnswer) {
    await appendCustomerMessage(subscriber.id, customerPhone, combinedText);
    await sendGuarded(connection, customerPhone, faqAnswer, combinedText);
    await appendAssistantMessage(subscriber.id, customerPhone, faqAnswer);
    // Still schedule a sentiment audit in the background
    void auditConversation(subscriber.id, customerPhone, combinedText);
    return;
  }

  // 🤖 SLOW PATH: full AI reply.
  const { reply } = await processMessage(subscriber.id, customerPhone, combinedText, businessConfig);
  await sendGuarded(connection, customerPhone, reply, combinedText);

  // Background sentiment audit — never blocks.
  void auditConversation(subscriber.id, customerPhone, combinedText);
}

// Wrap sendMessage with 24h-window compliance + delivery-failure logging.
async function sendGuarded(connection, customerPhone, body, originalInput) {
  const { subscriber, phoneNumberId, accessToken } = connection;

  // 24-hour window check
  const convo = await db.conversation.findUnique({
    where:  { subscriberId_customerPhone: { subscriberId: subscriber.id, customerPhone } },
    select: { lastCustomerMessageAt: true },
  });
  if (!isWithinWindow(convo?.lastCustomerMessageAt)) {
    console.warn(`[webhook] 24h window closed for ${customerPhone} — skipping outbound (would require template)`);
    await db.guardrailLog.create({
      data: {
        subscriberId:    subscriber.id,
        customerPhone,
        alertType:       'DELIVERY_FAILURE',
        flaggedInput:    originalInput,
        blockedResponse: `Blocked: 24h window closed. Body: ${body.slice(0, 200)}`,
      },
    });
    return;
  }

  const result = await sendMessage(phoneNumberId, accessToken, customerPhone, body);

  if (!result.success) {
    await db.guardrailLog.create({
      data: {
        subscriberId:    subscriber.id,
        customerPhone,
        alertType:       'DELIVERY_FAILURE',
        flaggedInput:    originalInput,
        blockedResponse: result.error,
      },
    });
  }
}

// Simple sender used for opt-out / resume confirmations — bypasses AI + logging noise
// but still respects the 24h window (opt-out replies are always within window since the
// customer JUST sent us a STOP/START message).
async function sendPlain(connection, customerPhone, body) {
  const { phoneNumberId, accessToken } = connection;
  await sendMessage(phoneNumberId, accessToken, customerPhone, body).catch((err) =>
    console.warn('[webhook] sendPlain failed:', err.message),
  );
}

// Append a message to the conversation's messages array without triggering AI.
// Used when bot is paused, customer is opted out, or human takeover is on.
async function appendCustomerMessage(subscriberId, customerPhone, text) {
  const conv = await db.conversation.findUnique({
    where: { subscriberId_customerPhone: { subscriberId, customerPhone } },
  });
  if (!conv) return;
  const messages = Array.isArray(conv.messages) ? [...conv.messages] : [];
  messages.push({ role: 'user', content: text, timestamp: new Date().toISOString() });
  await db.conversation.update({ where: { id: conv.id }, data: { messages } });

  // Also make sure a Lead row exists
  await db.lead.upsert({
    where:  { conversationId: conv.id },
    create: { subscriberId, conversationId: conv.id, customerPhone },
    update: {},
  });
}

async function appendAssistantMessage(subscriberId, customerPhone, text) {
  const conv = await db.conversation.findUnique({
    where: { subscriberId_customerPhone: { subscriberId, customerPhone } },
  });
  if (!conv) return;
  const messages = Array.isArray(conv.messages) ? [...conv.messages] : [];
  messages.push({ role: 'assistant', content: text, timestamp: new Date().toISOString() });
  await db.conversation.update({ where: { id: conv.id }, data: { messages } });
}
