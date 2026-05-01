"use client";

import Link from "next/link";
import { ArrowLeft, Check, Clipboard, DownloadCloud, FileAudio, Loader2, Send, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ApiError,
  createInstagramTranscriptionJob,
  getInstagramTranscriptionJob,
  InstagramTranscriberStep,
  InstagramTranscriptionJob,
} from "@/lib/api";

const STEPS: Array<{
  key: InstagramTranscriberStep;
  label: string;
}> = [
  { key: "queued", label: "Queued" },
  { key: "resolving", label: "Finding video" },
  { key: "downloading", label: "Downloading" },
  { key: "optimizing", label: "Optimizing audio" },
  { key: "uploading", label: "Sending to Gemini" },
  { key: "transcribing", label: "Transcribing" },
  { key: "completed", label: "Done" },
];

const ACTIVE_STEP_INDEX = new Map(STEPS.map((step, index) => [step.key, index]));

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 MB";
  }

  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb >= 10 ? 1 : 2)} MB`;
}

function StatusRail({ job }: { job: InstagramTranscriptionJob | null }) {
  const activeIndex = job?.step === "failed" ? -1 : ACTIVE_STEP_INDEX.get(job?.step ?? "queued") ?? 0;

  return (
    <div className="grid gap-3">
      {STEPS.map((step, index) => {
        const isDone = job?.status === "completed" || index < activeIndex;
        const isActive = index === activeIndex && job?.status === "running";

        return (
          <div
            key={step.key}
            className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.035)] px-4"
          >
            <div
              className={[
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                isDone
                  ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white"
                  : isActive
                    ? "border-[color:var(--color-accent)] text-[color:var(--color-accent)]"
                    : "border-white/12 text-[color:var(--color-text-tertiary)]",
              ].join(" ")}
            >
              {isDone ? (
                <Check className="h-3.5 w-3.5" />
              ) : isActive ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <span className="font-body text-xs">{index + 1}</span>
              )}
            </div>
            <span
              className={[
                "font-body text-sm",
                isDone || isActive ? "text-[color:var(--color-text)]" : "text-[color:var(--color-text-tertiary)]",
              ].join(" ")}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function InstagramTranscriberPage() {
  const [url, setUrl] = useState("");
  const [job, setJob] = useState<InstagramTranscriptionJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const canSubmit = url.trim().length > 0 && !isSubmitting && job?.status !== "running";
  const result = job?.result;

  const statusTone = useMemo(() => {
    if (job?.status === "completed") {
      return "Complete";
    }

    if (job?.status === "failed") {
      return "Needs another link";
    }

    return job ? "Working" : "Ready";
  }, [job]);

  useEffect(() => {
    if (!job || job.status !== "running") {
      return;
    }

    const intervalId = window.setInterval(() => {
      void getInstagramTranscriptionJob(job.id)
        .then(({ job: nextJob }) => setJob(nextJob))
        .catch((pollError) => {
          setError(pollError instanceof Error ? pollError.message : "Could not refresh job status.");
        });
    }, 1_800);

    return () => window.clearInterval(intervalId);
  }, [job]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setCopied(false);
    setJob(null);

    try {
      const response = await createInstagramTranscriptionJob(url.trim());
      setJob(response.job);
    } catch (submitError) {
      if (submitError instanceof ApiError) {
        setError(submitError.message);
      } else {
        setError(submitError instanceof Error ? submitError.message : "Could not start transcription.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyTranscript() {
    if (!result?.transcript) {
      return;
    }

    await navigator.clipboard.writeText(result.transcript);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_800);
  }

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
              Instagram Transcriber
            </p>
            <h1 className="font-title mt-3 max-w-3xl text-5xl leading-none tracking-[-0.06em] sm:text-7xl">
              Paste a Reel. Get the words.
            </h1>
          </div>

          <div className="font-body flex w-fit items-center gap-2 rounded-full border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm text-[color:var(--color-text-secondary)]">
            <Sparkles className="h-4 w-4 text-[color:var(--color-primary)]" />
            {statusTone}
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_360px]">
          <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.85)] sm:p-6">
            <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
              <Input
                className="h-13 flex-1 rounded-[18px]"
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://www.instagram.com/reel/..."
                type="url"
                value={url}
              />
              <Button className="h-13 rounded-[18px] px-5" disabled={!canSubmit} type="submit">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Transcribe
              </Button>
            </form>

            {error && (
              <div className="font-body mt-4 rounded-2xl border border-[rgba(255,119,119,0.28)] bg-[rgba(255,79,79,0.08)] px-4 py-3 text-sm leading-6 text-[#ffb1b1]">
                {error}
              </div>
            )}

            <div className="mt-6 rounded-[24px] border border-white/8 bg-[rgba(10,18,23,0.44)] p-4 sm:p-5">
              <div className="flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-accent text-xs uppercase tracking-[0.18em] text-[color:var(--color-primary)]">
                    Current status
                  </p>
                  <p className="font-body mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                    {job?.message ?? "Paste a public Reel URL to begin."}
                  </p>
                </div>
                {job?.status === "running" && (
                  <div className="font-body flex w-fit items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-[color:var(--color-text-secondary)]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[color:var(--color-accent)]" />
                    Job {job.id.slice(0, 10)}
                  </div>
                )}
              </div>

              {result ? (
                <div className="mt-5 grid gap-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="font-body text-sm text-[color:var(--color-text-secondary)]">
                      {result.language} · {result.resolver} · {formatBytes(result.mediaBytes)}
                    </div>
                    <Button className="w-fit rounded-2xl" onClick={copyTranscript} type="button" variant="outline">
                      <Clipboard className="mr-2 h-4 w-4" />
                      {copied ? "Copied" : "Copy transcript"}
                    </Button>
                  </div>

                  <article className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.035)] p-5">
                    <h2 className="font-title text-3xl tracking-[-0.04em]">Transcript</h2>
                    <p className="font-body mt-4 whitespace-pre-wrap text-base leading-8 text-[color:var(--color-text)]">
                      {result.transcript || "No spoken words were detected."}
                    </p>
                  </article>

                  <div className="grid gap-4 md:grid-cols-2">
                    <article className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.035)] p-5">
                      <h2 className="font-title text-2xl tracking-[-0.04em]">Summary</h2>
                      <p className="font-body mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                        {result.summary || "No summary generated."}
                      </p>
                    </article>

                    <article className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.035)] p-5">
                      <h2 className="font-title text-2xl tracking-[-0.04em]">Hooks</h2>
                      <div className="mt-3 grid gap-2">
                        {(result.hooks.length ? result.hooks : ["No hooks detected."]).map((hook) => (
                          <p
                            className="font-body rounded-2xl bg-[rgba(255,255,255,0.04)] px-3 py-2 text-sm leading-6 text-[color:var(--color-text-secondary)]"
                            key={hook}
                          >
                            {hook}
                          </p>
                        ))}
                      </div>
                    </article>
                  </div>

                  {result.segments.length > 0 && (
                    <article className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.035)] p-5">
                      <h2 className="font-title text-2xl tracking-[-0.04em]">Timestamped Lines</h2>
                      <div className="mt-4 grid gap-2">
                        {result.segments.map((segment, index) => (
                          <div
                            className="grid gap-2 rounded-2xl bg-[rgba(255,255,255,0.035)] px-3 py-3 sm:grid-cols-[120px_1fr]"
                            key={`${segment.start}-${segment.end}-${index}`}
                          >
                            <span className="font-body text-xs text-[color:var(--color-accent)]">
                              {segment.start} - {segment.end}
                            </span>
                            <span className="font-body text-sm leading-6 text-[color:var(--color-text-secondary)]">
                              {segment.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </article>
                  )}
                </div>
              ) : (
                <div className="flex min-h-[340px] flex-col items-center justify-center px-4 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.04)] text-[color:var(--color-primary)]">
                    {job?.status === "running" ? (
                      <DownloadCloud className="h-7 w-7" />
                    ) : (
                      <FileAudio className="h-7 w-7" />
                    )}
                  </div>
                  <p className="font-title mt-5 text-3xl tracking-[-0.04em]">
                    {job?.status === "running" ? "Working through the Reel" : "Ready for a public Reel"}
                  </p>
                  <p className="font-body mt-3 max-w-md text-sm leading-7 text-[color:var(--color-text-secondary)]">
                    {job?.status === "running"
                      ? "Keep this page open. The backend is downloading, optimizing, and sending the media to Gemini."
                      : "The video is processed temporarily on the backend and removed after transcription."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.85)] sm:p-6">
            <div className="mb-5">
              <p className="font-accent text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                Pipeline
              </p>
              <h2 className="font-title mt-2 text-3xl tracking-[-0.05em]">Live steps</h2>
            </div>
            <StatusRail job={job} />
          </aside>
        </section>
      </div>
    </main>
  );
}

