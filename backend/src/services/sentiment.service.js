import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';
import { db } from '../config/database.js';

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

// Background sentiment + buying-intent audit. Runs AFTER the AI has already replied,
// so it never blocks the customer's response time. Best-effort — failures are silently
// logged and don't affect the conversation.
//
// Both scores are stored on the Lead as floats 0..1 (Prisma field type).
// The dashboard multiplies by 10 for display ("7.4 / 10").
export const auditConversation = async (subscriberId, customerPhone, lastCustomerMessage) => {
  try {
    const res = await anthropic.messages.create({
      model:      env.ANTHROPIC_MODEL,
      max_tokens: 100,
      system: `You audit customer messages for a sales chatbot. Return ONLY valid JSON with two floats between 0 and 1:
{"sentiment": <0..1, where 0=furious, 0.5=neutral, 1=delighted>, "buyingIntent": <0..1, where 0=not interested, 1=ready to buy>}
No prose, no markdown, no code fences. Just the raw JSON object.`,
      messages: [{ role: 'user', content: lastCustomerMessage }],
    });

    const raw = res.content[0]?.text?.trim() ?? '';
    const jsonStart = raw.indexOf('{');
    const jsonEnd   = raw.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) return;

    const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
    const clamp = (n) => Math.max(0, Math.min(1, Number(n) || 0));

    await db.lead.updateMany({
      where: { subscriberId, customerPhone },
      data:  {
        sentiment:    clamp(parsed.sentiment),
        buyingIntent: clamp(parsed.buyingIntent),
      },
    });
  } catch (err) {
    console.warn('[sentiment] audit failed for', customerPhone, err.message);
  }
};
