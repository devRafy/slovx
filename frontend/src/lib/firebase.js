import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

/**
 * Firebase client — used only for Google sign-in. We hand the ID token to
 * our own backend (/auth/google), which verifies it and issues our JWT.
 * All values come from Vite env vars — configure them in .env or Vercel.
 */

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId,
);

let app;
let auth;
let provider;

if (isFirebaseConfigured) {
  app      = initializeApp(firebaseConfig);
  auth     = getAuth(app);
  provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
}

/**
 * Opens the Google sign-in popup and resolves with a Firebase ID token
 * ready to send to the backend. Throws with a friendly message on cancel
 * or if Firebase is not configured.
 */
export async function signInWithGoogle() {
  if (!isFirebaseConfigured) {
    throw new Error('Google sign-in is not configured. Please contact support.');
  }
  const result = await signInWithPopup(auth, provider);
  return result.user.getIdToken();
}
