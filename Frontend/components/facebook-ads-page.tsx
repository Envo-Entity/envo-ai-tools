"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, RefreshCcw, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ApiError,
  createFacebookAdCampaign,
  generateFacebookAd,
  type FacebookAdsDebugLog,
  type FacebookAdCreateResult,
  type FacebookAdFormData,
  type FacebookAdGeneratedContent,
} from "@/lib/api";

type Screen = "form" | "preview" | "confirmation";

const initialFormState: FacebookAdFormData = {
  productDescription: "",
  targetLocation: "",
  dailyBudget: 10,
  ageMin: 25,
  ageMax: 55,
  publishImmediately: false,
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to read image."));
    };

    reader.onerror = () => reject(new Error("Failed to read image."));
    reader.readAsDataURL(file);
  });
}

function getSubmissionError(error: unknown) {
  if (error instanceof ApiError) {
    const lines = [error.message];

    if (error.step) {
      lines.push(`Step: ${error.step}`);
    }

    if (error.hint) {
      lines.push(error.hint);
    }

    const formErrors = error.details?.formErrors ?? [];
    for (const formError of formErrors) {
      lines.push(formError);
    }

    const fieldErrors = error.details?.fieldErrors ?? {};
    for (const [field, messages] of Object.entries(fieldErrors)) {
      if (!messages?.length) {
        continue;
      }

      lines.push(`${field}: ${messages.join(", ")}`);
    }

    return lines.join(" ");
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

function formatCta(value: FacebookAdGeneratedContent["callToAction"]) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDebugValue(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value, null, 2);
}

export function FacebookAdsPage() {
  const [screen, setScreen] = useState<Screen>("form");
  const [form, setForm] = useState<FacebookAdFormData>(initialFormState);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [generated, setGenerated] = useState<FacebookAdGeneratedContent | null>(null);
  const [creationResult, setCreationResult] = useState<FacebookAdCreateResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<FacebookAdsDebugLog[]>([]);

  const generateMutation = useMutation({
    mutationFn: generateFacebookAd,
    onSuccess: (response) => {
      setGenerated(response.generated);
      setDebugLogs(response.debugLogs ?? []);
      setScreen("preview");
      setErrorMessage(null);
    },
    onError: (error) => {
      setDebugLogs(error instanceof ApiError ? error.debugLogs ?? [] : []);
      setErrorMessage(getSubmissionError(error));
    },
  });

  const createMutation = useMutation({
    mutationFn: createFacebookAdCampaign,
    onSuccess: (response) => {
      setCreationResult(response);
      setDebugLogs(response.debugLogs ?? []);
      setScreen("confirmation");
      setErrorMessage(null);
    },
    onError: (error) => {
      setDebugLogs(error instanceof ApiError ? error.debugLogs ?? [] : []);
      setErrorMessage(getSubmissionError(error));
    },
  });

  const canSubmit = useMemo(() => {
    return (
      form.productDescription.trim().length >= 10 &&
      form.targetLocation.trim().length >= 2 &&
      form.ageMin <= form.ageMax &&
      form.dailyBudget > 0 &&
      !!imageBase64
    );
  }, [form, imageBase64]);

  async function handleImageChange(file: File | null) {
    setSelectedFile(file);
    setErrorMessage(null);

    if (!file) {
      setImagePreviewUrl(null);
      setImageBase64(null);
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setErrorMessage("Upload a JPG or PNG image.");
      setSelectedFile(null);
      setImagePreviewUrl(null);
      setImageBase64(null);
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      setErrorMessage("Image must be smaller than 30MB.");
      setSelectedFile(null);
      setImagePreviewUrl(null);
      setImageBase64(null);
      return;
    }

    const [dataUrl] = await Promise.all([readFileAsDataUrl(file)]);
    setImagePreviewUrl(URL.createObjectURL(file));
    setImageBase64(dataUrl);
  }

  async function handleGenerate() {
    if (!canSubmit) {
      setErrorMessage("Complete all fields and upload an image before generating.");
      return;
    }

    setErrorMessage(null);
    await generateMutation.mutateAsync(form);
  }

  async function handleCreate() {
    if (!generated || !imageBase64) {
      setErrorMessage("Generate the ad preview first.");
      return;
    }

    setErrorMessage(null);

    await createMutation.mutateAsync({
      form,
      generated,
      imageBase64,
    });
  }

  function resetToForm() {
    setScreen("form");
    setCreationResult(null);
    setDebugLogs([]);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(191,14,110,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(248,101,64,0.14),transparent_30%),var(--color-bg)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-accent text-sm uppercase tracking-[0.18em] text-[color:var(--color-accent)]">Tool 03</p>
            <h1 className="font-title mt-2 text-4xl tracking-[-0.05em] text-[color:var(--color-text)] sm:text-6xl">
              Facebook ads
            </h1>
            <p className="font-body mt-3 max-w-2xl text-sm leading-7 text-[color:var(--color-text-secondary)] sm:text-base">
              Build Facebook lead ads with Gemini-generated copy, preview the final creative, and publish to Meta only when you are ready.
            </p>
          </div>

          <Button className="hidden sm:inline-flex" onClick={() => window.history.back()} type="button" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-white/12 bg-[linear-gradient(180deg,rgba(36,33,36,0.92),rgba(20,18,23,0.98))]">
            <CardContent className="p-5 sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="font-accent text-sm uppercase tracking-[0.16em] text-[color:var(--color-primary)]">Workflow</p>
                  <h2 className="font-title mt-2 text-3xl tracking-[-0.05em] text-[color:var(--color-text)]">
                    {screen === "form" ? "Set up the ad" : screen === "preview" ? "Review before Meta" : "Campaign created"}
                  </h2>
                </div>

                <div className="font-body rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
                  {screen}
                </div>
              </div>

              {screen === "form" ? (
                <div className="space-y-5">
                  <label className="block">
                    <span className="font-body mb-2 block text-sm text-[color:var(--color-text-secondary)]">Product or service description</span>
                    <textarea
                      className="font-body min-h-36 w-full rounded-[24px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,0.04)] px-4 py-4 text-sm leading-7 text-[color:var(--color-text)] outline-none transition placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-primary)]"
                      onChange={(event) => setForm((current) => ({ ...current, productDescription: event.target.value }))}
                      placeholder="I help estate agents get more buyers with better quality Facebook leads."
                      value={form.productDescription}
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-body mb-2 block text-sm text-[color:var(--color-text-secondary)]">Target location</span>
                      <Input
                        onChange={(event) => setForm((current) => ({ ...current, targetLocation: event.target.value }))}
                        placeholder="Dublin, Ireland"
                        value={form.targetLocation}
                      />
                    </label>

                    <label className="block">
                      <span className="font-body mb-2 block text-sm text-[color:var(--color-text-secondary)]">Daily budget (EUR)</span>
                      <Input
                        min={1}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, dailyBudget: Number(event.target.value) || 0 }))
                        }
                        type="number"
                        value={form.dailyBudget}
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-body mb-2 block text-sm text-[color:var(--color-text-secondary)]">Audience age min</span>
                      <Input
                        max={65}
                        min={13}
                        onChange={(event) => setForm((current) => ({ ...current, ageMin: Number(event.target.value) || 0 }))}
                        type="number"
                        value={form.ageMin}
                      />
                    </label>

                    <label className="block">
                      <span className="font-body mb-2 block text-sm text-[color:var(--color-text-secondary)]">Audience age max</span>
                      <Input
                        max={65}
                        min={13}
                        onChange={(event) => setForm((current) => ({ ...current, ageMax: Number(event.target.value) || 0 }))}
                        type="number"
                        value={form.ageMax}
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="font-body mb-2 block text-sm text-[color:var(--color-text-secondary)]">Ad image</span>
                    <label className="flex cursor-pointer items-center justify-center rounded-[24px] border border-dashed border-white/15 bg-white/[0.03] px-5 py-8 text-center transition hover:border-white/25 hover:bg-white/[0.05]">
                      <input
                        accept="image/jpeg,image/png"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          void handleImageChange(file);
                        }}
                        type="file"
                      />
                      <div>
                        <Upload className="mx-auto h-6 w-6 text-[color:var(--color-accent)]" />
                        <p className="font-body mt-3 text-sm text-[color:var(--color-text)]">
                          {selectedFile ? selectedFile.name : "Upload JPG or PNG"}
                        </p>
                        <p className="font-body mt-1 text-xs text-[color:var(--color-text-tertiary)]">
                          Recommended 1080 x 1080. Max 30MB.
                        </p>
                      </div>
                    </label>
                  </label>

                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-body text-sm text-[color:var(--color-text)]">Publish immediately</p>
                        <p className="font-body mt-1 text-xs leading-6 text-[color:var(--color-text-secondary)]">
                          When off, the campaign is created paused as a draft inside Ads Manager.
                        </p>
                      </div>

                      <button
                        aria-pressed={form.publishImmediately}
                        className={`relative inline-flex h-8 w-14 shrink-0 rounded-full border transition ${
                          form.publishImmediately
                            ? "border-[rgba(236,45,48,0.5)] bg-[rgba(236,45,48,0.24)]"
                            : "border-white/10 bg-white/10"
                        }`}
                        onClick={() =>
                          setForm((current) => ({ ...current, publishImmediately: !current.publishImmediately }))
                        }
                        type="button"
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                            form.publishImmediately ? "left-8" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    {form.publishImmediately ? (
                      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-[rgba(236,45,48,0.24)] bg-[rgba(236,45,48,0.1)] px-3 py-2 text-sm text-[#ffb8b8]">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        This will spend real money.
                      </div>
                    ) : null}
                  </div>

                  {errorMessage ? (
                    <div className="rounded-2xl border border-[rgba(236,45,48,0.2)] bg-[rgba(236,45,48,0.1)] px-4 py-3 text-sm text-[#ffb8b8]">
                      {errorMessage}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-3">
                    <Button disabled={!canSubmit || generateMutation.isPending} onClick={() => void handleGenerate()} size="lg" type="button">
                      {generateMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Generate Ad
                    </Button>

                    <Link className="font-body text-sm text-[color:var(--color-text-secondary)] underline-offset-4 hover:underline" href="/">
                      Return to tools
                    </Link>
                  </div>
                </div>
              ) : null}

              {screen === "preview" && generated ? (
                <div className="space-y-5">
                  <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
                      {imagePreviewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img alt="Ad preview" className="aspect-square h-full w-full object-cover" src={imagePreviewUrl} />
                      ) : (
                        <div className="flex aspect-square items-center justify-center text-sm text-[color:var(--color-text-tertiary)]">
                          No image uploaded
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                        <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-accent)]">Headline</p>
                        <p className="font-title mt-2 text-3xl tracking-[-0.04em] text-[color:var(--color-text)]">{generated.headline}</p>
                      </div>

                      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                        <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-accent)]">Primary Text</p>
                        <p className="font-body mt-2 whitespace-pre-wrap text-sm leading-7 text-[color:var(--color-text-secondary)]">
                          {generated.primaryText}
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                          <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-accent)]">CTA</p>
                          <p className="font-body mt-2 text-sm text-[color:var(--color-text)]">{formatCta(generated.callToAction)}</p>
                        </div>
                        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                          <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-accent)]">Delivery</p>
                          <p className="font-body mt-2 text-sm text-[color:var(--color-text)]">
                            {form.publishImmediately ? "Publish live immediately" : "Save as paused draft"}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                        <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-accent)]">Interests</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {generated.interests.map((interest) => (
                            <span
                              key={interest}
                              className="font-body rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-[color:var(--color-text-secondary)]"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                      <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-accent)]">Campaign name</p>
                      <p className="font-body mt-2 text-sm text-[color:var(--color-text-secondary)]">{generated.campaignName}</p>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                      <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-accent)]">Ad set name</p>
                      <p className="font-body mt-2 text-sm text-[color:var(--color-text-secondary)]">{generated.adSetName}</p>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                      <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-accent)]">Ad name</p>
                      <p className="font-body mt-2 text-sm text-[color:var(--color-text-secondary)]">{generated.adName}</p>
                    </div>
                  </div>

                  {errorMessage ? (
                    <div className="rounded-2xl border border-[rgba(236,45,48,0.2)] bg-[rgba(236,45,48,0.1)] px-4 py-3 text-sm text-[#ffb8b8]">
                      {errorMessage}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-3">
                    <Button disabled={createMutation.isPending} onClick={() => void handleCreate()} size="lg" type="button">
                      {createMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="mr-2 h-4 w-4" />
                      )}
                      Create Ad
                    </Button>
                    <Button disabled={generateMutation.isPending} onClick={() => void handleGenerate()} type="button" variant="outline">
                      {generateMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCcw className="mr-2 h-4 w-4" />
                      )}
                      Regenerate
                    </Button>
                    <Button onClick={resetToForm} type="button" variant="ghost">
                      Back
                    </Button>
                  </div>
                </div>
              ) : null}

              {screen === "confirmation" && creationResult ? (
                <div className="space-y-5">
                  <div className="rounded-[28px] border border-[rgba(12,157,97,0.2)] bg-[rgba(12,157,97,0.1)] p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[color:var(--color-success)]" />
                      <div>
                        <p className="font-title text-3xl tracking-[-0.04em] text-[color:var(--color-text)]">
                          Campaign ready in Meta
                        </p>
                        <p className="font-body mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                          {creationResult.campaignName} was created successfully. Open Ads Manager to review the campaign and make any last-mile adjustments.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                      <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-accent)]">Campaign name</p>
                      <p className="font-body mt-2 text-sm text-[color:var(--color-text-secondary)]">{creationResult.campaignName}</p>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                      <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-accent)]">Campaign ID</p>
                      <p className="font-body mt-2 text-sm text-[color:var(--color-text-secondary)]">{creationResult.campaignId}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      className="font-body inline-flex h-11 items-center justify-center rounded-xl border border-[color:var(--color-primary)] bg-[color:var(--color-primary)] px-6 py-2 text-sm tracking-[0.02em] text-white transition-colors hover:border-[color:var(--color-primary-strong)] hover:bg-[color:var(--color-primary-strong)]"
                      href={creationResult.adsManagerUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open Ads Manager
                    </a>
                    <Button
                      onClick={() => {
                        setGenerated(null);
                        setCreationResult(null);
                        setScreen("form");
                      }}
                      type="button"
                      variant="outline"
                    >
                      Create another ad
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="bg-[linear-gradient(180deg,rgba(16,25,38,0.9),rgba(20,18,23,0.96))]">
              <CardContent className="p-5">
                <p className="font-accent text-sm uppercase tracking-[0.16em] text-[color:var(--color-accent)]">Hardcoded setup</p>
                <div className="font-body mt-4 space-y-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                  <p>Objective: OUTCOME_LEADS</p>
                  <p>Format: Single image</p>
                  <p>Gender: All</p>
                  <p>Placement: Automatic</p>
                  <p>Currency assumptions: EUR budget entry</p>
                  <p>Bid strategy: Lowest cost without cap</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[linear-gradient(180deg,rgba(56,16,16,0.88),rgba(20,18,23,0.96))]">
              <CardContent className="p-5">
                <p className="font-accent text-sm uppercase tracking-[0.16em] text-[#ffb8b8]">Meta checklist</p>
                <div className="font-body mt-4 space-y-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                  <p>App must be in Live mode.</p>
                  <p>Token user needs Manage permission on the connected Page.</p>
                  <p>Required permissions include ads and pages management scopes.</p>
                  <p>Location targeting is resolved through Meta geolocation search.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[linear-gradient(180deg,rgba(23,24,42,0.92),rgba(16,18,30,0.98))]">
              <CardContent className="p-5">
                <p className="font-accent text-sm uppercase tracking-[0.16em] text-[color:var(--color-accent)]">Backend logs</p>
                <div className="mt-4 space-y-3">
                  {debugLogs.length === 0 ? (
                    <p className="font-body text-sm leading-7 text-[color:var(--color-text-secondary)]">
                      Generate or create an ad to see the backend's outbound API calls and responses here.
                    </p>
                  ) : (
                    debugLogs.map((log, index) => (
                      <div
                        key={`${log.timestamp}-${index}`}
                        className={`rounded-2xl border px-4 py-3 ${
                          log.level === "error"
                            ? "border-[rgba(236,45,48,0.24)] bg-[rgba(236,45,48,0.1)]"
                            : "border-white/10 bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-body text-sm text-[color:var(--color-text)]">{log.message}</p>
                          <span className="font-body text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
                            {log.level}
                          </span>
                        </div>
                        <p className="font-body mt-1 text-xs text-[color:var(--color-text-tertiary)]">{log.timestamp}</p>
                        {log.data ? (
                          <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/20 p-3 text-xs leading-6 text-[color:var(--color-text-secondary)] whitespace-pre-wrap">
                            {formatDebugValue(log.data)}
                          </pre>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
