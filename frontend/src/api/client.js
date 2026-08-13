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

// On 401, attempt token refresh once then log out
client.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
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
