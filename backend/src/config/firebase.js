import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { env } from './env.js';

/**
 * Firebase Admin SDK — used to verify ID tokens the frontend gets after a
 * Google sign-in. Initialised lazily so the server still boots when the
 * three FIREBASE_* env vars aren't set (Google sign-in just returns 501).
 *
 * Uses the modular firebase-admin v13+ API (`firebase-admin/app` +
 * `firebase-admin/auth`), which is the current recommended import shape.
 */

let app;

function init() {
  if (app) return app;

  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    return null;
  }

  // Vercel/other envs escape newlines in the private key — restore them.
  // dotenv on some setups already converts \n → real newline inside double
  // quotes, so this is a no-op in those cases (safe either way).
  const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') ||
      !privateKey.includes('-----END PRIVATE KEY-----')) {
    console.error('[firebase] FIREBASE_PRIVATE_KEY is malformed — missing BEGIN/END markers');
    return null;
  }
  if (!privateKey.includes('\n')) {
    console.error('[firebase] FIREBASE_PRIVATE_KEY has no real newlines — check .env quoting');
    return null;
  }

  // Guard against double-init in dev when nodemon hot-reloads.
  const existing = getApps()[0];
  app = existing ?? initializeApp({
    credential: cert({
      projectId:   env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });

  console.log(`[firebase] Admin initialised for project ${env.FIREBASE_PROJECT_ID}`);
  return app;
}

export const isFirebaseConfigured = () =>
  Boolean(env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY);

/**
 * Verify a Firebase ID token and return the decoded payload.
 * Throws if Firebase isn't configured or the token is invalid.
 */
export async function verifyFirebaseIdToken(idToken) {
  const instance = init();
  if (!instance) {
    const err = new Error('Google sign-in is not configured on the server');
    err.statusCode = 501;
    throw err;
  }
  return getAuth(instance).verifyIdToken(idToken);
}
