import admin from 'firebase-admin';
import { env } from './env.js';

/**
 * Firebase Admin SDK — used to verify ID tokens the frontend gets after a
 * Google sign-in. Initialised lazily so the server still boots when the
 * three FIREBASE_* env vars aren't set (Google sign-in just returns 501).
 */

let app;

function init() {
  if (app) return app;

  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    return null;
  }

  // Vercel/other envs escape newlines in the private key — restore them.
  const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId:   env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });

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
  return admin.auth(instance).verifyIdToken(idToken);
}
