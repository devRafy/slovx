import { db } from '../config/database.js';

// Multi-language STOP keywords Meta considers valid opt-outs, plus common variants.
const STOP_KEYWORDS = new Set([
  'stop', 'unsubscribe', 'cancel', 'end', 'quit', 'stopall',
  'اوقف', 'إلغاء', 'الغاء', 'اشتراك',                     // Arabic
  'رک', 'روکو', 'بند',                                     // Urdu
  'detente', 'parar',                                       // Spanish
  'arrête', 'arreter', 'stop',                              // French
]);

// Confirmation message sent back to the customer when they opt out.
// Should be short, universal, and template-free (no variables).
const OPT_OUT_ACK = "You've been unsubscribed. Reply START to resume.";

// Un-opt-in keyword — customer opts back in
const RESUME_KEYWORDS = new Set(['start', 'unstop', 'resume', 'yes']);

export const isOptOutKeyword = (text) => {
  if (!text) return false;
  const normalized = text.trim().toLowerCase();
  return STOP_KEYWORDS.has(normalized);
};

export const isResumeKeyword = (text) => {
  if (!text) return false;
  return RESUME_KEYWORDS.has(text.trim().toLowerCase());
};

// Mark a lead as opted-out. Idempotent.
export const markOptedOut = async (subscriberId, customerPhone) => {
  await db.lead.updateMany({
    where: { subscriberId, customerPhone },
    data:  { optedOut: true, optedOutAt: new Date() },
  });
};

// Reverse the opt-out.
export const markOptedIn = async (subscriberId, customerPhone) => {
  await db.lead.updateMany({
    where: { subscriberId, customerPhone },
    data:  { optedOut: false, optedOutAt: null },
  });
};

// Returns true if this customer has previously opted out — outbound messages should be blocked.
export const isOptedOut = async (subscriberId, customerPhone) => {
  const lead = await db.lead.findFirst({
    where:  { subscriberId, customerPhone },
    select: { optedOut: true },
  });
  return lead?.optedOut === true;
};

export { OPT_OUT_ACK };
