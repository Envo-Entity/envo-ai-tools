"use client";

import { Clipboard, FileText, Loader2, Send, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ApiError,
  createInstagramTranscriptionJob,
  getInstagramTranscriptionJob,
  InstagramTranscriptionJob,
} from "@/lib/api";

type PublicPhase = "ready" | "finding" | "transcribing" | "done" | "failed";

const PHASE_COPY: Record<PublicPhase, { label: string; message: string; progress: number }> = {
  ready: {
    label: "Ready",
    message: "Paste a public Instagram Reel or post URL to begin.",
    progress: 0,
  },
  finding: {
    label: "Finding video",
    message: "Finding the Instagram video...",
    progress: 38,
  },
  transcribing: {
    label: "Transcribing",
    message: "Transcribing the audio...",
    progress: 76,
  },
  done: {
    label: "Done",
    message: "Transcription complete.",
    progress: 100,
  },
  failed: {
    label: "Needs another link",
    message: "That link could not be transcribed. Try another public Instagram URL.",
    progress: 100,
  },
};

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 MB";
  }

  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb >= 10 ? 1 : 2)} MB`;
}

function getPublicPhase(job: InstagramTranscriptionJob | null, isSubmitting: boolean): PublicPhase {
  if (isSubmitting) {
    return "finding";
  }

  if (!job) {
    return "ready";
  }

  if (job.status === "completed") {
    return "done";
  }

  if (job.status === "failed" || job.step === "failed") {
    return "failed";
  }

  if (job.step === "queued" || job.step === "resolving" || job.step === "downloading") {
    return "finding";
  }

  return "transcribing";
}

function getInstagramEmbedUrl(rawUrl: string) {
  const normalizedUrl = rawUrl.trim();

  if (!normalizedUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(normalizedUrl.startsWith("http") ? normalizedUrl : `https://${normalizedUrl}`);
    const [, mediaType, shortcode] = parsedUrl.pathname.split("/");

    if (!["p", "reel", "tv"].includes(mediaType) || !shortcode) {
      return null;
    }

    return `https://www.instagram.com/${mediaType}/${shortcode}/embed/captioned/`;
  } catch {
    return null;
  }
}

export default function InstagramTranscriberPage() {
  const [url, setUrl] = useState("");
  const [job, setJob] = useState<InstagramTranscriptionJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const canSubmit = url.trim().length > 0 && !isSubmitting && job?.status !== "running";
  const result = job?.result;
  const publicPhase = getPublicPhase(job, isSubmitting);
  const phaseCopy = PHASE_COPY[publicPhase];
  const embedUrl = getInstagramEmbedUrl(url || job?.sourceUrl || result?.sourceUrl || "");
  const shouldShowEmbed = Boolean(embedUrl && (publicPhase === "transcribing" || publicPhase === "done"));

  const statusTone = useMemo(() => {
    if (publicPhase === "done") {
      return "Complete";
    }

    if (publicPhase === "failed") {
      return "Needs another link";
    }

    return publicPhase === "finding" || publicPhase === "transcribing" ? "Working" : "Ready";
  }, [publicPhase]);

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
            <h1 className="font-title max-w-3xl text-5xl leading-none tracking-[-0.06em] sm:text-7xl">
              Paste a Reel. Get the words.
            </h1>
          </div>

          <div className="font-body flex w-fit items-center gap-2 rounded-full border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm text-[color:var(--color-text-secondary)]">
            <Sparkles className="h-4 w-4 text-[color:var(--color-primary)]" />
            {statusTone}
          </div>
        </header>

        <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
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
                    {phaseCopy.message}
                  </p>
                </div>
                {(publicPhase === "finding" || publicPhase === "transcribing") && (
                  <div className="font-body flex w-fit items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-[color:var(--color-text-secondary)]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[color:var(--color-accent)]" />
                    {phaseCopy.label}
                  </div>
                )}
              </div>

              {publicPhase !== "ready" && (
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-[color:var(--color-primary)] transition-[width] duration-500"
                    style={{ width: `${phaseCopy.progress}%` }}
                  />
                </div>
              )}

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
              ) : publicPhase === "transcribing" ? (
                <div className="mt-5 grid gap-5">
                  <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.035)] p-5">
                    <div className="h-8 w-40 animate-pulse rounded-full bg-white/10" />
                    <div className="mt-5 grid gap-3">
                      <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
                      <div className="h-4 w-[94%] animate-pulse rounded-full bg-white/10" />
                      <div className="h-4 w-[88%] animate-pulse rounded-full bg-white/10" />
                      <div className="h-4 w-[76%] animate-pulse rounded-full bg-white/10" />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.035)] p-5">
                      <div className="h-7 w-28 animate-pulse rounded-full bg-white/10" />
                      <div className="mt-5 grid gap-3">
                        <div className="h-3.5 w-full animate-pulse rounded-full bg-white/10" />
                        <div className="h-3.5 w-[86%] animate-pulse rounded-full bg-white/10" />
                        <div className="h-3.5 w-[70%] animate-pulse rounded-full bg-white/10" />
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.035)] p-5">
                      <div className="h-7 w-20 animate-pulse rounded-full bg-white/10" />
                      <div className="mt-5 grid gap-2">
                        <div className="h-9 animate-pulse rounded-2xl bg-white/10" />
                        <div className="h-9 animate-pulse rounded-2xl bg-white/10" />
                        <div className="h-9 w-[86%] animate-pulse rounded-2xl bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[340px] flex-col items-center justify-center px-4 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.04)] text-[color:var(--color-primary)]">
                    {publicPhase === "finding" ? (
                      <Loader2 className="h-7 w-7 animate-spin" />
                    ) : (
                      <FileText className="h-7 w-7" />
                    )}
                  </div>
                  <p className="font-title mt-5 text-3xl tracking-[-0.04em]">
                    {publicPhase === "finding"
                      ? "Finding video"
                      : "Ready for a public Reel"}
                  </p>
                  <p className="font-body mt-3 max-w-md text-sm leading-7 text-[color:var(--color-text-secondary)]">
                    {publicPhase === "finding"
                      ? "Keep this page open while ClickToScript turns the reel into words."
                      : "Paste a public Instagram URL to get a transcript, summary, hooks, and timestamps."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="h-[620px] rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.85)] sm:p-6 lg:sticky lg:top-8 lg:self-start">
            {shouldShowEmbed ? (
              <div className="h-full overflow-hidden rounded-[22px] border border-white/10 bg-[#111]">
                <iframe
                  className="h-full w-full bg-white"
                  loading="lazy"
                  src={embedUrl ?? undefined}
                  title="Instagram post preview"
                />
              </div>
            ) : publicPhase === "finding" ? (
              <div className="h-full overflow-hidden rounded-[22px] border border-white/8 bg-[rgba(255,255,255,0.035)] p-4">
                <div className="flex items-center gap-3 border-b border-white/8 pb-4">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-3.5 w-28 animate-pulse rounded-full bg-white/10" />
                    <div className="h-3 w-20 animate-pulse rounded-full bg-white/8" />
                  </div>
                </div>
                <div className="mt-4 aspect-[4/5] animate-pulse rounded-[18px] bg-white/8" />
                <div className="mt-4 space-y-2">
                  <div className="h-3.5 w-full animate-pulse rounded-full bg-white/10" />
                  <div className="h-3.5 w-[82%] animate-pulse rounded-full bg-white/8" />
                </div>
              </div>
            ) : (
              <div className="h-full rounded-[22px]" />
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
