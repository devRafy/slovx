import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { db } from '../config/database.js';
import { sendError } from '../utils/response.js';

export const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return sendError(res, 'No token provided', 401);
  }

  const token = header.split(' ')[1];
  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') return sendError(res, 'Token expired', 401);
    return sendError(res, 'Invalid token', 401);
  }

  try {
    const subscriber = await db.subscriber.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, plan: true, isActive: true },
    });

    if (!subscriber || !subscriber.isActive) {
      return sendError(res, 'Account not found or deactivated', 401);
    }

    req.subscriber = subscriber;
    next();
  } catch (err) {
    next(err);
  }
};
