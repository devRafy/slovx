import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n';

/**
 * Language picker. Globe icon → dropdown of every supported language in its native script.
 *
 * The dropdown auto-decides whether to open upward or downward based on available viewport
 * space. When the trigger sits near the bottom of the screen (e.g. sidebar footer) it opens
 * upward so options aren't clipped. When near the top, it opens downward.
 *
 * Preference persists to localStorage; <html dir> auto-updates for RTL languages.
 *
 * Variant styles the trigger:
 *   • "dark"  — dark backgrounds (dashboard sidebar, mobile top bar)
 *   • "light" — light backgrounds (login/register pages)
 */
export default function LanguageSwitcher({ variant = 'dark', align = 'left' }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const ref = useRef(null);
  const btnRef = useRef(null);

  const active = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language?.split('-')[0])
              ?? SUPPORTED_LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  // Decide flip direction the moment the menu opens, based on real viewport space.
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    // Estimated max menu height: item height (36px) × count + padding. With 10 languages ≈ 380px.
    const estimatedMenuHeight = Math.min(SUPPORTED_LANGUAGES.length * 40 + 8, 360);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setDropUp(spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow);
  }, [open]);

  const change = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  const triggerCls = variant === 'dark'
    ? 'text-white/70 hover:bg-white/10 hover:text-white'
    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${triggerCls}`}
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe className="w-4 h-4" />
        <span>{active.native}</span>
      </button>

      {open && (
        <div
          className={`absolute z-[100] min-w-[180px] max-h-[70vh] overflow-y-auto rounded-lg bg-white border border-gray-200 shadow-xl ${
            dropUp ? 'bottom-full mb-1' : 'top-full mt-1'
          } ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {SUPPORTED_LANGUAGES.map((lng) => {
            const isActive = lng.code === active.code;
            return (
              <button
                key={lng.code}
                type="button"
                onClick={() => change(lng.code)}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-gray-50 ${
                  isActive ? 'text-brand-600 font-medium bg-brand-50/50' : 'text-gray-700'
                }`}
                dir={lng.dir}
              >
                <span>{lng.native}</span>
                {isActive && <Check className="w-4 h-4 text-brand-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
