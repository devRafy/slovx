// Meta's 24-hour customer service window rule:
// After a customer sends a message, the business can freely reply for 24 hours.
// After 24 hours of customer silence, only pre-approved template messages can go out.
// We enforce this by tracking `Conversation.lastCustomerMessageAt` and checking it before every outbound send.

const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

// Given a timestamp (or null), returns true if the 24h window is still open.
export const isWithinWindow = (lastCustomerMessageAt) => {
  if (!lastCustomerMessageAt) return false;
  const last = new Date(lastCustomerMessageAt).getTime();
  return Date.now() - last < WINDOW_MS;
};

// Human-readable minutes remaining in the window (used in warnings/logs).
export const minutesRemainingInWindow = (lastCustomerMessageAt) => {
  if (!lastCustomerMessageAt) return 0;
  const elapsed = Date.now() - new Date(lastCustomerMessageAt).getTime();
  return Math.max(0, Math.ceil((WINDOW_MS - elapsed) / 60000));
};
