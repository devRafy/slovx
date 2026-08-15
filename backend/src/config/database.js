import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma ?? new PrismaClient({
  // Prod: only error logs (cuts spam). Dev: include queries/warns.
  log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

export async function connectDB() {
  await db.$connect();
  console.log('✅ Database connected');
}

// Cleanly release connections when the process exits — prevents Supabase pool
// leaks on Railway rolling restarts and local nodemon reloads.
const shutdown = async (signal) => {
  console.log(`Received ${signal}, closing DB connections…`);
  await db.$disconnect().catch(() => {});
  process.exit(0);
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('beforeExit', () => db.$disconnect().catch(() => {}));
