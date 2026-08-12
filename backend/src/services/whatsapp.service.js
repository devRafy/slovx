import axios from 'axios';
import { env } from '../config/env.js';
import { decrypt } from '../utils/encryption.js';
import { db } from '../config/database.js';

const graphUrl = (version, path) =>
  `https://graph.facebook.com/${version}/${path}`;

export const sendMessage = async (phoneNumberId, encryptedToken, toPhone, text) => {
  const accessToken = decrypt(encryptedToken);
  try {
    const res = await axios.post(
      graphUrl(env.META_GRAPH_API_VERSION, `${phoneNumberId}/messages`),
      {
        messaging_product: 'whatsapp',
        recipient_type:    'individual',
        to:                toPhone,
        type:              'text',
        text:              { preview_url: false, body: text },
      },
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } },
    );
    return { success: true, waMessageId: res.data?.messages?.[0]?.id };
  } catch (err) {
    const detail = err.response?.data?.error?.message || err.message;
    return { success: false, error: detail };
  }
};

// Exchange the Embedded Signup authorization code for a permanent access token
export const exchangeCodeForToken = async (code) => {
  const res = await axios.get(graphUrl(env.META_GRAPH_API_VERSION, 'oauth/access_token'), {
    params: {
      client_id:     env.META_APP_ID,
      client_secret: env.META_APP_SECRET,
      code,
    },
  });
  return res.data.access_token;
};

// Fetch the WABA ID and phone number ID associated with an access token
export const fetchWabaDetails = async (accessToken) => {
  const debug = await axios.get(graphUrl(env.META_GRAPH_API_VERSION, 'debug_token'), {
    params: { input_token: accessToken, access_token: `${env.META_APP_ID}|${env.META_APP_SECRET}` },
  });

  const wabaId = debug.data?.data?.granular_scopes?.find(
    (s) => s.scope === 'whatsapp_business_management',
  )?.target_ids?.[0];

  if (!wabaId) throw new Error('Could not extract WABA ID from token');

  // Get phone numbers for this WABA
  const phones = await axios.get(
    graphUrl(env.META_GRAPH_API_VERSION, `${wabaId}/phone_numbers`),
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  const phone = phones.data?.data?.[0];
  if (!phone) throw new Error('No phone number found in WhatsApp Business Account');

  return {
    wabaId,
    phoneNumberId:  phone.id,
    displayPhone:   phone.display_phone_number,
  };
};

// Register a phone number with WhatsApp Cloud API so it can send/receive messages.
// Required once per number after Embedded Signup. Idempotent — safe to call again.
// Meta returns error #133010 "Account not registered" until this runs.
export const registerPhoneNumber = async (phoneNumberId, accessToken, pin = '123456') => {
  try {
    await axios.post(
      graphUrl(env.META_GRAPH_API_VERSION, `${phoneNumberId}/register`),
      { messaging_product: 'whatsapp', pin },
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } },
    );
    return { success: true };
  } catch (err) {
    const meta = err.response?.data?.error;
    // Code 133005 = already registered — treat as success
    if (meta?.code === 133005) return { success: true, alreadyRegistered: true };
    return { success: false, error: meta ? `${meta.message} (code ${meta.code})` : err.message };
  }
};

// Subscribe our app to the subscriber's WABA so webhooks are delivered here.
// Endpoint: POST /{waba-id}/subscribed_apps  (NOT phone_number_id)
export const subscribeWebhook = async (wabaId, accessToken) => {
  try {
    await axios.post(
      graphUrl(env.META_GRAPH_API_VERSION, `${wabaId}/subscribed_apps`),
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  } catch (err) {
    const meta = err.response?.data?.error;
    const detail = meta ? `${meta.message} (code ${meta.code})` : err.message;
    throw new Error(`Failed to subscribe webhook on WABA ${wabaId}: ${detail}`);
  }
};

// Lookup which subscriber owns a given phone_number_id (used in webhook routing)
export const getSubscriberByPhoneNumberId = async (phoneNumberId) => {
  const conn = await db.whatsappConnection.findUnique({
    where:   { phoneNumberId },
    include: {
      subscriber: {
        include: { businessConfig: true },
      },
    },
  });
  return conn || null;
};
