import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './src/config/env.js';
import { connectDB } from './src/config/database.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { rateLimiter } from './src/middleware/rateLimiter.js';

import authRoutes from './src/routes/auth.routes.js';
import subscriberRoutes from './src/routes/subscriber.routes.js';
import businessRoutes from './src/routes/business.routes.js';
import webhookRoutes from './src/routes/webhook.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import whatsappRoutes from './src/routes/whatsapp.routes.js';

const app = express();

// Behind Railway's proxy — trust the first hop so rate-limit + IP logging work correctly.
app.set('trust proxy', 1);

// ── Security & logging ────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// ── Body parsing ──────────────────────────────────────────────
// Raw body needed for webhook signature verification
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ─────────────────────────────────────────────
app.use('/api/', rateLimiter);

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/subscriber', subscriberRoutes);
app.use('/api/business',   businessRoutes);
app.use('/api/webhook',    webhookRoutes);
app.use('/api/dashboard',  dashboardRoutes);
app.use('/api/whatsapp',   whatsappRoutes);

// ── Health check ──────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Xavier SaaS backend running on port ${env.PORT} [${env.NODE_ENV}]`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err.message);
    process.exit(1);
  });

export default app;
