import { db } from '../config/database.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Return the currently signed-in subscriber, including onboarding state
 * needed by the frontend to route between /dashboard and /onboarding.
 *
 * Register / login / refresh / logout / password-reset all live in Supabase
 * now — the frontend calls @supabase/supabase-js directly. This endpoint is
 * the only place the backend produces user-facing account data.
 */
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
