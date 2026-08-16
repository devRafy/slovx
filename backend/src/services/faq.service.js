// Sub-second FAQ answering. Runs BEFORE the AI so common questions skip the ~2s Claude round-trip.
// Strategy: normalize both the customer message and FAQ questions, then look for either:
//   1. Exact match (after normalization) → instant reply
//   2. Strong keyword overlap (≥75% of important words match) → still safe to auto-reply
// Anything else falls through to the AI.

// Strip punctuation, lowercase, collapse whitespace, drop very common English stopwords.
const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'do', 'does', 'i', 'you', 'we', 'to', 'of', 'in', 'on',
  'for', 'at', 'and', 'or', 'but', 'if', 'me', 'my', 'your', 'this', 'that', 'these',
  'those', 'have', 'has', 'had', 'be', 'been', 'was', 'were', 'can', 'will', 'would',
  'should', 'could', 'about', 'with', 'from', 'as', 'it', 'so', 'not', 'no',
]);

const normalize = (s) =>
  s.toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const keywords = (s) =>
  normalize(s)
    .split(' ')
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));

// Given a customer message and an array of { question, answer } FAQ objects, returns
// the best-matching answer string, or null if nothing matches strongly enough.
export const findFaqAnswer = (customerMessage, faqs) => {
  if (!customerMessage || !Array.isArray(faqs) || faqs.length === 0) return null;

  const normMsg = normalize(customerMessage);
  const msgWords = new Set(keywords(customerMessage));
  if (msgWords.size === 0) return null;

  let best = null;
  let bestScore = 0;

  for (const faq of faqs) {
    if (!faq?.question || !faq?.answer) continue;

    // Exact-match shortcut
    if (normalize(faq.question) === normMsg) {
      return faq.answer;
    }

    // Keyword overlap score = matched keywords / total keywords in the FAQ question
    const qWords = keywords(faq.question);
    if (qWords.length === 0) continue;

    const matched = qWords.filter((w) => msgWords.has(w)).length;
    const score = matched / qWords.length;

    if (score > bestScore) {
      bestScore = score;
      best = faq.answer;
    }
  }

  // Require ≥75% keyword overlap to auto-answer. Below that, fall through to the AI
  // so we don't return a wrong-but-plausible FAQ answer.
  return bestScore >= 0.75 ? best : null;
};
