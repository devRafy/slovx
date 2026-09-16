import client from './client.js';

// Auth flows (register / login / password reset / OAuth) go through
// @supabase/supabase-js directly on the frontend. The only backend auth
// endpoint we still call is /me for the subscriber profile.
export const authApi = {
  me: () => client.get('/auth/me'),
};
