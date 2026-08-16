// Booking intent detection.
//
// Xavier doesn't book calendar slots directly (that would need Google/Calendly OAuth
// per-subscriber). Instead we detect when a customer wants to book, and inject a
// prompt hint that instructs the AI to share the subscriber's calendar link naturally.
// This is the "hands-free calendar booking" MVP — full read/write integration is a
// later phase feature that requires OAuth setup.

const BOOKING_KEYWORDS = [
  // English
  'book', 'schedule', 'meeting', 'call', 'demo', 'appointment', 'slot', 'when can we',
  'available', 'availability', 'calendar',
  // Arabic
  'موعد', 'حجز', 'اجتماع',
  // Urdu
  'وقت', 'ملاقات',
];

export const hasBookingIntent = (text) => {
  if (!text) return false;
  const lower = text.toLowerCase();
  return BOOKING_KEYWORDS.some((kw) => lower.includes(kw));
};

// Prompt hint the AI receives when booking intent is detected AND a calendar link exists.
export const bookingHint = (calendarLink) =>
  `NOTE: The customer appears to want to book a meeting or call. Share this scheduling link naturally in your reply and invite them to pick a time: ${calendarLink}`;
