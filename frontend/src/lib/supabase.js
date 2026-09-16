import { createClient } from '@supabase/supabase-js';

/**
 * Frontend Supabase client. Uses the anon (public) key — safe to ship to
 * the browser. Session is persisted in localStorage; access tokens auto-
 * refresh before expiry via `autoRefreshToken`.
 *
 * The URL and anon key come from Vite env vars — set them in .env.local for
 * dev and in Vercel Environment Variables for prod:
 *   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
 *   VITE_SUPABASE_ANON_KEY=eyJhbGc...
 */
const url  = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.error('[supabase] VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required');
}

export const supabase = createClient(url ?? '', anon ?? '', {
  auth: {
    persistSession:   true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // required for OAuth + magic-link callbacks
    storageKey: 'xavier-auth',
  },
});
