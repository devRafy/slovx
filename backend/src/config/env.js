import { z } from 'zod';

const schema = z.object({
  NODE_ENV:               z.enum(['development', 'production', 'test']).default('development'),
  PORT:                   z.coerce.number().default(4000),
  DATABASE_URL:           z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL:             z.string().min(1, 'DIRECT_URL is required'),
  JWT_SECRET:             z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN:         z.string().default('7d'),
  JWT_REFRESH_SECRET:     z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  ANTHROPIC_API_KEY:      z.string().startsWith('sk-ant-', 'Invalid Anthropic API key'),
  ANTHROPIC_MODEL:        z.string().default('claude-sonnet-4-6'),
  META_APP_ID:            z.string().min(1, 'META_APP_ID is required'),
  META_APP_SECRET:        z.string().min(1, 'META_APP_SECRET is required'),
  META_VERIFY_TOKEN:      z.string().min(1, 'META_VERIFY_TOKEN is required'),
  META_GRAPH_API_VERSION: z.string().default('v20.0'),
  FRONTEND_URL:           z.string().url().default('http://localhost:5173'),
  ENCRYPTION_KEY:         z.string().min(32, 'ENCRYPTION_KEY must be at least 32 characters'),
  // Firebase Admin credentials (Google sign-in). Optional — endpoint returns
  // 501 if not configured, so email/password auth keeps working without them.
  FIREBASE_PROJECT_ID:    z.string().optional(),
  FIREBASE_CLIENT_EMAIL:  z.string().optional(),
  FIREBASE_PRIVATE_KEY:   z.string().optional(),
  // SMTP — for transactional emails (password reset, etc.).
  // When SMTP_HOST/USER/PASS are missing, forgot-password logs the reset
  // link to the console instead of sending — fine for local dev.
  SMTP_HOST:              z.string().optional(),
  SMTP_PORT:              z.coerce.number().default(587),
  SMTP_USER:              z.string().optional(),
  SMTP_PASS:              z.string().optional(),
  EMAIL_FROM:             z.string().default('Xavier <no-reply@xavier.local>'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  parsed.error.issues.forEach((issue) => {
    console.error(`   ${issue.path.join('.')}: ${issue.message}`);
  });
  process.exit(1);
}

export const env = parsed.data;
