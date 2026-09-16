import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { db } from '../config/database.js';
import { sendError } from '../utils/response.js';

/**
 * Verify a Supabase-issued JWT and load (or lazily create) the matching
 * Subscriber row. Supabase signs access tokens with SUPABASE_JWT_SECRET
 * using HS256 — we verify locally, no round-trip to Supabase.
 *
 * On first request from a new Supabase user, we create the Subscriber row
 * so business logic downstream doesn't have to null-check. The `authId`
 * column links Subscriber ↔ auth.users.id.
 */
export const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return sendError(res, 'No token provided', 401);
  }

  const token = header.split(' ')[1];
  let payload;
  try {
    payload = jwt.verify(token, env.SUPABASE_JWT_SECRET, { algorithms: ['HS256'] });
  } catch (err) {
    if (err.name === 'TokenExpiredError') return sendError(res, 'Token expired', 401);
    return sendError(res, 'Invalid token', 401);
  }

  const authId = payload.sub;
  const email  = payload.email;
  if (!authId || !email) return sendError(res, 'Malformed token payload', 401);

  try {
    let subscriber = await db.subscriber.findUnique({
      where: { authId },
      select: { id: true, authId: true, email: true, name: true, plan: true, isActive: true },
    });

    // First request from a newly registered Supabase user — provision the row.
    if (!subscriber) {
      const displayName =
        payload.user_metadata?.name ||
        payload.user_metadata?.full_name ||
        email.split('@')[0];

      subscriber = await db.subscriber.create({
        data: {
          authId,
          email,
          name: displayName,
          acceptedTermsAt: new Date(),
        },
        select: { id: true, authId: true, email: true, name: true, plan: true, isActive: true },
      });
    }

    if (!subscriber.isActive) {
      return sendError(res, 'Account is deactivated', 401);
    }

    req.subscriber = subscriber;
    next();
  } catch (err) {
    next(err);
  }
};
