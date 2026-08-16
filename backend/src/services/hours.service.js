// Business hours + night-fallback service.
//
// The business config stores {timezone, businessHoursStart, businessHoursEnd} as local hours (0-23).
// We compute the current local hour in the business's timezone using Intl (no external deps).
//
// When called AFTER hours, we don't skip the AI reply — we just prepend a "note" that the
// AI uses to acknowledge the late-hour context ("thanks for messaging outside our hours,
// we'll follow up first thing tomorrow morning").

// Returns the current hour (0-23) in the given IANA timezone. Falls back to server time on error.
export const currentHourInTz = (tz) => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit', hour12: false, timeZone: tz,
    });
    return parseInt(formatter.format(new Date()), 10);
  } catch {
    return new Date().getHours();
  }
};

// Returns true if the current time is WITHIN business hours (open ≤ hour < close).
// Handles the overnight case (e.g. open=22, close=6 spans midnight).
export const isBusinessOpen = ({ timezone, businessHoursStart = 9, businessHoursEnd = 21 }) => {
  const hour = currentHourInTz(timezone);
  if (businessHoursStart <= businessHoursEnd) {
    return hour >= businessHoursStart && hour < businessHoursEnd;
  }
  // Overnight schedule (e.g. 22:00 – 06:00)
  return hour >= businessHoursStart || hour < businessHoursEnd;
};

// Short string used as a system-prompt hint when the bot is replying after hours.
// The AI receives this and can gracefully acknowledge without blocking the interaction.
export const afterHoursHint = ({ businessHoursStart = 9, businessHoursEnd = 21 }) =>
  `NOTE: It is currently OUTSIDE the business's operating hours (open ${businessHoursStart}:00–${businessHoursEnd}:00 local time). ` +
  `Keep replies brief, acknowledge the late hour, and offer to book/confirm in the morning. Do not commit to same-day actions.`;
