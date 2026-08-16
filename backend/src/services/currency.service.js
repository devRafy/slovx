import axios from 'axios';

// Live currency conversion using exchangerate.host (free, no API key).
// Rates are cached in-memory for 6 hours to keep the AI's response fast and reduce API load.
//
// Used by the AI when a customer asks about pricing in a different currency
// ("how much is this in USD?"). The service builds a small "current FX rates" snippet
// that gets injected into the AI system prompt, so the AI does the actual math.

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const SUPPORTED = ['USD', 'AED', 'SAR', 'PKR', 'GBP', 'EUR', 'INR'];

let cache = null;
// cache: { base: string, rates: Record<string, number>, fetchedAt: number }

const fetchRates = async (base) => {
  const { data } = await axios.get('https://api.exchangerate.host/latest', {
    params:  { base, symbols: SUPPORTED.join(',') },
    timeout: 5000,
  });
  if (!data?.success && !data?.rates) throw new Error('FX API returned no rates');
  return data.rates || {};
};

// Returns the rate cache for the given base currency. Refetches when stale or when base changes.
// Never throws — on failure returns null, and callers omit the FX section from the prompt.
export const getRates = async (base = 'USD') => {
  const now = Date.now();
  if (cache && cache.base === base && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.rates;
  }
  try {
    const rates = await fetchRates(base);
    cache = { base, rates, fetchedAt: now };
    return rates;
  } catch (err) {
    console.warn('[currency] fetch failed:', err.message);
    return null;
  }
};

// Builds a compact string block for the AI prompt showing 1 <base> = X <other> for each currency.
// Returns empty string if rates unavailable, so the prompt gracefully omits the section.
export const buildFxContext = async (base) => {
  const rates = await getRates(base);
  if (!rates) return '';

  const lines = SUPPORTED
    .filter((sym) => sym !== base && rates[sym] != null)
    .map((sym) => `  • 1 ${base} = ${Number(rates[sym]).toFixed(3)} ${sym}`);

  if (lines.length === 0) return '';
  return `\n═══ LIVE FX RATES (auto-refreshed) ═══\n${lines.join('\n')}\nUse these ONLY if the customer explicitly asks about a different currency.\n`;
};
