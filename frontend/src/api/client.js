import axios from 'axios';
import { supabase } from '../lib/supabase.js';
import { useAuthStore } from '../store/auth.store.js';

// VITE_API_URL points to the backend host. In dev, empty string means
// requests go through Vite's proxy at /api → localhost:4000.
// Strip BOM + whitespace defensively — some CI env stores (Vercel via
// piped stdin) prepend a UTF-8 BOM which silently breaks fetch.
const rawApi = (import.meta.env.VITE_API_URL || '').replace(/^﻿/, '').trim();
const API_BASE = rawApi ? `${rawApi.replace(/\/$/, '')}/api` : '/api';

const client = axios.create({ baseURL: API_BASE });

// Attach the current Supabase access token to every request. Supabase's
// client auto-refreshes the token in the background, so a fresh call to
// getSession() is cheap (reads from memory / localStorage).
client.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 we don't try to refresh — Supabase does that for us. Just log the
// user out and bounce to /login so they can sign in again.
client.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await useAuthStore.getState().logout();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  },
);

export default client;
