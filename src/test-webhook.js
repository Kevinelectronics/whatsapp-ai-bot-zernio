/**
 * Simulate an incoming WhatsApp message (for local demo/testing)
 * Usage: node src/test-webhook.js "Your message here"
 */

const message = process.argv[2] ?? "Hello! Who are you?";

const payload = {
  metadata: {
    source: "platform",
    conversationId: `conv_${Date.now()}`,
    platformConversationId: `wa_${Date.now()}`,
  },
  message: {
    content: message,
    timestamp: Math.floor(Date.now() / 1000),
  },
  participant: {
    phoneE164: "+1234567890",
    name: "Test User",
  },
};

const res = await fetch("http://localhost:3000/webhook", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

console.log(`Sent: "${message}"`);
console.log(`Status: ${res.status}`);
