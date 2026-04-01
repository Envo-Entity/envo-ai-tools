const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type ChatMessage = {
  role: "user" | "model";
  text: string;
};

export async function sendChat(messages: ChatMessage[]) {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    credentials: "include",
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

export async function getSession() {
  const response = await fetch(`${API_URL}/api/auth/session`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load session.");
  }

  return (await response.json()) as { authenticated: boolean };
}

export async function unlockSite(password: string) {
  const response = await fetch(`${API_URL}/api/auth/unlock`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  const data = (await response.json()) as { authenticated?: boolean; error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Unlock failed.");
  }

  return data;
}
