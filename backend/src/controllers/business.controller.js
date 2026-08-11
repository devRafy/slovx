import { z } from 'zod';
import { db } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const productSchema = z.object({
  name:         z.string().min(1),
  price:        z.number().positive(),
  billingCycle: z.enum(['monthly', 'yearly', 'one_time']),
  description:  z.string().min(1),
  features:     z.array(z.string()).min(1),
});

export const businessConfigSchema = z.object({
  companyName:    z.string().min(2).max(100),
  industry:       z.string().min(2).max(100),
  products:       z.array(productSchema).min(1, 'At least one product is required'),
  discountPolicy: z.string().min(1),
  refundPolicy:   z.string().min(1),
  calendarLink:   z.string().url().optional().or(z.literal('')),
  ownerPhone:     z.string().optional(),
  timezone:       z.string().default('Asia/Karachi'),
  aiPersonality:  z.enum(['professional', 'friendly', 'formal']).default('professional'),
});

export const getConfig = asyncHandler(async (req, res) => {
  const config = await db.businessConfig.findUnique({
    where: { subscriberId: req.subscriber.id },
  });
  sendSuccess(res, config);
});

export const upsertConfig = asyncHandler(async (req, res) => {
  const config = await db.businessConfig.upsert({
    where:  { subscriberId: req.subscriber.id },
    create: { subscriberId: req.subscriber.id, ...req.body, isComplete: true },
    update: { ...req.body, isComplete: true },
  });
  sendSuccess(res, config, 'Business configuration saved');
});

export const getOnboardingStatus = asyncHandler(async (req, res) => {
  const [config, connection] = await Promise.all([
    db.businessConfig.findUnique({ where: { subscriberId: req.subscriber.id }, select: { isComplete: true } }),
    db.whatsappConnection.findUnique({ where: { subscriberId: req.subscriber.id }, select: { isActive: true } }),
  ]);
  sendSuccess(res, {
    businessConfigured: config?.isComplete ?? false,
    whatsappConnected:  connection?.isActive ?? false,
    isReady:           (config?.isComplete && connection?.isActive) ?? false,
  });
});
