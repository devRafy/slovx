import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken:  null,
      refreshToken: null,
      subscriber:   null,

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setSubscriber: (subscriber) => set({ subscriber }),

      login: (data) => set({
        accessToken:  data.accessToken,
        refreshToken: data.refreshToken,
        subscriber:   data.subscriber,
      }),

      logout: () => set({ accessToken: null, refreshToken: null, subscriber: null }),
    }),
    { name: 'xavier-auth' },
  ),
);
