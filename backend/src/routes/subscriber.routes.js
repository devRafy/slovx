import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { db } from '../config/database.js';

const router = Router();
router.use(authenticate);

// GET /api/subscriber/profile
router.get('/profile', asyncHandler(async (req, res) => {
  const subscriber = await db.subscriber.findUnique({
    where: { id: req.subscriber.id },
    select: {
      id: true, name: true, email: true, plan: true, createdAt: true,
      businessConfig:     true,
      whatsappConnection: { select: { displayPhone: true, isActive: true } },
    },
  });
  sendSuccess(res, subscriber);
}));

export default router;
