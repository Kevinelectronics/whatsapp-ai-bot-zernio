# WhatsApp AI Agent with OpenAI + Zernio

> Build a real WhatsApp AI chatbot in minutes using **OpenAI GPT-4o-mini** and the **[Zernio WhatsApp API](https://zernio.com/whatsapp)** — no Meta Business account required.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-blue)](https://openai.com)
[![Powered by Zernio](https://img.shields.io/badge/WhatsApp%20API-Zernio-25D366)](https://zernio.com/whatsapp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## What This Project Does

This is a production-ready **WhatsApp AI chatbot** that:

- Receives real WhatsApp messages via [Zernio](https://zernio.com/whatsapp) webhooks
- Processes them with **OpenAI GPT-4o-mini** (with full conversation memory per user)
- Sends AI-generated replies back through WhatsApp in real time
- Supports `/clear` and `/help` commands
- Runs locally with **ngrok** for instant testing — no cloud deployment needed

**Perfect for:** customer support bots, personal assistants, business automation, and WhatsApp AI experiments.

---

## Architecture

```
WhatsApp User
     │
     ▼
Zernio (WhatsApp API bridge)
     │  webhook POST
     ▼
Express Server (Node.js)
     │  GPT-4o-mini
     ▼
OpenAI API
     │  AI reply
     ▼
Zernio API → WhatsApp User
```

---

## Why Zernio?

[**Zernio**](https://zernio.com/whatsapp) is the fastest way to connect a WhatsApp number to your app:

- **No Meta Business Manager** setup needed
- Connect your **existing personal WhatsApp** number in minutes
- Simple REST API + webhooks
- Free tier available for testing

👉 **[Get started with Zernio →](https://zernio.link/kevin-meneses)**

---

## Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- An [OpenAI API key](https://platform.openai.com/api-keys)
- A [Zernio account](https://zernio.com/whatsapp) with a connected WhatsApp number
- [ngrok](https://ngrok.com) for local tunnel (free tier works)

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/Kevinelectronics/whatsapp-ai-bot-zernio.git
cd whatsapp-ai-bot-zernio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=sk-proj-...         # Your OpenAI key
ZERNIO_API_KEY=sk_...              # From Zernio dashboard
ZERNIO_ACCOUNT_ID=...              # Your Zernio account ID
WEBHOOK_SECRET=your_secret_here
PORT=3000
```

### 4. Start the server

```bash
npm start
```

### 5. Expose with ngrok

```bash
ngrok http 3000
```

Copy the `https://xxxx.ngrok-free.app` URL.

### 6. Configure Zernio webhook

1. Go to your [Zernio dashboard](https://zernio.link/kevin-meneses)
2. Open your inbox settings
3. Set the webhook URL to: `https://xxxx.ngrok-free.app/webhook`
4. Select the `message.received` event
5. Save

**Send a WhatsApp message to your connected number — the AI will reply! 🎉**

---

## Project Structure

```
whatsapp-ai-agent/
├── src/
│   ├── index.js          # Express server + webhook handler
│   ├── claude.js         # OpenAI GPT-4o-mini integration
│   ├── zernio.js         # Zernio API client (send messages)
│   ├── store.js          # In-memory conversation history
│   └── test-webhook.js   # Local testing script
├── .env.example          # Environment variables template
├── package.json
└── README.md
```

---

## Bot Commands

| Command  | Description                        |
|----------|------------------------------------|
| `/clear` | Reset conversation history         |
| `/help`  | Show available commands            |
| Any text | AI responds using GPT-4o-mini      |

---

## Customizing the AI Persona

Edit the `SYSTEM_PROMPT` in [src/claude.js](src/claude.js) to change the bot's personality, language, or behavior:

```js
const SYSTEM_PROMPT = `You are a helpful customer support agent for AcmeCorp...`;
```

---

## Testing Locally

You can simulate an incoming WhatsApp message without touching the real API:

```bash
node src/test-webhook.js "Hello, what can you do?"
```

---

## Deployment

To deploy to production, you can run this on any Node.js host (Railway, Render, Fly.io, VPS):

1. Set the environment variables on your host
2. Point the Zernio webhook to your production URL
3. Run `npm start`

No ngrok needed in production.

---

## Environment Variables Reference

| Variable            | Description                                   |
|---------------------|-----------------------------------------------|
| `OPENAI_API_KEY`    | OpenAI API key (get from platform.openai.com) |
| `ZERNIO_API_KEY`    | Zernio API key (from Zernio dashboard)        |
| `ZERNIO_ACCOUNT_ID` | Your Zernio account ID                        |
| `WEBHOOK_SECRET`    | Secret string for webhook verification        |
| `PORT`              | Server port (default: 3000)                   |

---

## How It Works (Technical Overview)

1. **Zernio** receives a WhatsApp message and fires a `POST /webhook` to your server
2. The server parses the `message.received` event and extracts the text and sender
3. The conversation history for that phone number is retrieved from memory
4. **OpenAI GPT-4o-mini** generates a reply using the full chat history
5. The reply is sent back via the Zernio REST API
6. History is updated for the next message

---

## Tech Stack

- **[OpenAI GPT-4o-mini](https://openai.com)** — Fast, cost-effective AI responses with full conversation context
- **[Zernio WhatsApp API](https://zernio.com/whatsapp)** — WhatsApp messaging without Meta's complexity
- **Express.js** — Lightweight webhook server
- **Node.js 18+** — Native fetch, ES modules, no extra dependencies

---

## Contributing

Pull requests are welcome! For major changes, open an issue first.

---

## License

MIT — free to use, modify, and distribute.

---

## Powered by Zernio

This project uses [**Zernio**](https://zernio.com/whatsapp) as the WhatsApp API bridge.
Zernio lets any developer connect to WhatsApp in minutes — no Meta Business Manager, no complex approvals.

👉 **[Try Zernio for free → zernio.com/whatsapp](https://zernio.com/whatsapp)**
