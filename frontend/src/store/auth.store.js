import { create } from 'zustand';
import { supabase } from '../lib/supabase.js';

/**
 * Auth state, sourced from the Supabase session.
 *
 * - `session` is the raw Supabase session object; presence of `session`
 *   means the user is signed in. `session.access_token` is what we attach
 *   to every backend request.
 * - `subscriber` is the business-side profile fetched from `/auth/me`
 *   (name, plan, onboarding state, etc). It's populated by whoever needs
 *   it after login — typically the route guard / dashboard.
 *
 * We deliberately don't persist the session ourselves; the Supabase client
 * already persists it in localStorage under the storageKey configured in
 * lib/supabase.js. On page load we hydrate from that once, then subscribe
 * to auth-state changes so multi-tab logout works.
 */
export const useAuthStore = create((set) => ({
  session:    null,
  subscriber: null,
  ready:      false, // becomes true after the initial session hydrate resolves

  setSession:    (session)    => set({ session }),
  setSubscriber: (subscriber) => set({ subscriber }),

  logout: async () => {
    await supabase.auth.signOut();
    set({ session: null, subscriber: null });
  },
}));

// One-shot bootstrap: hydrate the current session, then keep in sync.
supabase.auth.getSession().then(({ data }) => {
  useAuthStore.setState({ session: data.session ?? null, ready: true });
});

supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.setState({ session: session ?? null });
  if (!session) useAuthStore.setState({ subscriber: null });
});
