const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type ChatMessage = {
  role: "user" | "model";
  text: string;
};

export async function sendChat(messages: ChatMessage[]) {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error("Failed to send chat message.");
  }

  return (await response.json()) as { reply: string };
}
