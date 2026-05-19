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
    description:
      "Create slide decks with AI-driven outlines, tone control, and fast first drafts.",
    status: "Under Construction",
    href: "/slides-maker",
  },
  {
    name: "Presentation Decks",
    description:
      "Create beautiful modern PPT-style slides with richer copy, stronger structure, and pitch-deck energy.",
    status: "Under Construction",
    href: "/presentation-decks",
  },
  {
    name: "Facebook ads",
    description:
      "Generate Facebook lead ads with Gemini-written copy, review everything in preview, and push campaigns straight to Meta.",
    status: "Under Construction",
    href: "/facebook-ads",
  },
  {
    name: "Instagram Transcriber",
    description:
      "Paste a public Reel link, download it server-side, send it through Gemini, and get a clean transcript back.",
    status: "Live",
    href: "/instagram-transcriber",
  },
  {
    name: "Gud For Us Prompt Race",
    description:
      "Compare two Gemini prompt variants on the same product image and inspect scores, compatibility, and ingredients side by side.",
    status: "Under Construction",
    href: "/gud-for-us-prompt-race",
  },
];

const PAGE_SIZE = 4;

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
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
      setError(
        unlockError instanceof Error ? unlockError.message : "Unlock failed.",
      );
    }
  }

  return (
    <div className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <ClickToScriptLanding />
    </div>
  );
}
