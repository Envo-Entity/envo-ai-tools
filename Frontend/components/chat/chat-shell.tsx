"use client";

import { useMutation } from "@tanstack/react-query";
import { ArrowUpRight, Bot, LoaderCircle, MessageCircleMore, Sparkles, User2, WandSparkles } from "lucide-react";
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
    text: "Hi there. I’m your first ENVO tool. Ask anything and I’ll reply through your Gemini-powered backend.",
  },
];

const featurePills = [
  {
    label: "CHAT FAST",
    tone: "bg-[#f86540] text-[#201c20]",
    chip: "bg-[#f2ef5b] text-[#201c20]",
    rotate: "-rotate-[2deg]",
    icon: MessageCircleMore,
  },
  {
    label: "THINK DEEP",
    tone: "bg-[#d38ab5] text-[#201c20]",
    chip: "bg-[#f2ef5b] text-[#201c20]",
    rotate: "rotate-[4deg]",
    icon: WandSparkles,
  },
  {
    label: "SHIP TOOLS",
    tone: "bg-[#bfb4db] text-[#201c20]",
    chip: "bg-[#f2ef5b] text-[#201c20]",
    rotate: "-rotate-[3deg]",
    icon: ArrowUpRight,
  },
] as const;

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
    <div className="grid min-h-screen place-items-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(191,14,110,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(248,123,90,0.16),_transparent_24%),linear-gradient(135deg,_rgba(36,33,36,1)_0%,_rgba(69,66,69,1)_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
      <div className="absolute left-[-6rem] top-16 -z-10 h-48 w-48 rounded-full border border-[color:rgb(255_255_255_/_0.08)]" />
      <div className="absolute right-[-4rem] top-28 -z-10 h-36 w-36 rounded-full border border-[color:rgb(255_255_255_/_0.08)]" />

      <div className="w-full" style={{ maxWidth: `${Theme.maxContentWidth}px` }}>
        <div className="grid items-start gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="px-2 pt-2">
            <div className="mb-6 flex items-center justify-between">
              <div className="font-accent inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-[color:rgb(255_255_255_/_0.08)] text-2xl uppercase text-[color:var(--color-text)]">
                ea
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[color:rgb(230_234_234_/_0.95)] text-[color:rgb(230_234_234_/_0.95)]">
                <span className="font-body text-3xl">T</span>
              </div>
            </div>

            <div className="mb-8">
              <p className="font-subtitle text-4xl uppercase leading-none tracking-[-0.04em] text-[color:var(--color-text)] sm:text-5xl">
                HI THERE,
              </p>
              <h1 className="font-accent mt-2 text-[5.5rem] uppercase leading-[0.8] tracking-[-0.08em] text-[color:var(--color-text)] sm:text-[8rem]">
                envo.
              </h1>
              <p className="font-body mt-4 max-w-md text-base leading-7 text-[color:var(--color-text-secondary)]">
                Gemini chat for ENVO AI TOOLS, wrapped in the same playful type system and dark brand energy you showed in the reference.
              </p>
            </div>

            <div className="space-y-4">
              {featurePills.map((pill) => {
                const Icon = pill.icon;

                return (
                  <div
                    key={pill.label}
                    className={cn(
                      "rounded-[2rem] p-3 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)]",
                      pill.tone,
                      pill.rotate,
                    )}
                  >
                    <div className="flex items-center justify-between rounded-[1.75rem] border border-[color:rgb(36_33_36_/_0.12)] px-4 py-3">
                      <div className={cn("flex h-16 w-16 items-center justify-center rounded-full", pill.chip)}>
                        <Icon className="h-8 w-8" strokeWidth={2.2} />
                      </div>
                      <div className="font-title flex-1 px-4 text-[2rem] uppercase tracking-[-0.06em] sm:text-[2.5rem]">
                        {pill.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <Card className="overflow-hidden">
            <CardContent className="grid gap-0 p-0">
              <div className="border-b border-[color:rgb(255_255_255_/_0.08)]">
                <div className="flex items-center justify-between px-5 py-4">
                  <div>
                    <p className="font-accent text-sm uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                      Tool 01
                    </p>
                    <h2 className="font-title mt-1 text-3xl tracking-[-0.05em] text-[color:var(--color-text)]">
                      Chat App
                    </h2>
                  </div>
                  <div className="font-body rounded-full border border-[color:rgb(255_255_255_/_0.08)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
                    Gemini 3.1 Pro
                  </div>
                </div>
              </div>

              <div className="border-b border-[color:rgb(255_255_255_/_0.08)]">
                <div className="grid gap-3 px-5 py-4 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] bg-[color:rgb(255_255_255_/_0.03)] p-4">
                    <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-primary)]">Style</p>
                    <p className="font-body mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                      Dazzle for headings, DIN for body, Neuebit for high-attention moments.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-[color:rgb(255_255_255_/_0.03)] p-4">
                    <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-primary)]">Mood</p>
                    <p className="font-body mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                      Dark, rounded, playful, and inspired by your reference without cloning it.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-[color:rgb(255_255_255_/_0.03)] p-4">
                    <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-primary)]">Stack</p>
                    <p className="font-body mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                      Next.js, Express, TanStack Query, Tailwind, Gemini.
                    </p>
                  </div>
                </div>
              </div>

              <div>
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
              </div>

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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
