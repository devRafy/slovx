import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase.js';

/**
 * "Continue with Google" button. Kicks off Supabase's Google OAuth flow.
 * Supabase redirects to Google, then back to `redirectTo` where the client
 * picks up the session from the URL (`detectSessionInUrl: true` in
 * lib/supabase.js). onAuthStateChange in the auth store then flips the
 * session on and the App route guard sends the user to /dashboard.
 *
 * Requires the Google provider to be enabled in the Supabase dashboard:
 *   Authentication → Providers → Google → Enable, with a Google Cloud
 *   OAuth Client ID + Secret and the Supabase callback URL added as an
 *   authorised redirect URI on the Google side.
 */
export default function GoogleAuthButton({ onError }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    onError?.('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: { prompt: 'select_account' },
      },
    });
    // signInWithOAuth returns immediately after starting the redirect —
    // if there's no error the browser is already navigating away.
    if (error) {
      setLoading(false);
      onError?.(error.message || t('auth.googleFailed', 'Google sign-in failed. Please try again.'));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:hover:bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 transition-colors"
    >
      <GoogleIcon />
      {loading
        ? t('auth.googleSigningIn', 'Signing in…')
        : t('auth.continueWithGoogle', 'Continue with Google')}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
