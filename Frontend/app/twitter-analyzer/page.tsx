"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Sparkles, TwitterIcon } from "lucide-react";
import { ApiError, analyzeTwitterTimeline, TwitterDigestResult } from "@/lib/api";
import { UsernameForm } from "./_components/UsernameForm";
import { AnalysisResult } from "./_components/AnalysisResult";

export default function TwitterAnalyzerPage() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState<TwitterDigestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const handle = username.trim();
    if (!handle || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const { result: digest } = await analyzeTwitterTimeline(handle);
      setResult(digest);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not analyze this timeline. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const statusLabel = isLoading ? "Working" : result ? "Complete" : "Ready";

  return (
    <main className="min-h-screen bg-[color:var(--color-bg)] px-4 py-6 text-[color:var(--color-text)] sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="font-body inline-flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)] transition hover:text-[color:var(--color-text)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to tools
            </Link>
            <p className="font-accent mt-8 text-sm uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
              Twitter Analyzer
            </p>
            <h1 className="font-title mt-3 max-w-3xl text-5xl leading-none tracking-[-0.06em] sm:text-7xl">
              Any timeline. Instant digest.
            </h1>
          </div>

          <div className="font-body flex w-fit items-center gap-2 rounded-full border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm text-[color:var(--color-text-secondary)]">
            <Sparkles className="h-4 w-4 text-[color:var(--color-primary)]" />
            {statusLabel}
          </div>
        </header>

        <div className="grid gap-5">
          <UsernameForm
            username={username}
            onChange={setUsername}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.85)] sm:p-6">
            {result ? (
              <AnalysisResult result={result} />
            ) : (
              <div className="flex min-h-[340px] flex-col items-center justify-center px-4 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.04)] text-[color:var(--color-primary)]">
                  <TwitterIcon className="h-7 w-7" />
                </div>
                <p className="font-title mt-5 text-3xl tracking-[-0.04em]">
                  {isLoading ? "Fetching and analyzing tweets…" : "Enter a Twitter username"}
                </p>
                <p className="font-body mt-3 max-w-md text-sm leading-7 text-[color:var(--color-text-secondary)]">
                  {isLoading
                    ? "Pulling the timeline from Twitter, then running it through Gemini. This takes around 10 seconds."
                    : "Paste any public Twitter handle and get an AI-powered digest — topics, tone, writing style, and standout tweets."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
