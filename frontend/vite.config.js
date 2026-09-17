import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_BASE_PATH lets prod deploys serve the SPA under a subpath (e.g.
// "/dashboard/") without touching source. Local dev defaults to "/" so
// the Vite dev server proxy still works as-is.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
});
