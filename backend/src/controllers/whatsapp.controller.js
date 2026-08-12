import { db } from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { encrypt } from '../utils/encryption.js';
import {
  exchangeCodeForToken,
  fetchWabaDetails,
  subscribeWebhook,
  sendMessage,
  registerPhoneNumber,
} from '../services/whatsapp.service.js';
import { decrypt } from '../utils/encryption.js';

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

  // Register the phone number with Cloud API so it can send/receive (non-fatal)
  const reg = await registerPhoneNumber(phoneNumberId, accessToken);
  if (!reg.success) {
    console.warn('[whatsapp] phone number registration failed:', reg.error);
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

// POST /api/whatsapp/register
// Registers the subscriber's connected phone number with Meta's Cloud API.
// Fixes error #133010 ("Account not registered") for numbers connected before auto-register was added.
export const registerNumber = asyncHandler(async (req, res) => {
  const conn = await db.whatsappConnection.findUnique({
    where: { subscriberId: req.subscriber.id },
  });
  if (!conn) return sendError(res, 'No WhatsApp connection found. Connect first.', 400);

  const accessToken = decrypt(conn.accessToken);
  const result = await registerPhoneNumber(conn.phoneNumberId, accessToken);

  if (!result.success) return sendError(res, result.error || 'Registration failed', 502);
  sendSuccess(
    res,
    { alreadyRegistered: !!result.alreadyRegistered },
    result.alreadyRegistered
      ? 'Number was already registered'
      : 'Number registered — you can now send/receive messages',
  );
});

// POST /api/whatsapp/test-message
// Sends a test WhatsApp message from the subscriber's connected number
// to a phone number they specify (typically their own personal WhatsApp).
export const sendTestMessage = asyncHandler(async (req, res) => {
  const { toPhone, body } = req.body ?? {};
  if (!toPhone || typeof toPhone !== 'string') {
    return sendError(res, 'toPhone is required (WhatsApp number with country code, no + sign)', 400);
  }

  const conn = await db.whatsappConnection.findUnique({
    where: { subscriberId: req.subscriber.id },
  });
  if (!conn || !conn.isActive) {
    return sendError(res, 'No active WhatsApp connection. Connect WhatsApp first.', 400);
  }

  const messageBody = body?.trim()
    || "Hi! This is a test message from Xavier — your WhatsApp connection is working. 🎉";

  const result = await sendMessage(
    conn.phoneNumberId,
    conn.accessToken,
    toPhone.replace(/[^0-9]/g, ''),
    messageBody,
  );

  if (!result.success) return sendError(res, result.error || 'Failed to send test message', 502);
  sendSuccess(res, { waMessageId: result.waMessageId }, 'Test message sent');
});
