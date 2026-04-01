"use client";

import { useMutation } from "@tanstack/react-query";
import { Bot, LoaderCircle, Sparkles, User2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { sendChat, type ChatMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Theme } from "@/constants/theme";
import { cn } from "@/lib/utils";

const starterMessages: ChatMessage[] = [
  {
    role: "model",
    text: "Hi, I’m the first ENVO AI tool. Ask me anything and I’ll reply through your Gemini-powered backend.",
  },
];

export function ChatShell() {
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [prompt, setPrompt] = useState("");

  const chatMutation = useMutation({
    mutationFn: async (nextMessages: ChatMessage[]) => sendChat(nextMessages),
    onSuccess: (data) => {
      setMessages((current) => [...current, { role: "model", text: data.reply }]);
    },
  });

  const isDisabled = chatMutation.isPending || prompt.trim().length === 0;

  const emptyState = useMemo(() => messages.length <= 1, [messages.length]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || chatMutation.isPending) {
      return;
    }

    const nextMessages = [...messages, { role: "user", text: trimmedPrompt }] satisfies ChatMessage[];
    setMessages(nextMessages);
    setPrompt("");
    chatMutation.mutate(nextMessages);
  }

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10 sm:px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(191,14,110,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(248,123,90,0.16),_transparent_24%),linear-gradient(135deg,_rgba(36,33,36,1)_0%,_rgba(69,66,69,1)_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />

      <div className="w-full" style={{ maxWidth: `${Theme.maxContentWidth}px` }}>
        <div className="mb-6 flex flex-col gap-3">
          <div className="font-accent inline-flex w-fit items-center gap-2 rounded-full border border-[color:rgb(255_255_255_/_0.1)] bg-[color:rgb(255_255_255_/_0.05)] px-4 py-2 text-sm uppercase tracking-[0.24em] text-[color:var(--color-accent)]">
            <Sparkles className="h-3.5 w-3.5" />
            ENVO AI TOOLS
          </div>
          <p className="font-accent max-w-2xl text-3xl uppercase leading-none tracking-[0.12em] text-[color:var(--color-primary)] sm:text-4xl">
            WELCOME
          </p>
          <h1 className="font-title max-w-3xl text-5xl tracking-[-0.04em] text-[color:var(--color-text)] sm:text-7xl">
            Talk to Gemini inside ENVO AI TOOLS.
          </h1>
          <p className="font-subtitle max-w-2xl text-base leading-7 tracking-[0.02em] text-[color:var(--color-text-secondary)] sm:text-lg">
            Dazzle leads the headings, DIN carries the body, and Neuebit calls attention where it matters.
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="grid gap-0 p-0 lg:grid-cols-[1.2fr_340px]">
            <div className="border-b border-[color:rgb(255_255_255_/_0.08)] lg:border-b-0 lg:border-r">
              <ScrollArea className="h-[560px]">
                <div className="space-y-4 p-6">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      {message.role === "model" && (
                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--color-primary)] text-white">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "font-body max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-6 shadow-sm",
                          message.role === "user"
                            ? "border border-[color:rgb(255_255_255_/_0.08)] bg-[color:rgb(255_255_255_/_0.06)] text-[color:var(--color-text)]"
                            : "bg-[linear-gradient(180deg,rgba(194,58,131,0.18),rgba(153,19,97,0.2))] text-[color:var(--color-text)]",
                        )}
                      >
                        {message.text}
                      </div>

                      {message.role === "user" && (
                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--color-accent)] text-[color:var(--color-bg)]">
                          <User2 className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}

                  {chatMutation.isPending && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[color:var(--color-primary)] text-white">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="font-body inline-flex items-center gap-2 rounded-[24px] bg-[color:rgb(255_255_255_/_0.05)] px-4 py-3 text-sm text-[color:var(--color-text-secondary)]">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Thinking...
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <form className="border-t border-[color:rgb(255_255_255_/_0.08)] bg-[color:rgb(0_0_0_/_0.1)] p-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="Ask ENVO AI Tools something..."
                  />
                  <Button className="h-12 min-w-32 rounded-2xl" disabled={isDisabled} type="submit">
                    {chatMutation.isPending ? "Sending..." : "Send"}
                  </Button>
                </div>
                {chatMutation.isError && (
                  <p className="font-body mt-3 text-sm text-rose-300">Something went wrong while contacting the backend.</p>
                )}
              </form>
            </div>

            <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.12))] p-6">
              <div className="space-y-6">
                <div>
                  <p className="font-accent text-sm uppercase tracking-[0.22em] text-[color:var(--color-accent)]">Workspace</p>
                  <h2 className="font-title mt-2 text-3xl text-[color:var(--color-text)]">Simple Chat Tool</h2>
                </div>

                <div className="rounded-[24px] border border-[color:rgb(255_255_255_/_0.08)] bg-[color:rgb(255_255_255_/_0.03)] p-4">
                  <p className="font-subtitle text-base text-[color:var(--color-text)]">Stack</p>
                  <p className="font-body mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                    Next.js, Tailwind, TanStack Query, shadcn-style UI, Express, TypeScript, and Gemini.
                  </p>
                </div>

                <div className="rounded-[24px] border border-[color:rgb(255_255_255_/_0.08)] bg-[color:rgb(255_255_255_/_0.03)] p-4">
                  <p className="font-subtitle text-base text-[color:var(--color-text)]">Status</p>
                  <p className="font-body mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                    {emptyState
                      ? "Ready for the first real prompt."
                      : "Conversation active. Frontend and backend are already connected."}
                  </p>
                </div>

                <div className="font-body rounded-[24px] border border-[color:rgb(248_123_90_/_0.25)] bg-[color:rgb(248_123_90_/_0.08)] p-4 text-sm leading-6 text-[color:var(--color-text)]">
                  Database wiring is prepared in the backend, but no DB operations are being used yet.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
