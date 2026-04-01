"use client";

import { useMutation } from "@tanstack/react-query";
import { Bot, LoaderCircle, Sparkles, User2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { sendChat, type ChatMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.16),_transparent_24%),linear-gradient(135deg,_#f8fafc_0%,_#ecfccb_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),transparent)]" />

      <div className="w-full max-w-5xl">
        <div className="mb-6 flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            ENVO AI TOOLS
          </div>
          <h1 className="max-w-2xl font-serif text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
            Your first tool is a clean Gemini chat experience.
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
            Next.js on the frontend, Express on the backend, and Gemini 3.1 Pro Preview in the loop.
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="grid gap-0 p-0 lg:grid-cols-[1.2fr_340px]">
            <div className="border-b border-zinc-200/70 lg:border-b-0 lg:border-r">
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
                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}

                      <div
                        className={cn(
                          "max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-6 shadow-sm",
                          message.role === "user"
                            ? "bg-zinc-950 text-white"
                            : "bg-zinc-100 text-zinc-800",
                        )}
                      >
                        {message.text}
                      </div>

                      {message.role === "user" && (
                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white">
                          <User2 className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}

                  {chatMutation.isPending && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-[24px] bg-zinc-100 px-4 py-3 text-sm text-zinc-600">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Thinking...
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <form className="border-t border-zinc-200/70 bg-white/70 p-4" onSubmit={handleSubmit}>
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
                  <p className="mt-3 text-sm text-rose-600">Something went wrong while contacting the backend.</p>
                )}
              </form>
            </div>

            <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,244,245,0.9))] p-6">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Workspace</p>
                  <h2 className="mt-2 text-2xl font-semibold text-zinc-950">Simple Chat Tool</h2>
                </div>

                <div className="rounded-[24px] border border-zinc-200 bg-white p-4">
                  <p className="text-sm font-medium text-zinc-950">Stack</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Next.js, Tailwind, TanStack Query, shadcn-style UI, Express, TypeScript, and Gemini.
                  </p>
                </div>

                <div className="rounded-[24px] border border-zinc-200 bg-white p-4">
                  <p className="text-sm font-medium text-zinc-950">Status</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {emptyState
                      ? "Ready for the first real prompt."
                      : "Conversation active. Frontend and backend are already connected."}
                  </p>
                </div>

                <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
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
