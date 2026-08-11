import { db } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { encrypt } from '../utils/encryption.js';
import {
  exchangeCodeForToken,
  fetchWabaDetails,
  subscribeWebhook,
} from '../services/whatsapp.service.js';

// POST /api/whatsapp/connect
// Called by frontend after Embedded Signup completes with an auth code
export const connectWhatsApp = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) return sendError(res, 'Authorization code is required', 400);

  // Exchange code → access token
  const accessToken  = await exchangeCodeForToken(code);
  const { wabaId, phoneNumberId, displayPhone } = await fetchWabaDetails(accessToken);

  // Register our webhook against the WABA (non-fatal — if it fails, connection still saves)
  try {
    await subscribeWebhook(wabaId, accessToken);
  } catch (err) {
    console.warn('[whatsapp] webhook subscription failed:', err.message);
  }

  // Check if another subscriber already has this number
  const existing = await db.whatsappConnection.findUnique({ where: { phoneNumberId } });
  if (existing && existing.subscriberId !== req.subscriber.id) {
    return sendError(res, 'This WhatsApp number is already connected to another account', 409);
  }

  const encryptedToken = encrypt(accessToken);

  const connection = await db.whatsappConnection.upsert({
    where:  { subscriberId: req.subscriber.id },
    create: {
      subscriberId:  req.subscriber.id,
      phoneNumberId,
      wabaId,
      accessToken:   encryptedToken,
      displayPhone,
    },
    update: {
      phoneNumberId,
      wabaId,
      accessToken:   encryptedToken,
      displayPhone,
      isActive:      true,
    },
  });

  sendSuccess(res, {
    displayPhone:   connection.displayPhone,
    isActive:       connection.isActive,
  }, 'WhatsApp connected successfully');
});

// DELETE /api/whatsapp/disconnect
export const disconnectWhatsApp = asyncHandler(async (req, res) => {
  await db.whatsappConnection.deleteMany({ where: { subscriberId: req.subscriber.id } });
  sendSuccess(res, {}, 'WhatsApp disconnected');
});

// GET /api/whatsapp/status
export const getStatus = asyncHandler(async (req, res) => {
  const conn = await db.whatsappConnection.findUnique({
    where:  { subscriberId: req.subscriber.id },
    select: { displayPhone: true, isActive: true, createdAt: true },
  });
  sendSuccess(res, conn ?? { isActive: false });
});
