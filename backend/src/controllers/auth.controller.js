import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import { env } from '../config/env.js';
import { verifyFirebaseIdToken } from '../config/firebase.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  hashPassword, comparePassword,
  generateTokens, saveRefreshToken,
  rotateRefreshToken, revokeRefreshToken,
} from '../services/auth.service.js';
import { sendPasswordResetEmail } from '../services/email.service.js';

// Reset tokens are signed JWTs (1h expiry). Namespaced with a purpose claim
// so they can't be used as regular access tokens.
const RESET_TOKEN_TTL = '1h';
const RESET_TOKEN_PURPOSE = 'password-reset';

export const registerSchema = z.object({
  name:     z.string().min(2).max(100),
  email:    z.string().email(),
  password: z.string().min(8).max(72).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and a number',
  ),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms of Service and Privacy Policy' }),
  }),
});

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export const googleLoginSchema = z.object({
  idToken: z.string().min(10, 'Firebase ID token is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token:    z.string().min(10, 'Reset token is required'),
  password: z.string().min(8).max(72).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and a number',
  ),
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await db.subscriber.findUnique({ where: { email } });
  if (existing) return sendError(res, 'Email already registered', 409);

  const hashed = await hashPassword(password);
  const subscriber = await db.subscriber.create({
    data: { name, email, password: hashed, acceptedTermsAt: new Date() },
    select: { id: true, name: true, email: true, plan: true },
  });

  const tokens = generateTokens(subscriber.id);
  await saveRefreshToken(subscriber.id, tokens.refreshToken);

  sendSuccess(res, { subscriber, ...tokens }, 'Account created successfully', 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const subscriber = await db.subscriber.findUnique({ where: { email } });
  if (!subscriber) return sendError(res, 'Invalid email or password', 401);
  if (!subscriber.isActive) return sendError(res, 'Account is deactivated', 401);
  if (!subscriber.password) {
    return sendError(res, 'This account uses Google sign-in. Click "Continue with Google".', 401);
  }

  const valid = await comparePassword(password, subscriber.password);
  if (!valid) return sendError(res, 'Invalid email or password', 401);

  const tokens = generateTokens(subscriber.id);
  await saveRefreshToken(subscriber.id, tokens.refreshToken);

  const { password: _, ...safe } = subscriber;
  sendSuccess(res, { subscriber: safe, ...tokens }, 'Login successful');
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  let decoded;
  try {
    decoded = await verifyFirebaseIdToken(idToken);
  } catch (err) {
    if (err.statusCode === 501) return sendError(res, err.message, 501);
    // Log the real cause so we can debug config problems (bad private key,
    // wrong project ID, clock skew, revoked token, etc). Do NOT leak the
    // internal message back to the client.
    console.error('[auth/google] Firebase verifyIdToken failed:', {
      code:    err.code,
      message: err.message,
    });
    return sendError(res, 'Invalid Google credentials', 401);
  }

  const { uid, email, name } = decoded;
  if (!email) return sendError(res, 'Google account did not provide an email', 400);

  // Match by googleUid first (fastest), then fall back to email so users who
  // originally signed up with email/password get linked to their Google UID.
  let subscriber = await db.subscriber.findUnique({ where: { googleUid: uid } });
  if (!subscriber) subscriber = await db.subscriber.findUnique({ where: { email } });

  if (subscriber) {
    // Link the Google UID if this account was created via email/password.
    if (!subscriber.googleUid) {
      subscriber = await db.subscriber.update({
        where: { id: subscriber.id },
        data:  { googleUid: uid, authProvider: subscriber.authProvider },
      });
    }
    if (!subscriber.isActive) return sendError(res, 'Account is deactivated', 401);
  } else {
    // Brand-new user — auto-create with Google-provided name/email.
    subscriber = await db.subscriber.create({
      data: {
        email,
        name:            name || email.split('@')[0],
        authProvider:    'GOOGLE',
        googleUid:       uid,
        acceptedTermsAt: new Date(),
      },
    });
  }

  const tokens = generateTokens(subscriber.id);
  await saveRefreshToken(subscriber.id, tokens.refreshToken);

  const { password: _, ...safe } = subscriber;
  sendSuccess(res, { subscriber: safe, ...tokens }, 'Google sign-in successful');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Always respond with the same success message — never disclose whether an
  // email exists (email-enumeration protection). We just skip sending if
  // there's no user, or if the user signed up via Google.
  const subscriber = await db.subscriber.findUnique({ where: { email } });

  if (subscriber && subscriber.isActive && subscriber.password) {
    const token = jwt.sign(
      { sub: subscriber.id, purpose: RESET_TOKEN_PURPOSE },
      env.JWT_SECRET,
      { expiresIn: RESET_TOKEN_TTL },
    );
    const resetUrl = `${env.FRONTEND_URL.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;

    try {
      await sendPasswordResetEmail({ to: email, name: subscriber.name, resetUrl });
      console.log(`[forgot-password] Reset email dispatched to ${email}`);
    } catch (err) {
      console.error('[forgot-password] Email send failed:', err.message, err.stack);
      // Still return the same success message — never disclose the send-status.
    }
  } else if (subscriber && !subscriber.password) {
    console.log(`[forgot-password] Skipped for Google-only account: ${email}`);
  } else {
    console.log(`[forgot-password] No matching account for ${email}`);
  }

  sendSuccess(res, {}, "If an account exists for that email, we've sent a password-reset link.");
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch {
    return sendError(res, 'This reset link is invalid or has expired. Please request a new one.', 400);
  }

  if (payload.purpose !== RESET_TOKEN_PURPOSE) {
    return sendError(res, 'This reset link is invalid or has expired. Please request a new one.', 400);
  }

  const subscriber = await db.subscriber.findUnique({ where: { id: payload.sub } });
  if (!subscriber || !subscriber.isActive) {
    return sendError(res, 'Account not found', 404);
  }

  const hashed = await hashPassword(password);
  await db.subscriber.update({
    where: { id: subscriber.id },
    data:  { password: hashed },
  });

  // Revoke any active refresh tokens — force re-login everywhere for safety.
  await db.refreshToken.deleteMany({ where: { subscriberId: subscriber.id } });

  sendSuccess(res, {}, 'Password updated. You can now sign in with your new password.');
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return sendError(res, 'Refresh token required', 400);
  const tokens = await rotateRefreshToken(refreshToken);
  sendSuccess(res, tokens, 'Tokens refreshed');
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) await revokeRefreshToken(refreshToken);
  sendSuccess(res, {}, 'Logged out successfully');
});

export const me = asyncHandler(async (req, res) => {
  const subscriber = await db.subscriber.findUnique({
    where: { id: req.subscriber.id },
    select: {
      id: true, name: true, email: true, plan: true,
      botEnabled: true, acceptedTermsAt: true, createdAt: true,
      businessConfig:     { select: { isComplete: true, companyName: true } },
      whatsappConnection: { select: { displayPhone: true, isActive: true } },
    },
  });
  sendSuccess(res, subscriber);
});
