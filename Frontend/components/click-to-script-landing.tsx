"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  FileText,
  Instagram,
  Loader2,
  MousePointer2,
  Play,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TOOL_PATH = "/instagram-transcriber";
const TYPED_URL = "instagram.com/reel/C9x2mAlex_money/";
const TRANSCRIPT =
  "6 months ago I was making zero dollars online. I started posting one reel every single day, same skill, same niche. No fancy gear. No editing team. Just me, my phone, and one skill I already had. By month three I had 40,000 followers and I'd built a $97 digital product. That product hit $12,000 a month in sales. No ads. No agency. The algorithm doesn't care who you are. It cares how consistent you are. Start today. Ship every day. That's it.";

const PILLS = [
  "Full transcript",
  "Auto summary",
  "Hook extraction",
  "Timestamped lines",
  "Any public reel",
  "Under 30 seconds",
];

type DemoPhase = "idle" | "typing" | "finding" | "transcribing" | "done";

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function ClickToScriptLanding() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDemoVisible, setIsDemoVisible] = useState(false);
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [demoUrl, setDemoUrl] = useState("");
  const [typedTranscript, setTypedTranscript] = useState("");
  const [cursorStyle, setCursorStyle] = useState({ left: 72, top: 40 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [ripple, setRipple] = useState({ left: 0, top: 0, active: false });
  const demoWindowRef = useRef<HTMLDivElement | null>(null);
  const demoInputRef = useRef<HTMLInputElement | null>(null);
  const demoButtonRef = useRef<HTMLButtonElement | null>(null);
  const hasPlayedDemoRef = useRef(false);

  useEffect(() => {
    const demoWindow = demoWindowRef.current;

    if (!demoWindow) {
      return;
    }

    const revealObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsDemoVisible(true);
        }
      },
      { threshold: 0.08 },
    );

    const demoObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasPlayedDemoRef.current) {
          hasPlayedDemoRef.current = true;
          void runDemoSequence();
        }
      },
      { threshold: 0.32 },
    );

    revealObserver.observe(demoWindow);
    demoObserver.observe(demoWindow);

    return () => {
      revealObserver.disconnect();
      demoObserver.disconnect();
    };
  }, []);

  async function runDemoSequence() {
    await sleep(700);
    setPhase("idle");
    setDemoUrl("");
    setTypedTranscript("");
    setCursorStyle({ left: 72, top: 40 });
    setCursorVisible(true);
    await sleep(450);

    const inputPosition = getRelativeCenter(demoInputRef.current);
    if (inputPosition) {
      setCursorStyle({ left: inputPosition.x - 64, top: inputPosition.y });
    }
    setPhase("typing");
    await sleep(700);

    let nextUrl = "";
    for (const character of TYPED_URL) {
      nextUrl += character;
      setDemoUrl(nextUrl);
      await sleep(34 + Math.random() * 22);
    }

    await sleep(280);
    const buttonPosition = getRelativeCenter(demoButtonRef.current);
    if (buttonPosition) {
      setCursorStyle({ left: buttonPosition.x, top: buttonPosition.y });
      await sleep(420);
      setRipple({ left: buttonPosition.x, top: buttonPosition.y, active: true });
      window.setTimeout(() => setRipple((current) => ({ ...current, active: false })), 460);
    }

    setCursorVisible(false);
    setPhase("finding");
    await sleep(1100);
    setPhase("transcribing");
    await sleep(2100);
    setPhase("done");

    let nextTranscript = "";
    for (const character of TRANSCRIPT) {
      nextTranscript += character;
      setTypedTranscript(nextTranscript);
      if (nextTranscript.length % 4 === 0) {
        await sleep(8);
      }
    }
  }

  function getRelativeCenter(element: HTMLElement | null) {
    if (!element || !demoWindowRef.current) {
      return null;
    }

    const windowRect = demoWindowRef.current.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return {
      x: elementRect.left - windowRect.left + elementRect.width / 2,
      y: elementRect.top - windowRect.top + elementRect.height / 2,
    };
  }

  function openLogin() {
    setIsLoginOpen(true);
  }

  return (
    <main className="cts-page">
      <div aria-hidden="true" className="cts-glow cts-glow-top" />

      <nav className="cts-nav">
        <Link className="cts-logo" href="/">
          Click<span>To</span>Script
        </Link>
        <button className="cts-nav-cta" onClick={openLogin} type="button">
          Get Started Free
          <ArrowRight aria-hidden="true" size={16} />
        </button>
      </nav>

      <section className="cts-hero">
        <div className="cts-hero-label">Instagram to text in seconds</div>
        <h1>
          Paste a reel.
          <br />
          <span>Get the script.</span>
        </h1>
        <p className="cts-hero-sub">
          Any Instagram video. Full transcript, hooks, summary, and timestamps without opening the app.
        </p>

        <div className="cts-hero-input-wrap">
          <input aria-label="Instagram reel URL" placeholder="https://www.instagram.com/reel/..." type="text" />
          <button className="cts-hero-btn" onClick={openLogin} type="button">
            <ArrowRight aria-hidden="true" size={15} />
            Transcribe
          </button>
        </div>

        <p className="cts-hero-note">
          <strong>1 free transcription.</strong> No credit card. No extension.
        </p>

        <button
          className="cts-scroll-nudge"
          onClick={() => document.getElementById("try")?.scrollIntoView({ behavior: "smooth" })}
          type="button"
        >
          <span>See it live</span>
          <ArrowDown aria-hidden="true" size={16} />
        </button>
      </section>

      <section className="cts-demo" id="try">
        <div className="cts-demo-eyebrow">Live demo</div>
        <div className={`cts-demo-window ${isDemoVisible ? "is-visible" : ""}`} ref={demoWindowRef}>
          <MousePointer2
            aria-hidden="true"
            className={`cts-ghost-cursor ${cursorVisible ? "is-visible" : ""}`}
            style={{ left: cursorStyle.left, top: cursorStyle.top }}
            size={22}
          />
          <div
            aria-hidden="true"
            className={`cts-click-ripple ${ripple.active ? "is-active" : ""}`}
            style={{ left: ripple.left, top: ripple.top }}
          />

          <div className="cts-demo-titlebar">
            <span className="cts-dot cts-dot-red" />
            <span className="cts-dot cts-dot-yellow" />
            <span className="cts-dot cts-dot-green" />
            <span className="cts-titlebar-label">clicktoscript.com</span>
            <span className="cts-ready-badge">
              <span className={`cts-status-dot ${phase === "finding" || phase === "transcribing" ? "is-working" : ""}`} />
              {phase === "done" ? "Done" : phase === "finding" || phase === "transcribing" ? "Working" : "Ready"}
            </span>
          </div>

          <div className="cts-demo-body">
            <div className="cts-demo-left">
              <div className={`cts-demo-url-bar ${phase === "typing" ? "is-focused" : ""}`}>
                <input
                  aria-label="Demo Instagram URL"
                  placeholder="https://www.instagram.com/reel/..."
                  readOnly
                  ref={demoInputRef}
                  type="text"
                  value={demoUrl}
                />
                <button
                  className={`cts-demo-url-btn ${phase === "finding" ? "is-clicked" : ""}`}
                  ref={demoButtonRef}
                  type="button"
                >
                  <ArrowRight aria-hidden="true" size={13} />
                  Transcribe
                </button>
              </div>

              <div className="cts-demo-status-bar">
                <div className="cts-demo-status-label">Status</div>
                <div className={`cts-demo-status-text ${phase !== "idle" ? "is-active" : ""}`}>
                  {phase === "idle" || phase === "typing"
                    ? "Paste a public Reel URL to begin."
                    : phase === "finding"
                      ? "Finding video..."
                      : phase === "transcribing"
                        ? "Transcribing audio..."
                        : "Transcription complete."}
                </div>
              </div>

              {(phase === "finding" || phase === "transcribing" || phase === "done") && (
                <div className="cts-progress-wrap">
                  <div
                    className="cts-progress-bar"
                    style={{ width: phase === "finding" ? "30%" : phase === "transcribing" ? "75%" : "100%" }}
                  />
                </div>
              )}

              <div className="cts-demo-content">
                {phase !== "done" ? (
                  <div className="cts-demo-idle">
                    <div className="cts-demo-idle-icon">
                      {phase === "transcribing" ? <Loader2 className="cts-spin" size={26} /> : <FileText size={26} />}
                    </div>
                    <h3>{phase === "transcribing" ? "Working through the reel" : "Ready for a public reel"}</h3>
                    <p>Video processed temporarily and deleted after transcription.</p>
                  </div>
                ) : (
                  <div className="cts-demo-output">
                    <div className="cts-demo-transcript-box">
                      <h4>Transcript</h4>
                      <p>{typedTranscript}</p>
                    </div>
                    <div className="cts-demo-mini-grid">
                      <div className="cts-demo-mini-card">
                        <h4>Summary</h4>
                        <p>
                          Alex reveals how he went from $0 to $12k/month in 6 months by posting one
                          skill-based reel per day and selling a $97 digital product.
                        </p>
                      </div>
                      <div className="cts-demo-mini-card">
                        <h4>Hooks</h4>
                        <span>6 months ago I was broke. Here's exactly what changed.</span>
                        <span>One reel a day changed my entire income.</span>
                        <span>The $97 product that made me $12k a month.</span>
                      </div>
                    </div>
                    <div className="cts-demo-transcript-box">
                      <h4>Timestamped Lines</h4>
                      {[
                        ["00:00 - 00:04", "6 months ago I was making zero dollars online."],
                        ["00:04 - 00:09", "I started posting one reel every single day, same skill, same niche."],
                        ["00:09 - 00:14", "By month three I had 40k followers and a $97 digital product."],
                        ["00:14 - 00:19", "That product hit $12,000 a month in sales. No ads. No agency."],
                      ].map(([time, text]) => (
                        <div className="cts-ts-row" key={time}>
                          <span>{time}</span>
                          <p>{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="cts-demo-right">
              <div className={`cts-insta-embed ${phase !== "idle" && phase !== "typing" ? "is-visible" : ""}`}>
                <div className="cts-insta-header">
                  <div className="cts-insta-avatar">A</div>
                  <div className="cts-insta-username">
                    alex.builds
                    <span>@alex.builds · Instagram</span>
                  </div>
                  <Instagram aria-hidden="true" className="cts-insta-icon" size={19} />
                </div>
                <div className="cts-insta-thumb">
                  <div className={`cts-insta-processing ${phase === "transcribing" ? "is-active" : ""}`}>
                    <div className="cts-wave-bars">
                      {[0, 1, 2, 3, 4].map((bar) => (
                        <span key={bar} />
                      ))}
                    </div>
                    <div>Transcribing...</div>
                  </div>
                  <div className="cts-insta-play">
                    <Play aria-hidden="true" fill="currentColor" size={16} />
                  </div>
                </div>
                <div className="cts-insta-caption">
                  <p>
                    <strong>alex.builds</strong> 6 months ago I was making $0 online. Here's what changed everything.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cts-pills-section">
        <div className="cts-pills-row">
          {PILLS.map((pill) => (
            <div className="cts-pill" key={pill}>
              <span />
              {pill}
            </div>
          ))}
        </div>
      </section>

      <section className="cts-final-cta">
        <div aria-hidden="true" className="cts-glow cts-glow-bottom" />
        <h2>
          Stop rewatching.
          <br />
          <span>Start repurposing.</span>
        </h2>
        <p>Paste the link. Get the words. First one's free.</p>
        <button className="cts-big-btn" onClick={openLogin} type="button">
          <ArrowRight aria-hidden="true" size={17} />
          Transcribe Your First Reel Free
        </button>
      </section>

      <footer className="cts-footer">
        <div className="cts-footer-logo">
          Click<span>To</span>Script
        </div>
        <span>(c) 2026 ClickToScript. Made for creators.</span>
      </footer>

      <div
        aria-hidden={!isLoginOpen}
        className={`cts-login-overlay ${isLoginOpen ? "is-open" : ""}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setIsLoginOpen(false);
          }
        }}
      >
        <div aria-modal="true" className="cts-login-modal" role="dialog">
          <button aria-label="Close login prompt" className="cts-modal-x" onClick={() => setIsLoginOpen(false)} type="button">
            <X size={18} />
          </button>
          <div className="cts-login-modal-icon">
            <UserRound size={26} />
          </div>
          <div className="cts-login-free-badge">
            <Check aria-hidden="true" size={13} />
            1 Free Transcription
          </div>
          <h3>Sign in to transcribe</h3>
          <p>
            Create a free account and get <strong>1 transcription on us</strong>. Full transcript,
            hooks, summary, timestamps, no credit card.
          </p>
          <Link className="cts-login-modal-btn" href={TOOL_PATH}>
            Sign in with Google
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
          <button className="cts-login-modal-close" onClick={() => setIsLoginOpen(false)} type="button">
            Maybe later
          </button>
        </div>
      </div>

      <style>{`
        .cts-page {
          --cts-bg: oklch(0.205 0.006 342);
          --cts-bg-2: oklch(0.255 0.007 342);
          --cts-bg-3: oklch(0.305 0.008 342);
          --cts-card: oklch(0.278 0.008 342);
          --cts-border: rgba(249, 242, 246, 0.075);
          --cts-pink: oklch(0.61 0.25 350);
          --cts-pink-soft: rgba(232, 24, 124, 0.15);
          --cts-pink-glow: rgba(232, 24, 124, 0.35);
          --cts-text: oklch(0.94 0.008 342);
          --cts-muted: oklch(0.64 0.011 342);
          min-height: 100vh;
          overflow-x: hidden;
          background: var(--cts-bg);
          color: var(--cts-text);
          font-family: var(--font-click-body), sans-serif;
          line-height: 1.5;
        }

        .cts-page button,
        .cts-page input {
          font-family: inherit;
        }

        .cts-glow {
          position: absolute;
          left: 50%;
          pointer-events: none;
          transform: translateX(-50%);
        }

        .cts-glow-top {
          top: -120px;
          width: min(760px, 90vw);
          height: 620px;
          background: radial-gradient(circle, rgba(232, 24, 124, 0.13), transparent 70%);
        }

        .cts-nav {
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--cts-border);
          background: rgba(31, 29, 30, 0.9);
          padding: 20px 48px;
          backdrop-filter: blur(14px);
        }

        .cts-logo,
        .cts-footer-logo {
          color: var(--cts-text);
          font-family: var(--font-click-display), sans-serif;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .cts-logo span,
        .cts-footer-logo span,
        .cts-hero h1 span,
        .cts-final-cta h2 span {
          color: var(--cts-pink);
        }

        .cts-nav-cta,
        .cts-hero-btn,
        .cts-demo-url-btn,
        .cts-big-btn,
        .cts-login-modal-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 0;
          background: var(--cts-pink);
          color: oklch(0.985 0.006 342);
          cursor: pointer;
          font-weight: 700;
          text-decoration: none;
          transition: opacity 180ms ease, transform 180ms ease, box-shadow 180ms ease;
        }

        .cts-nav-cta:hover,
        .cts-hero-btn:hover,
        .cts-big-btn:hover,
        .cts-login-modal-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px) scale(1.02);
        }

        .cts-nav-cta {
          border-radius: 999px;
          padding: 10px 20px;
          font-size: 14px;
        }

        .cts-hero {
          position: relative;
          display: flex;
          min-height: 560px;
          height: 84vh;
          max-height: 820px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: visible;
          padding: 92px 24px 32px;
          text-align: center;
        }

        .cts-hero::after {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 80px;
          background: linear-gradient(to bottom, transparent, var(--cts-bg));
          content: "";
          pointer-events: none;
        }

        .cts-hero > * {
          animation: cts-fade-up 560ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .cts-hero-label {
          display: inline-block;
          border: 1px solid rgba(232, 24, 124, 0.24);
          border-radius: 999px;
          background: var(--cts-pink-soft);
          color: var(--cts-pink);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          margin-bottom: 10px;
          padding: 5px 14px;
          text-transform: uppercase;
        }

        .cts-hero h1 {
          font-family: var(--font-click-display), sans-serif;
          font-size: clamp(42px, 7.2vw, 86px);
          font-weight: 900;
          letter-spacing: 0;
          line-height: 1.02;
          margin: 0 0 28px;
          text-transform: uppercase;
          text-wrap: balance;
        }

        .cts-hero-sub {
          color: oklch(0.73 0.01 342);
          font-size: clamp(15px, 1.6vw, 18px);
          margin: 0 0 26px;
          max-width: 460px;
          text-wrap: pretty;
        }

        .cts-hero-input-wrap {
          display: flex;
          align-items: center;
          width: min(540px, 100%);
          border: 1px solid var(--cts-border);
          border-radius: 999px;
          background: var(--cts-card);
          gap: 10px;
          margin-bottom: 10px;
          padding: 7px 7px 7px 20px;
          transition: border-color 180ms ease;
        }

        .cts-hero-input-wrap:focus-within {
          border-color: rgba(232, 24, 124, 0.8);
        }

        .cts-hero-input-wrap input {
          min-width: 0;
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--cts-text);
          font-size: 14px;
        }

        .cts-hero-input-wrap input::placeholder {
          color: var(--cts-muted);
        }

        .cts-hero-btn {
          flex-shrink: 0;
          border-radius: 999px;
          padding: 11px 23px;
          font-size: 14px;
          white-space: nowrap;
        }

        .cts-hero-note {
          color: var(--cts-muted);
          font-size: 12px;
          margin: 0;
        }

        .cts-hero-note strong {
          color: oklch(0.82 0.01 342);
          font-weight: 600;
        }

        .cts-scroll-nudge {
          display: flex;
          align-items: center;
          border: 0;
          background: transparent;
          color: var(--cts-muted);
          cursor: pointer;
          flex-direction: column;
          font-size: 11px;
          gap: 6px;
          letter-spacing: 0.12em;
          margin-top: 18px;
          text-transform: uppercase;
          animation: cts-nudge 2s ease-in-out infinite;
        }

        .cts-demo {
          display: flex;
          align-items: center;
          flex-direction: column;
          padding: 20px 24px 80px;
        }

        .cts-demo-eyebrow {
          display: flex;
          align-items: center;
          color: var(--cts-muted);
          font-size: 11px;
          font-weight: 700;
          gap: 8px;
          letter-spacing: 0.18em;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .cts-demo-eyebrow::before,
        .cts-demo-eyebrow::after {
          width: 32px;
          height: 1px;
          background: var(--cts-border);
          content: "";
        }

        .cts-demo-window {
          position: relative;
          overflow: hidden;
          width: min(1000px, 100%);
          border: 1px solid var(--cts-border);
          border-radius: 16px;
          background: var(--cts-bg-2);
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.48), 0 0 0 1px rgba(255, 255, 255, 0.04);
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 520ms ease, transform 520ms ease;
        }

        .cts-demo-window.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .cts-demo-titlebar {
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--cts-border);
          background: var(--cts-bg-3);
          gap: 8px;
          padding: 13px 18px;
        }

        .cts-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .cts-dot-red {
          background: #ff5f57;
        }

        .cts-dot-yellow {
          background: #febc2e;
        }

        .cts-dot-green {
          background: #28c840;
        }

        .cts-titlebar-label {
          color: var(--cts-muted);
          font-size: 12px;
          letter-spacing: 0.06em;
          margin-left: 8px;
        }

        .cts-ready-badge {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--cts-border);
          border-radius: 999px;
          background: var(--cts-bg-2);
          color: var(--cts-muted);
          font-size: 11px;
          font-weight: 700;
          gap: 6px;
          margin-left: auto;
          padding: 4px 12px;
        }

        .cts-status-dot,
        .cts-pill span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #28c840;
        }

        .cts-status-dot.is-working,
        .cts-pill span {
          background: var(--cts-pink);
        }

        .cts-demo-body {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 280px;
          aspect-ratio: 16 / 10;
        }

        .cts-demo-left {
          display: flex;
          min-width: 0;
          overflow: hidden;
          border-right: 1px solid var(--cts-border);
          flex-direction: column;
          gap: 12px;
          padding: 18px 20px;
        }

        .cts-demo-url-bar {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          border: 1px solid var(--cts-border);
          border-radius: 8px;
          background: var(--cts-bg-3);
          gap: 10px;
          padding: 9px 12px;
          transition: border-color 260ms ease;
        }

        .cts-demo-url-bar.is-focused {
          border-color: rgba(232, 24, 124, 0.5);
        }

        .cts-demo-url-bar input {
          min-width: 0;
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--cts-text);
          font-size: 12px;
        }

        .cts-demo-url-btn {
          border-radius: 6px;
          flex-shrink: 0;
          font-size: 12px;
          padding: 7px 14px;
        }

        .cts-demo-url-btn.is-clicked {
          opacity: 0.82;
          transform: scale(0.94);
        }

        .cts-demo-status-bar {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          gap: 10px;
        }

        .cts-demo-status-label {
          color: var(--cts-pink);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .cts-demo-status-text {
          color: var(--cts-muted);
          font-size: 12px;
          transition: color 240ms ease;
        }

        .cts-demo-status-text.is-active {
          color: var(--cts-text);
        }

        .cts-progress-wrap {
          height: 2px;
          overflow: hidden;
          flex-shrink: 0;
          border-radius: 2px;
          background: var(--cts-border);
        }

        .cts-progress-bar {
          height: 100%;
          border-radius: 2px;
          background: var(--cts-pink);
          transition: width 400ms ease;
        }

        .cts-demo-content {
          position: relative;
          min-height: 0;
          flex: 1;
          overflow: hidden;
        }

        .cts-demo-idle {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          flex-direction: column;
          gap: 10px;
          text-align: center;
        }

        .cts-demo-idle-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--cts-bg-3);
          color: var(--cts-pink);
        }

        .cts-demo-idle h3,
        .cts-demo-transcript-box h4,
        .cts-demo-mini-card h4 {
          font-family: var(--font-click-display), sans-serif;
          font-weight: 700;
          letter-spacing: 0.04em;
          margin: 0;
          text-transform: uppercase;
        }

        .cts-demo-idle h3 {
          font-size: 16px;
        }

        .cts-demo-idle p {
          color: var(--cts-muted);
          font-size: 11px;
          margin: 0;
          max-width: 240px;
        }

        .cts-demo-output {
          display: flex;
          height: 100%;
          overflow-y: auto;
          flex-direction: column;
          gap: 10px;
          padding-right: 2px;
        }

        .cts-demo-output::-webkit-scrollbar {
          width: 4px;
        }

        .cts-demo-output::-webkit-scrollbar-thumb {
          border-radius: 2px;
          background: var(--cts-border);
        }

        .cts-demo-transcript-box,
        .cts-demo-mini-card {
          flex-shrink: 0;
          border: 1px solid var(--cts-border);
          border-radius: 8px;
          background: var(--cts-bg-3);
          padding: 11px 13px;
        }

        .cts-demo-transcript-box h4 {
          font-size: 15px;
          margin-bottom: 7px;
        }

        .cts-demo-transcript-box p,
        .cts-demo-mini-card p,
        .cts-ts-row p {
          color: oklch(0.82 0.01 342);
          font-size: 11.5px;
          line-height: 1.7;
          margin: 0;
        }

        .cts-demo-mini-grid {
          display: grid;
          flex-shrink: 0;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }

        .cts-demo-mini-card h4 {
          font-size: 13px;
          margin-bottom: 7px;
        }

        .cts-demo-mini-card span {
          display: block;
          border: 1px solid var(--cts-border);
          border-radius: 4px;
          background: var(--cts-bg-2);
          color: oklch(0.82 0.01 342);
          font-size: 10.5px;
          margin-bottom: 4px;
          padding: 4px 7px;
        }

        .cts-ts-row {
          display: grid;
          grid-template-columns: 88px minmax(0, 1fr);
          gap: 10px;
          border-bottom: 1px solid var(--cts-border);
          padding: 5px 0;
        }

        .cts-ts-row:last-child {
          border-bottom: 0;
        }

        .cts-ts-row span {
          color: var(--cts-pink);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .cts-demo-right {
          display: flex;
          background: var(--cts-bg-3);
          flex-direction: column;
          padding: 16px;
        }

        .cts-insta-embed {
          display: flex;
          height: 100%;
          overflow: hidden;
          border: 1px solid var(--cts-border);
          border-radius: 10px;
          flex-direction: column;
          opacity: 0;
          transition: opacity 600ms ease;
        }

        .cts-insta-embed.is-visible {
          opacity: 1;
        }

        .cts-insta-header {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          border-bottom: 1px solid var(--cts-border);
          background: var(--cts-bg-2);
          gap: 9px;
          padding: 10px 12px;
        }

        .cts-insta-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f09433, #dc2743 48%, #bc1888);
          color: oklch(0.985 0.006 342);
          flex-shrink: 0;
          font-size: 11px;
          font-weight: 700;
        }

        .cts-insta-username {
          min-width: 0;
          flex: 1;
          color: var(--cts-text);
          font-size: 11px;
          font-weight: 700;
        }

        .cts-insta-username span {
          display: block;
          color: var(--cts-muted);
          font-size: 9px;
          font-weight: 400;
        }

        .cts-insta-icon {
          opacity: 0.5;
        }

        .cts-insta-thumb {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          overflow: hidden;
          background: oklch(0.16 0.006 342);
        }

        .cts-insta-thumb::before {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            -45deg,
            oklch(0.19 0.006 342) 0,
            oklch(0.19 0.006 342) 10px,
            oklch(0.17 0.006 342) 10px,
            oklch(0.17 0.006 342) 20px
          );
          content: "";
        }

        .cts-insta-play {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          color: oklch(0.985 0.006 342);
        }

        .cts-insta-processing {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.55);
          color: oklch(0.985 0.006 342);
          flex-direction: column;
          font-size: 10px;
          font-weight: 700;
          gap: 8px;
          letter-spacing: 0.12em;
          opacity: 0;
          text-transform: uppercase;
          transition: opacity 400ms ease;
        }

        .cts-insta-processing.is-active {
          opacity: 1;
        }

        .cts-wave-bars {
          display: flex;
          align-items: flex-end;
          height: 24px;
          gap: 3px;
        }

        .cts-wave-bars span {
          width: 3px;
          border-radius: 2px;
          background: var(--cts-pink);
          animation: cts-wave 800ms ease-in-out infinite;
        }

        .cts-wave-bars span:nth-child(1),
        .cts-wave-bars span:nth-child(5) {
          height: 40%;
        }

        .cts-wave-bars span:nth-child(2),
        .cts-wave-bars span:nth-child(4) {
          height: 70%;
          animation-delay: 100ms;
        }

        .cts-wave-bars span:nth-child(3) {
          height: 100%;
          animation-delay: 200ms;
        }

        .cts-insta-caption {
          flex-shrink: 0;
          border-top: 1px solid var(--cts-border);
          background: var(--cts-bg-2);
          padding: 9px 12px;
        }

        .cts-insta-caption p {
          color: oklch(0.72 0.01 342);
          font-size: 10px;
          line-height: 1.5;
          margin: 0;
        }

        .cts-insta-caption strong {
          color: var(--cts-text);
        }

        .cts-ghost-cursor {
          position: absolute;
          z-index: 10;
          color: oklch(0.985 0.006 342);
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.62));
          opacity: 0;
          pointer-events: none;
          transform: translate(-4px, -4px);
          transition: left 680ms cubic-bezier(0.22, 1, 0.36, 1), top 680ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 260ms ease;
        }

        .cts-ghost-cursor.is-visible {
          opacity: 1;
        }

        .cts-click-ripple {
          position: absolute;
          z-index: 9;
          width: 28px;
          height: 28px;
          border: 2px solid var(--cts-pink);
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
          transform: translate(-50%, -50%) scale(0);
        }

        .cts-click-ripple.is-active {
          animation: cts-ripple 460ms ease-out forwards;
        }

        .cts-pills-section {
          display: flex;
          justify-content: center;
          padding: 0 24px 80px;
        }

        .cts-pills-row {
          display: flex;
          justify-content: center;
          max-width: 690px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .cts-pill {
          display: flex;
          align-items: center;
          border: 1px solid var(--cts-border);
          border-radius: 999px;
          background: var(--cts-card);
          color: oklch(0.82 0.01 342);
          font-size: 13px;
          font-weight: 600;
          gap: 8px;
          padding: 9px 18px;
        }

        .cts-final-cta {
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
          flex-direction: column;
          padding: 78px 24px 100px;
          text-align: center;
        }

        .cts-glow-bottom {
          bottom: -80px;
          width: min(620px, 88vw);
          height: 420px;
          background: radial-gradient(circle, rgba(232, 24, 124, 0.1), transparent 70%);
        }

        .cts-final-cta h2 {
          position: relative;
          font-family: var(--font-click-display), sans-serif;
          font-size: clamp(44px, 7vw, 80px);
          font-weight: 900;
          line-height: 0.96;
          margin: 0 0 20px;
          text-transform: uppercase;
          text-wrap: balance;
        }

        .cts-final-cta p {
          position: relative;
          color: var(--cts-muted);
          font-size: 16px;
          margin: 0 0 32px;
        }

        .cts-big-btn {
          position: relative;
          border-radius: 999px;
          box-shadow: 0 0 0 0 var(--cts-pink-glow);
          font-size: 16px;
          padding: 15px 34px;
        }

        .cts-big-btn:hover {
          box-shadow: 0 0 40px 0 var(--cts-pink-glow);
        }

        .cts-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--cts-border);
          color: var(--cts-muted);
          font-size: 13px;
          padding: 22px 48px;
        }

        .cts-footer-logo {
          font-size: 18px;
        }

        .cts-login-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.7);
          opacity: 0;
          padding: 20px;
          pointer-events: none;
          transition: opacity 250ms ease;
        }

        .cts-login-overlay.is-open {
          opacity: 1;
          pointer-events: auto;
        }

        .cts-login-modal {
          position: relative;
          width: min(380px, 100%);
          border: 1px solid var(--cts-border);
          border-radius: 18px;
          background: var(--cts-bg-2);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
          padding: 38px 34px;
          text-align: center;
          transform: translateY(18px);
          transition: transform 250ms ease;
        }

        .cts-login-overlay.is-open .cts-login-modal {
          transform: translateY(0);
        }

        .cts-modal-x {
          position: absolute;
          top: 14px;
          right: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: 1px solid var(--cts-border);
          border-radius: 50%;
          background: transparent;
          color: var(--cts-muted);
          cursor: pointer;
        }

        .cts-login-modal-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: var(--cts-pink-soft);
          color: var(--cts-pink);
          margin: 0 auto 20px;
        }

        .cts-login-free-badge {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(40, 200, 64, 0.25);
          border-radius: 999px;
          background: rgba(40, 200, 64, 0.12);
          color: #28c840;
          font-size: 11px;
          font-weight: 700;
          gap: 6px;
          letter-spacing: 0.08em;
          margin-bottom: 16px;
          padding: 4px 12px;
          text-transform: uppercase;
        }

        .cts-login-modal h3 {
          font-family: var(--font-click-display), sans-serif;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 0.03em;
          margin: 0 0 10px;
          text-transform: uppercase;
        }

        .cts-login-modal p {
          color: oklch(0.72 0.01 342);
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 28px;
          text-wrap: pretty;
        }

        .cts-login-modal p strong {
          color: var(--cts-text);
          font-weight: 700;
        }

        .cts-login-modal-btn {
          width: 100%;
          border-radius: 10px;
          font-size: 15px;
          padding: 13px;
        }

        .cts-login-modal-close {
          border: 0;
          background: transparent;
          color: var(--cts-muted);
          cursor: pointer;
          font-size: 13px;
          margin-top: 10px;
          padding: 6px;
        }

        .cts-spin {
          animation: cts-spin 900ms linear infinite;
        }

        @keyframes cts-fade-up {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cts-nudge {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(6px);
          }
        }

        @keyframes cts-wave {
          0%,
          100% {
            transform: scaleY(0.4);
          }
          50% {
            transform: scaleY(1);
          }
        }

        @keyframes cts-ripple {
          0% {
            opacity: 0.7;
            transform: translate(-50%, -50%) scale(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.8);
          }
        }

        @keyframes cts-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 760px) {
          .cts-nav {
            padding: 14px 18px;
          }

          .cts-logo {
            font-size: 19px;
          }

          .cts-nav-cta {
            padding: 9px 14px;
          }

          .cts-hero {
            min-height: 600px;
            padding-inline: 18px;
          }

          .cts-hero-input-wrap {
            align-items: stretch;
            border-radius: 24px;
            flex-direction: column;
            padding: 12px;
          }

          .cts-hero-input-wrap input {
            width: 100%;
            padding: 8px 4px;
            text-align: center;
          }

          .cts-hero-btn {
            width: 100%;
          }

          .cts-demo {
            padding-inline: 14px;
          }

          .cts-demo-body {
            grid-template-columns: 1fr;
            aspect-ratio: auto;
          }

          .cts-demo-left {
            border-right: 0;
            min-height: 520px;
          }

          .cts-demo-right {
            border-top: 1px solid var(--cts-border);
            height: 270px;
          }

          .cts-demo-url-bar {
            align-items: stretch;
            flex-direction: column;
          }

          .cts-demo-url-btn {
            width: 100%;
          }

          .cts-demo-mini-grid {
            grid-template-columns: 1fr;
          }

          .cts-footer {
            flex-direction: column;
            gap: 8px;
            padding-inline: 20px;
            text-align: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cts-page *,
          .cts-page *::before,
          .cts-page *::after {
            animation-duration: 1ms !important;
            scroll-behavior: auto !important;
            transition-duration: 1ms !important;
          }
        }
      `}</style>
    </main>
  );
}
