// In-memory conversation store — swap for Redis/DB in production
const conversations = new Map();

const MAX_HISTORY = 20; // Keep last 20 messages per conversation

export function getHistory(phoneNumber) {
  return conversations.get(phoneNumber) ?? [];
}

export function addMessage(phoneNumber, role, content) {
  const history = getHistory(phoneNumber);
  history.push({ role, content });

  // Trim to max history length (keep system context fresh)
  if (history.length > MAX_HISTORY) {
    history.splice(0, history.length - MAX_HISTORY);
  }

  conversations.set(phoneNumber, history);
}

export function clearHistory(phoneNumber) {
  conversations.delete(phoneNumber);
}

export function listActiveConversations() {
  return [...conversations.keys()];
}
