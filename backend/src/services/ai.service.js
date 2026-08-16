import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';
import { db } from '../config/database.js';
import { buildFxContext } from './currency.service.js';
import { isBusinessOpen, afterHoursHint } from './hours.service.js';
import { hasBookingIntent, bookingHint } from './booking.service.js';

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

// Stage transition markers Xavier embeds in its replies
const MARKERS = {
  QUALIFIED:   '[QUALIFIED]',
  CLOSED_WON:  '[CLOSED_WON]',
  CLOSED_LOST: '[CLOSED_LOST]',
};

// Builds the full Claude system prompt from business config + live context (FX, hours, booking).
// Async because it awaits live FX rates. All sections omit gracefully if data is missing.
const buildSystemPrompt = async (config, incomingText) => {
  const currency = config.currency || 'USD';
  const products = config.products
    .map((p) => `  • ${p.name}: ${currency} ${p.price} ${p.billingCycle} — ${p.description}`)
    .join('\n');

  const faqList = Array.isArray(config.faqs) ? config.faqs : [];
  const faqSection = faqList.length > 0
    ? `\n═══ FAQ (use these EXACT answers when applicable) ═══\n${
        faqList.map((f, i) => `Q${i + 1}: ${f.question}\nA${i + 1}: ${f.answer}`).join('\n\n')
      }\n`
    : '';

  // Cultural / dialect adapter — quiet hint if configured, otherwise nothing.
  const dialectLine = config.dialect || config.region
    ? `\nCULTURAL: Region=${config.region ?? 'unspecified'}, dialect preference="${config.dialect ?? 'default'}". Match this in your replies.\n`
    : '';

  // Live FX context — only added if the customer asks about currency (keeps prompt small).
  let fxSection = '';
  if (incomingText && /\b(usd|aed|sar|pkr|gbp|eur|inr|dollar|dirham|riyal|rupee|pound|euro|convert|exchange)\b/i.test(incomingText)) {
    fxSection = await buildFxContext(currency);
  }

  // Time-aware fallback — inject an "outside hours" hint when appropriate.
  const hoursSection = !isBusinessOpen(config) ? `\n${afterHoursHint(config)}\n` : '';

  // Booking intent — inject calendar link when detected AND a link is configured.
  const bookingSection = hasBookingIntent(incomingText) && config.calendarLink
    ? `\n${bookingHint(config.calendarLink)}\n`
    : '';

  return `You are Xavier, an AI sales executive for ${config.companyName} (${config.industry}).
Your personality is ${config.aiPersonality}. Be concise — WhatsApp messages should be short.
${dialectLine}
═══ PRODUCTS ═══
${products}

═══ POLICIES ═══
Discount: ${config.discountPolicy}
Refund:   ${config.refundPolicy}
${config.calendarLink ? `Booking:  ${config.calendarLink}` : ''}
${faqSection}${fxSection}${hoursSection}${bookingSection}
═══ CONVERSATION STAGES ═══
You move through these stages:
1. QUALIFICATION — Ask BANT questions (Budget, Authority, Need, Timeline). Keep it conversational.
2. NEGOTIATION   — Present matching products, handle objections, push toward a close.
3. CLOSED        — Wrap up the conversation.

═══ STAGE TRANSITION RULES ═══
Append ONE marker (invisible to customer — you strip it) at the very end of your message ONLY when:
• Lead is clearly qualified (BANT confirmed) → append ${MARKERS.QUALIFIED}
• Deal accepted / purchase confirmed        → append ${MARKERS.CLOSED_WON}
• Lead says no / conversation ends in loss  → append ${MARKERS.CLOSED_LOST}
Do NOT append any marker if the stage has not changed.

═══ GUARDRAILS (STRICT) ═══
• NEVER quote prices or terms not listed above.
• NEVER make promises beyond stated policies.
• Prefer FAQ answers verbatim when the customer's question matches — do not paraphrase policy-critical answers.
• Always respond in the same language the customer uses.
• Never reveal you are an AI unless directly asked.`;
};

const detectMarker = (text) => {
  if (text.includes(MARKERS.CLOSED_WON))  return { marker: 'CLOSED_WON',  stage: 'CLOSED' };
  if (text.includes(MARKERS.CLOSED_LOST)) return { marker: 'CLOSED_LOST', stage: 'CLOSED' };
  if (text.includes(MARKERS.QUALIFIED))   return { marker: 'QUALIFIED',   stage: 'NEGOTIATION' };
  return null;
};

const stripMarkers = (text) =>
  Object.values(MARKERS).reduce((t, m) => t.replace(m, '').trim(), text);

const detectHallucination = (text, config) => {
  const allowedPrices = config.products.map((p) => p.price);
  const mentioned = [...text.matchAll(/\$\s?(\d+(?:\.\d{1,2})?)/g)].map((m) => parseFloat(m[1]));
  return mentioned.some((price) => !allowedPrices.includes(price));
};

export const processMessage = async (subscriberId, customerPhone, incomingText, businessConfig) => {
  // Get or create conversation
  const conversation = await db.conversation.upsert({
    where:  { subscriberId_customerPhone: { subscriberId, customerPhone } },
    create: { subscriberId, customerPhone, messages: [], stage: 'QUALIFICATION' },
    update: {},
  });

  // Get or create lead
  await db.lead.upsert({
    where:  { conversationId: conversation.id },
    create: { subscriberId, conversationId: conversation.id, customerPhone },
    update: {},
  });

  // Build message history for Claude
  const history = Array.isArray(conversation.messages) ? conversation.messages : [];
  const claudeMessages = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: incomingText },
  ];

  // Call Claude (system prompt is now async because of live FX context)
  const systemPrompt = await buildSystemPrompt(businessConfig, incomingText);
  const response = await anthropic.messages.create({
    model:      env.ANTHROPIC_MODEL,
    max_tokens: 512,
    system:     systemPrompt,
    messages:   claudeMessages,
  });

  const rawReply = response.content[0]?.text || "I'm sorry, I couldn't process that. Please try again.";

  // Detect hallucination
  if (detectHallucination(rawReply, businessConfig)) {
    await db.guardrailLog.create({
      data: {
        subscriberId,
        customerPhone,
        alertType:       'HALLUCINATION',
        flaggedInput:    incomingText,
        blockedResponse: rawReply,
      },
    });
    const safeReply = "Let me connect you with our team for accurate pricing details.";
    await persistTurn(conversation, incomingText, safeReply, null);
    return { reply: safeReply, stageChanged: false };
  }

  // Detect stage transition
  const transition = detectMarker(rawReply);
  const cleanReply = stripMarkers(rawReply);

  // Persist updated conversation
  await persistTurn(conversation, incomingText, cleanReply, transition);

  // Update lead status if stage changed
  if (transition) {
    const statusMap = { QUALIFIED: 'QUALIFIED', CLOSED_WON: 'CLOSED', CLOSED_LOST: 'LOST' };
    await db.lead.update({
      where: { conversationId: conversation.id },
      data:  { status: statusMap[transition.marker] || 'LEAD' },
    });
  }

  return { reply: cleanReply, stageChanged: !!transition };
};

const persistTurn = async (conversation, userText, aiReply, transition) => {
  const messages = Array.isArray(conversation.messages) ? [...conversation.messages] : [];
  messages.push(
    { role: 'user',      content: userText,  timestamp: new Date().toISOString() },
    { role: 'assistant', content: aiReply,   timestamp: new Date().toISOString() },
  );

  await db.conversation.update({
    where: { id: conversation.id },
    data:  {
      messages,
      ...(transition ? { stage: transition.stage } : {}),
    },
  });
};
