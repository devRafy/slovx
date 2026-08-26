import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ar from './locales/ar.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import zh from './locales/zh.json';
import pt from './locales/pt.json';
import tr from './locales/tr.json';
import de from './locales/de.json';
import it from './locales/it.json';
import ru from './locales/ru.json';
import nl from './locales/nl.json';
import pl from './locales/pl.json';
import sv from './locales/sv.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';

// Language list — ordered by "likely relevance" for a Pakistan → EU-facing SaaS.
// Add more via: npm run i18n:add <code>  (generates JSON via free translation API)
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English',    native: 'English',    dir: 'ltr' },
  { code: 'de', label: 'German',     native: 'Deutsch',    dir: 'ltr' },
  { code: 'fr', label: 'French',     native: 'Français',   dir: 'ltr' },
  { code: 'es', label: 'Spanish',    native: 'Español',    dir: 'ltr' },
  { code: 'it', label: 'Italian',    native: 'Italiano',   dir: 'ltr' },
  { code: 'nl', label: 'Dutch',      native: 'Nederlands', dir: 'ltr' },
  { code: 'pt', label: 'Portuguese', native: 'Português',  dir: 'ltr' },
  { code: 'pl', label: 'Polish',     native: 'Polski',     dir: 'ltr' },
  { code: 'sv', label: 'Swedish',    native: 'Svenska',    dir: 'ltr' },
  { code: 'ru', label: 'Russian',    native: 'Русский',    dir: 'ltr' },
  { code: 'tr', label: 'Turkish',    native: 'Türkçe',     dir: 'ltr' },
  { code: 'ar', label: 'Arabic',     native: 'العربية',    dir: 'rtl' },
  { code: 'zh', label: 'Chinese',    native: '中文',        dir: 'ltr' },
  { code: 'ja', label: 'Japanese',   native: '日本語',      dir: 'ltr' },
  { code: 'ko', label: 'Korean',     native: '한국어',      dir: 'ltr' },
];

const RTL_LANGS = new Set(SUPPORTED_LANGUAGES.filter((l) => l.dir === 'rtl').map((l) => l.code));

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      es: { translation: es },
      fr: { translation: fr },
      zh: { translation: zh },
      pt: { translation: pt },
      tr: { translation: tr },
      de: { translation: de },
      it: { translation: it },
      ru: { translation: ru },
      nl: { translation: nl },
      pl: { translation: pl },
      sv: { translation: sv },
      ja: { translation: ja },
      ko: { translation: ko },
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    interpolation: { escapeValue: false }, // React already escapes
    detection: {
      // Order: previously chosen (localStorage) → browser preference → html tag
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'xavier-lang',
      caches: ['localStorage'],
    },
  });

// Keep the <html dir="..."> attribute in sync with the active language.
// Runs on init and whenever the user switches.
const applyDirection = (lng) => {
  const code = (lng || 'en').split('-')[0];
  const dir  = RTL_LANGS.has(code) ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', code);
};
applyDirection(i18n.language);
i18n.on('languageChanged', applyDirection);

export default i18n;
