import { config } from "dotenv";
config({ override: true });
import express from "express";
import { getAIResponse } from "./claude.js";
import { sendWhatsAppMessage } from "./zernio.js";
import { getHistory, addMessage, clearHistory } from "./store.js";

const app = express();
app.use(express.json());

// ─── Webhook verification ─────────────────────────────────────────────────────
app.get("/webhook", (req, res) => {
  console.log("✅ Webhook verification request received");
  // Support Meta-style challenge
  const challenge = req.query["hub.challenge"];
  if (challenge) return res.send(challenge);
  res.status(200).json({ status: "ok" });
});

// ─── Incoming WhatsApp messages ───────────────────────────────────────────────
app.post("/webhook", async (req, res) => {
  // Respond immediately so Zernio doesn't retry
  res.sendStatus(200);

  const { event, message, conversation } = req.body;

  if (event !== "message.received" || !message?.text || message?.direction !== "incoming") return;

  const conversationId = message.conversationId ?? conversation?.id;
  const phoneNumber = message.sender?.phoneNumber;
  const userMessage = message.text;

  console.log(`📨 [${phoneNumber}] ${userMessage}`);

  try {
    if (userMessage.trim() === "/clear") {
      clearHistory(phoneNumber);
      await sendWhatsAppMessage(conversationId, "🗑️ Conversation cleared! Fresh start — how can I help you?");
      return;
    }

    if (userMessage.trim() === "/help") {
      const helpText =
        "🤖 *WhatsApp AI Assistant*\n\n" +
        "Commands:\n" +
        "• /clear — Reset our conversation\n" +
        "• /help — Show this message\n\n" +
        "Just send me any message and I'll do my best to help!";
      await sendWhatsAppMessage(conversationId, helpText);
      return;
    }

    const history = getHistory(phoneNumber);
    const aiReply = await getAIResponse(phoneNumber, userMessage, history);

    addMessage(phoneNumber, "user", userMessage);
    addMessage(phoneNumber, "assistant", aiReply);

    await sendWhatsAppMessage(conversationId, aiReply);

    console.log(`🤖 [${phoneNumber}] ${aiReply.slice(0, 80)}...`);
  } catch (err) {
    console.error(`❌ Error handling message from ${phoneNumber}:`, err.message);
    await sendWhatsAppMessage(
      conversationId,
      "Sorry, something went wrong on my end. Please try again in a moment! 🙏"
    );
  }
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 WhatsApp AI Agent running on port ${PORT}`);
  console.log(`   Webhook: http://localhost:${PORT}/webhook`);
  console.log(`   Health:  http://localhost:${PORT}/health\n`);
});
