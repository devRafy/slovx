import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { db } from '../config/database.js';

const router = Router();
router.use(authenticate);

// GET /api/subscriber/profile
router.get('/profile', asyncHandler(async (req, res) => {
  const subscriber = await db.subscriber.findUnique({
    where: { id: req.subscriber.id },
    select: {
      id: true, name: true, email: true, plan: true,
      botEnabled: true, createdAt: true,
      businessConfig:     true,
      whatsappConnection: { select: { displayPhone: true, isActive: true } },
    },
  });
  sendSuccess(res, subscriber);
}));

// PATCH /api/subscriber/bot-toggle
const botToggleSchema = z.object({ enabled: z.boolean() });

router.patch('/bot-toggle', asyncHandler(async (req, res) => {
  const parsed = botToggleSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, 'Invalid body: enabled (boolean) required', 400);

  const subscriber = await db.subscriber.update({
    where: { id: req.subscriber.id },
    data:  { botEnabled: parsed.data.enabled },
    select: { id: true, botEnabled: true },
  });

  sendSuccess(res, subscriber, `Bot ${subscriber.botEnabled ? 'resumed' : 'paused'}`);
}));

export default router;
