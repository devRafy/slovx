import { z } from 'zod';

const schema = z.object({
  NODE_ENV:               z.enum(['development', 'production', 'test']).default('development'),
  PORT:                   z.coerce.number().default(4000),
  DATABASE_URL:           z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL:             z.string().min(1, 'DIRECT_URL is required'),

  // Supabase — replaces custom JWT + Firebase Admin + SMTP flows.
  // Auth tokens are issued by Supabase; the backend only verifies them.
  SUPABASE_URL:              z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  SUPABASE_JWT_SECRET:       z.string().min(20, 'SUPABASE_JWT_SECRET is required'),

  ANTHROPIC_API_KEY:      z.string().startsWith('sk-ant-', 'Invalid Anthropic API key'),
  ANTHROPIC_MODEL:        z.string().default('claude-sonnet-4-6'),
  META_APP_ID:            z.string().min(1, 'META_APP_ID is required'),
  META_APP_SECRET:        z.string().min(1, 'META_APP_SECRET is required'),
  META_VERIFY_TOKEN:      z.string().min(1, 'META_VERIFY_TOKEN is required'),
  META_GRAPH_API_VERSION: z.string().default('v20.0'),
  FRONTEND_URL:           z.string().url().default('http://localhost:5173'),
  // Optional comma-separated list of additional allowed CORS origins
  // (e.g. custom domains). Vercel *.vercel.app previews are auto-allowed.
  EXTRA_FRONTEND_ORIGINS: z.string().optional(),
  ENCRYPTION_KEY:         z.string().min(32, 'ENCRYPTION_KEY must be at least 32 characters'),
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
