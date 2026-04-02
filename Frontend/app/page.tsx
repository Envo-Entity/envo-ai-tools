"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, LockKeyhole } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Palette, Theme } from "@/constants/theme";
import { getSession, unlockSite } from "@/lib/api";

const TOOLS = [
  {
    name: "AI Slides Maker",
    description: "Create slide decks with AI-driven outlines, tone control, and fast first drafts.",
    status: "Under Construction",
    href: "/slides-maker",
  },
  {
    name: "Presentation Decks",
    description: "Create beautiful modern PPT-style slides with richer copy, stronger structure, and pitch-deck energy.",
    status: "Under Construction",
    href: "/presentation-decks",
  },
];

const PAGE_SIZE = 4;

function PasswordGate({
  onUnlock,
}: {
  onUnlock: () => void;
}) {
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const enteredPassword = passwordInput;

  useEffect(() => {
    setError(null);
  }, [enteredPassword]);

  async function handleUnlock() {
    if (enteredPassword.length !== 4) {
      setError("Enter the full 4-digit password.");
      return;
    }

    try {
      await unlockSite(enteredPassword);
      setError(null);
      onUnlock();
    } catch (unlockError) {
      setError(unlockError instanceof Error ? unlockError.message : "Unlock failed.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-md rounded-[32px] border px-6 py-8 sm:px-8"
        style={{
          backgroundColor: "rgba(236,45,48,0.32)",
          borderColor: "rgba(255,204,210,0.2)",
        }}
      >
        <div className="mb-8">
          <p className="font-accent text-[2.75rem] uppercase leading-none tracking-[-0.08em] text-[color:var(--color-text)]">
            unlock
          </p>
          <div className="mt-5 space-y-3">
            <p className="font-accent text-[2.3rem] uppercase leading-[0.82] tracking-[-0.08em] text-[color:var(--color-text)]">
              HI THERE,
            </p>
            <p className="font-accent text-[4.6rem] uppercase leading-[0.78] tracking-[-0.1em] text-[color:var(--color-text)]">
              WHOA.
            </p>
          </div>
          <p className="font-body mt-5 max-w-sm text-sm leading-7 text-[color:var(--color-text-secondary)]">
            Enter the 4-digit site password to open ENVO AI TOOLS.
          </p>
        </div>

        <div
          className="rounded-[28px] border p-4 shadow-[0_22px_60px_-30px_rgba(0,0,0,0.8)]"
          style={{
            borderColor: "rgba(107,185,204,0.32)",
            backgroundColor: "rgba(35,81,101,0.82)",
          }}
        >
          <div className="rounded-[24px] bg-[rgba(15,25,31,0.72)] p-3">
            <input
              autoComplete="one-time-code"
              className="font-accent h-[124px] w-full rounded-[20px] border border-white/8 bg-[#1f2027] px-6 text-center text-[5.25rem] leading-none tracking-[0.22em] text-[color:var(--color-accent)] outline-none placeholder:text-[rgba(237,95,60,0.22)] focus:border-[rgba(97,153,180,0.55)]"
              inputMode="numeric"
              maxLength={4}
              onChange={(event) => {
                const nextValue = event.target.value.replace(/\D/g, "").slice(0, 4);
                setPasswordInput(nextValue);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleUnlock();
                }
              }}
              pattern="[0-9]*"
              placeholder="0000"
              type="text"
              value={passwordInput}
            />
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="font-body min-w-0 flex-1 text-sm text-[color:var(--color-text-secondary)]">
              Password
              <span className="font-accent ml-2 text-2xl uppercase tracking-[-0.06em] text-[color:var(--color-accent)]">
                {enteredPassword || "0000"}
              </span>
            </div>
            <Button className="h-12 shrink-0 rounded-[18px] px-5" onClick={handleUnlock} type="button">
              <LockKeyhole className="mr-2 h-4 w-4" />
              Unlock
            </Button>
          </div>

          {error && <p className="font-body mt-4 text-sm text-[color:#ffb1b1]">{error}</p>}
        </div>
      </div>
    </main>
  );
}

function ToolsHome() {
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(TOOLS.length / PAGE_SIZE));
  const currentTools = useMemo(
    () => TOOLS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [page],
  );

  return (
    <main className="min-h-screen bg-[color:var(--color-bg)] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full" style={{ maxWidth: `${Theme.maxContentWidth}px` }}>
        <header className="mb-10">
          <p className="font-accent text-[2.5rem] uppercase leading-none tracking-[-0.08em] text-[color:var(--color-text)]">
            HI THERE,
          </p>
          <p className="font-accent mt-4 text-[5.5rem] uppercase leading-[0.78] tracking-[-0.1em] text-[color:var(--color-text)] sm:text-[7.5rem]">
            E N V O
          </p>
          <p className="font-body mt-6 max-w-lg text-base leading-8 text-[color:var(--color-text-secondary)]">
            Your AI tools are live here.
          </p>
        </header>

        <section className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] shadow-[0_24px_80px_-48px_rgba(0,0,0,0.85)] backdrop-blur-sm">
          <div className="flex flex-col gap-4 border-b border-white/8 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-accent text-sm uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
                Tools
              </p>
              <h1 className="font-title mt-2 text-3xl tracking-[-0.05em] text-[color:var(--color-text)]">
                ENVO AI TOOLS
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                disabled={page === 0}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                type="button"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-body min-w-20 text-center text-sm text-[color:var(--color-text-secondary)]">
                Page {page + 1} / {pageCount}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                disabled={page >= pageCount - 1}
                onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                type="button"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 p-6">
            {currentTools.map((tool, index) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="block cursor-pointer rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-5 transition hover:border-white/20 hover:bg-[rgba(255,255,255,0.07)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-accent text-sm uppercase tracking-[0.16em] text-[color:var(--color-primary)]">
                      Tool {String(page * PAGE_SIZE + index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="font-title mt-2 text-3xl tracking-[-0.05em] text-[color:var(--color-text)]">
                      {tool.name}
                    </h2>
                    <p className="font-body mt-3 max-w-xl text-sm leading-7 text-[color:var(--color-text-secondary)]">
                      {tool.description}
                    </p>
                  </div>

                  <div
                    className="font-body inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm"
                    style={{
                      borderColor: Palette.warning[500],
                      color: Palette.warning[500],
                    }}
                  >
                    {tool.status}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function HomePage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const session = await getSession();

        if (!cancelled) {
          setIsUnlocked(session.authenticated);
        }
      } catch {
        if (!cancelled) {
          setIsUnlocked(false);
        }
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isReady) {
    return null;
  }

  if (!isUnlocked) {
    return <PasswordGate onUnlock={() => setIsUnlocked(true)} />;
  }

  return <ToolsHome />;
}
