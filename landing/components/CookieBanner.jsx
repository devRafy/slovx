'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const COOKIE_NAME = 'slovx_cookie_consent';
const COOKIE_MAX_AGE_DAYS = 180;

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value) {
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)};max-age=${maxAge};path=/;SameSite=Lax`;
}

/**
 * First-visit cookie consent banner. Persists choice in a first-party cookie
 * so it doesn't re-show. Exposes window.slovxCookieConsent + fires a
 * `slovxCookieConsentUpdated` CustomEvent that analytics/marketing scripts
 * can listen to before firing:
 *   if (window.slovxCookieConsent?.analytics) { ... }
 */
export default function CookieBanner() {
  const [visible, setVisible]           = useState(false);
  const [customize, setCustomize]       = useState(false);
  const [functional, setFunctional]     = useState(true);
  const [analytics, setAnalytics]       = useState(true);
  const [marketing, setMarketing]       = useState(true);

  useEffect(() => {
    const existing = getCookie(COOKIE_NAME);
    if (existing) {
      try { window.slovxCookieConsent = JSON.parse(existing); }
      catch { window.slovxCookieConsent = { functional: true, analytics: true, marketing: true }; }
      return;
    }
    setVisible(true);
  }, []);

  const save = (consent) => {
    setCookie(COOKIE_NAME, JSON.stringify(consent));
    window.slovxCookieConsent = consent;
    window.dispatchEvent(new CustomEvent('slovxCookieConsentUpdated', { detail: consent }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] pointer-events-none">
      <div className="max-w-4xl mx-auto m-4 rounded-2xl border border-white/10 bg-ink-900/95 backdrop-blur-xl p-5 md:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] pointer-events-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <p className="font-display font-medium text-white text-sm md:text-base">We use cookies</p>
            <p className="text-white/50 text-xs mt-1 leading-relaxed">
              Necessary cookies keep the site running. Analytics and marketing cookies are optional and help us understand what's working. See our{' '}
              <Link href="/legal/cookies" className="text-brand-300 hover:text-brand-200 underline underline-offset-2">
                Cookie Policy
              </Link>.
            </p>
          </div>
          <div className="flex gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setCustomize((v) => !v)}
              className="text-xs font-medium border border-white/10 text-white/80 hover:bg-white/5 px-4 py-2.5 rounded-lg transition-colors"
            >
              Customize
            </button>
            <button
              onClick={() => save({ functional: false, analytics: false, marketing: false })}
              className="text-xs font-medium border border-white/10 text-white/80 hover:bg-white/5 px-4 py-2.5 rounded-lg transition-colors"
            >
              Reject Non-Essential
            </button>
            <button
              onClick={() => save({ functional: true, analytics: true, marketing: true })}
              className="text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-brand-500/25"
            >
              Accept All
            </button>
          </div>
        </div>

        {customize && (
          <div className="mt-5 pt-5 border-t border-white/10 space-y-3">
            <label className="flex items-center justify-between text-xs text-white/60">
              <span>Strictly Necessary <span className="text-white/30">(always on)</span></span>
              <input type="checkbox" checked disabled className="accent-white/40" />
            </label>
            <label className="flex items-center justify-between text-xs text-white/70">
              <span>Functional</span>
              <input type="checkbox" checked={functional} onChange={(e) => setFunctional(e.target.checked)} className="accent-brand-500" />
            </label>
            <label className="flex items-center justify-between text-xs text-white/70">
              <span>Analytics</span>
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="accent-brand-500" />
            </label>
            <label className="flex items-center justify-between text-xs text-white/70">
              <span>Marketing / Conversion Tracking</span>
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="accent-brand-500" />
            </label>
            <button
              onClick={() => save({ functional, analytics, marketing })}
              className="w-full mt-2 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white py-2.5 rounded-lg transition-colors"
            >
              Save Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
