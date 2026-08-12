import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { processMessage } from '../services/ai.service.js';
import { sendMessage, getSubscriberByPhoneNumberId } from '../services/whatsapp.service.js';
import { db } from '../config/database.js';

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

// POST /api/webhook — inbound WhatsApp messages from Meta
export const receiveWebhook = asyncHandler(async (req, res) => {
  // Always ACK immediately — Meta will retry if we don't respond fast
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
        const incomingText  = msg.text?.body;

        // Fire-and-forget so webhook always responds in time
        handleIncoming(phoneNumberId, customerPhone, incomingText).catch((err) =>
          console.error('Error handling inbound message:', err),
        );
      }
    }
  }
});

async function handleIncoming(phoneNumberId, customerPhone, text) {
  const connection = await getSubscriberByPhoneNumberId(phoneNumberId);
  if (!connection) {
    console.warn(`No subscriber found for phone_number_id: ${phoneNumberId}`);
    return;
  }

  const { subscriber } = connection;
  const businessConfig  = subscriber.businessConfig;

  if (!businessConfig?.isComplete) {
    console.warn(`Subscriber ${subscriber.id} has incomplete business config — skipping`);
    return;
  }

  // Bot paused → still persist the incoming customer message so the owner can see it,
  // but don't invoke the AI or send an auto-reply.
  if (subscriber.botEnabled === false) {
    await saveIncomingOnly(subscriber.id, customerPhone, text);
    console.log(`Bot paused for subscriber ${subscriber.id} — message saved without AI reply`);
    return;
  }

  const { reply } = await processMessage(
    subscriber.id,
    customerPhone,
    text,
    businessConfig,
  );

  const result = await sendMessage(
    phoneNumberId,
    connection.accessToken,
    customerPhone,
    reply,
  );

  if (!result.success) {
    await db.guardrailLog.create({
      data: {
        subscriberId:    subscriber.id,
        customerPhone,
        alertType:       'DELIVERY_FAILURE',
        flaggedInput:    text,
        blockedResponse: result.error,
      },
    });
  }
}

async function saveIncomingOnly(subscriberId, customerPhone, text) {
  const conversation = await db.conversation.upsert({
    where:  { subscriberId_customerPhone: { subscriberId, customerPhone } },
    create: { subscriberId, customerPhone, messages: [], stage: 'QUALIFICATION' },
    update: {},
  });

  await db.lead.upsert({
    where:  { conversationId: conversation.id },
    create: { subscriberId, conversationId: conversation.id, customerPhone },
    update: {},
  });

  const messages = Array.isArray(conversation.messages) ? [...conversation.messages] : [];
  messages.push({ role: 'user', content: text, timestamp: new Date().toISOString() });

  await db.conversation.update({
    where: { id: conversation.id },
    data:  { messages },
  });
}
