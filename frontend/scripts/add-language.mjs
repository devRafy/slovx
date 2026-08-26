/**
 * Auto-generate a new language JSON file by translating the English source.
 *
 * Usage:
 *   node scripts/add-language.mjs <lang_code>
 *
 * Example:
 *   node scripts/add-language.mjs ja   # Japanese
 *   node scripts/add-language.mjs de   # German
 *   node scripts/add-language.mjs id   # Indonesian
 *
 * How it works:
 *   • Reads src/i18n/locales/en.json as the source of truth
 *   • Walks every string value (deep, nested JSON)
 *   • Sends each string to MyMemory Translation API (free, no key, 5000 words/day)
 *   • Preserves {{variables}} — swaps them for placeholder tokens before translating,
 *     then swaps back after (so the translator can't corrupt them)
 *   • Writes src/i18n/locales/<lang>.json in the same shape as en.json
 *
 * After running, update TWO files:
 *   1. src/i18n/index.js  — import the new JSON + add to SUPPORTED_LANGUAGES
 *   2. That's it. Vite picks it up on next build.
 *
 * Quality note: MyMemory is fine for simple UI strings but marketing/legal copy
 * should be human-reviewed. Free tier = 5000 words/day per IP.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_LANG  = 'en';
const SRC_PATH  = resolve(__dirname, '..', 'src', 'i18n', 'locales', `${SRC_LANG}.json`);
const OUT_DIR   = resolve(__dirname, '..', 'src', 'i18n', 'locales');

const targetLang = process.argv[2];
if (!targetLang || !/^[a-z]{2}(-[A-Z]{2})?$/.test(targetLang)) {
  console.error('Usage: node scripts/add-language.mjs <lang_code>');
  console.error('Examples: ja, de, ko, id, vi, fa, sw');
  process.exit(1);
}

// ─── translate a single string ─────────────────────────────────────────────

const VAR_PATTERN = /\{\{[^}]+\}\}/g;

// MyMemory throws away curly braces. We swap {{variable}} for a sentinel that
// most translators leave alone, then restore them.
const protectVars = (text) => {
  const vars = [];
  const protectedText = text.replace(VAR_PATTERN, (match) => {
    vars.push(match);
    return `X${vars.length - 1}X`;
  });
  return { protectedText, vars };
};

const restoreVars = (text, vars) =>
  text.replace(/X(\d+)X/g, (_, i) => vars[Number(i)] ?? '');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function translateOne(text, targetLang, attempt = 1) {
  if (!text.trim()) return text;
  const { protectedText, vars } = protectVars(text);

  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', protectedText);
  url.searchParams.set('langpair', `${SRC_LANG}|${targetLang}`);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const translated = json?.responseData?.translatedText;
    if (!translated) throw new Error('empty translation');
    return restoreVars(translated, vars);
  } catch (err) {
    if (attempt < 3) {
      console.warn(`  retry (${attempt}) after error: ${err.message}`);
      await sleep(500 * attempt);
      return translateOne(text, targetLang, attempt + 1);
    }
    console.warn(`  ✗ giving up on: "${text.slice(0, 50)}..." — keeping English`);
    return text; // Fall back to English rather than crash the whole file
  }
}

// ─── walk the JSON tree ────────────────────────────────────────────────────

async function translateNode(node, targetLang, path = '') {
  if (typeof node === 'string') {
    process.stdout.write('.');
    const translated = await translateOne(node, targetLang);
    // Small pause to stay under MyMemory's rate limit (roughly 10 req/sec).
    await sleep(120);
    return translated;
  }
  if (Array.isArray(node)) {
    return Promise.all(node.map((v, i) => translateNode(v, targetLang, `${path}[${i}]`)));
  }
  if (node && typeof node === 'object') {
    const out = {};
    for (const [key, val] of Object.entries(node)) {
      out[key] = await translateNode(val, targetLang, path ? `${path}.${key}` : key);
    }
    return out;
  }
  return node;
}

// ─── main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n📖 Reading source: ${SRC_PATH}`);
  const source = JSON.parse(await readFile(SRC_PATH, 'utf8'));

  console.log(`🌐 Translating → ${targetLang} (this takes ~30s per 100 strings)\n`);
  const translated = await translateNode(source, targetLang);

  const outPath = resolve(OUT_DIR, `${targetLang}.json`);
  await writeFile(outPath, JSON.stringify(translated, null, 2) + '\n', 'utf8');

  console.log(`\n\n✅ Wrote ${outPath}`);
  console.log('\nNext steps:');
  console.log(`  1. Open src/i18n/index.js`);
  console.log(`  2. Add:  import ${targetLang} from './locales/${targetLang}.json';`);
  console.log(`  3. Add ${targetLang} to SUPPORTED_LANGUAGES + resources`);
  console.log(`  4. npm run dev  — try it out\n`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
