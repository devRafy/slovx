import axios from 'axios';
import { useAuthStore } from '../store/auth.store.js';

// VITE_API_URL points to the backend (Railway URL in prod). In dev, empty string
// means requests go through Vite's proxy at /api → localhost:4000.
// Strip BOM + whitespace defensively — some CI env stores (Vercel via piped stdin)
// prepend a UTF-8 BOM which silently breaks fetch.
const rawApi = (import.meta.env.VITE_API_URL || '').replace(/^﻿/, '').trim();
const API_BASE = rawApi ? `${rawApi.replace(/\/$/, '')}/api` : '/api';

const client = axios.create({ baseURL: API_BASE });

// Attach access token to every request
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Endpoints that authenticate the user — a 401 here is a bad-credentials
// rejection, not an expired session, so we must NOT try to refresh + redirect.
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/google', '/auth/refresh'];

// On 401, attempt token refresh once then log out — except for auth endpoints.
client.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const url = original?.url || '';
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => url.includes(path));

    if (err.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        const { refreshToken } = useAuthStore.getState();
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        useAuthStore.getState().setTokens(data.data.accessToken, data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return client(original);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  },
);

export default client;
