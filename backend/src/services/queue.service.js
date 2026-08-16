// Smart multi-text burst queue.
//
// When a customer sends multiple messages in quick succession ("hi", "are you there",
// "I want the enterprise plan") we don't want the AI to fire 3 separate replies stepping
// on each other. Instead we buffer messages per-conversation, restart a debounce timer
// on each new message, and process the batch as one prompt after N seconds of silence.
//
// LIMITATION: This is in-memory (per-instance). Fine for a single Railway service.
// If we ever horizontally scale, swap the Map for Redis with atomic ops.

const DEBOUNCE_MS = 4000; // wait 4s after the last message before flushing

// Map key: `${subscriberId}:${customerPhone}`
// Value: { messages: string[], timer: NodeJS.Timeout, flush: () => Promise<void> }
const buffers = new Map();

const key = (subscriberId, customerPhone) => `${subscriberId}:${customerPhone}`;

/**
 * Add an incoming message to the debounce buffer. When the buffer is idle for
 * DEBOUNCE_MS, `processor(joinedText)` is invoked with all pending messages
 * concatenated (newline-separated).
 *
 * If the buffer already exists, the timer resets and the new message is appended.
 */
export const enqueueMessage = (subscriberId, customerPhone, text, processor) => {
  const k = key(subscriberId, customerPhone);
  const existing = buffers.get(k);

  if (existing) {
    existing.messages.push(text);
    clearTimeout(existing.timer);
    existing.timer = setTimeout(existing.flush, DEBOUNCE_MS);
    return;
  }

  const entry = {
    messages: [text],
    timer: null,
    flush: null,
  };

  entry.flush = async () => {
    buffers.delete(k);
    const combined = entry.messages.join('\n');
    try {
      await processor(combined);
    } catch (err) {
      console.error('[queue] processor failed for', k, err.message);
    }
  };

  entry.timer = setTimeout(entry.flush, DEBOUNCE_MS);
  buffers.set(k, entry);
};

// Test/debug helper — number of active buffers.
export const activeBufferCount = () => buffers.size;
