import { z } from 'zod';
import { db } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  hashPassword, comparePassword,
  generateTokens, saveRefreshToken,
  rotateRefreshToken, revokeRefreshToken,
} from '../services/auth.service.js';

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

  const valid = await comparePassword(password, subscriber.password);
  if (!valid) return sendError(res, 'Invalid email or password', 401);

  const tokens = generateTokens(subscriber.id);
  await saveRefreshToken(subscriber.id, tokens.refreshToken);

  const { password: _, ...safe } = subscriber;
  sendSuccess(res, { subscriber: safe, ...tokens }, 'Login successful');
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
