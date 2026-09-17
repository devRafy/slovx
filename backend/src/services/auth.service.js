import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { db } from '../config/database.js';

const SALT_ROUNDS = 12;

export const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);

export const generateTokens = (subscriberId) => {
  const accessToken = jwt.sign({ sub: subscriberId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ sub: subscriberId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
};

export const saveRefreshToken = async (subscriberId, token) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  await db.refreshToken.create({ data: { subscriberId, token, expiresAt } });
};

export const rotateRefreshToken = async (oldToken) => {
  const record = await db.refreshToken.findUnique({ where: { token: oldToken } });
  if (!record || record.expiresAt < new Date()) {
    throw Object.assign(new Error('Invalid or expired refresh token'), { statusCode: 401 });
  }

  // Verify JWT
  const payload = jwt.verify(oldToken, env.JWT_REFRESH_SECRET);
  await db.refreshToken.delete({ where: { token: oldToken } });

  const tokens = generateTokens(payload.sub);
  await saveRefreshToken(payload.sub, tokens.refreshToken);
  return tokens;
};

export const revokeRefreshToken = async (token) => {
  await db.refreshToken.deleteMany({ where: { token } }).catch(() => {});
};
