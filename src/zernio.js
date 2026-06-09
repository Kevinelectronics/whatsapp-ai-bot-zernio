const BASE_URL = "https://zernio.com/api/v1";

const headers = () => ({
  Authorization: `Bearer ${process.env.ZERNIO_API_KEY}`,
  "Content-Type": "application/json",
});

export async function sendWhatsAppMessage(conversationId, text) {
  const url = `${BASE_URL}/inbox/conversations/${conversationId}/messages?accountId=${process.env.ZERNIO_ACCOUNT_ID}`;

  const res = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ message: text, accountId: process.env.ZERNIO_ACCOUNT_ID }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Zernio API error ${res.status}: ${err}`);
  }

  return res.json();
}
