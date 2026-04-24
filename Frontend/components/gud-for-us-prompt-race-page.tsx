"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Loader2, Search, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ApiError,
  analyzePromptRace,
  analyzePromptTwoAgentOne,
  analyzePromptTwoAgentTwo,
  analyzePromptTwoAgentThree,
  analyzeSupabaseScan,
  type PromptRaceAgentOneResult,
  type PromptRaceAnalysis,
  type PromptRaceGeneratedImage,
  type PromptRaceUsage,
} from "@/lib/api";

const MOCK_PROFILE = {
  allergies: ["Shellfish"],
  healthConditions: ["High cholesterol"],
  dietaryPreferences: ["High protein", "Low sugar"],
  skinConditions: ["Acne-prone skin"],
};

const DEFAULT_PROMPT = `Analyze product image.

USER PROFILE:
Allergies: Shellfish
Health Conditions: High cholesterol
Dietary Preferences: High protein, Low sugar
Skin Conditions: Acne-prone skin

🌐 WEB SEARCH: Search for (1) complete nutrition facts for this specific product from authoritative sources (official brand site, food databases), and (2) lab test results or third-party safety testing data. Prioritize nutrition completeness.

LANGUAGE: Generate all text fields (descriptions, summaries, labels) in English. Keep product names and ingredient titles in their original language.

VALIDATION: Accept food/beverage/cosmetics/personal care/supplements. Reject if unclear/non-consumable.

EXTRACT:
- product_name, category (food/beverage/cosmetics/other), subtitle
- health_score (0-100), planet_score (0-100)
- ingredients: [{title, description, health_impact: good/okay/bad}] ( all ingredients )
- make sure to get all ingredients , dont leave out any no matter how big the list gets
  For each ingredient description (2-3 sentences):
  * What it is and its function/purpose in the product
  * Key health implications, benefits, or concerns
  * Processing/sourcing context if relevant to health
- compatibility:
  - score (0-100): reflects BOTH personal profile match AND the product's overall healthiness. A product with a low health_score should never have a high compatibility score regardless of profile match.
  - label: "low" (0-39), "moderate" (40-69), or "high" (70-100)
  - likes: array of positive matches with user profile (text only)
  - concerns: array of warnings/issues (text only, flag allergens and ingredients that aggravate user's skin or health conditions)
  - summary: 1 sentence assessment

Return JSON. Be concise overall, but informative on ingredients.`;

const AGENT_ONE_PROMPT = `AGENT 1 — THE EXTRACTOR
Single job: Pull every ingredient. Nothing else.
Core Instructions

Extract ingredients exactly as they appear — do not correct spelling, do not normalise names, do not skip anything that looks unfamiliar or unpronounceable
Preserve the original order from the label (order = descending weight, this matters for Agent 2)
If scanning an image, flag low-confidence reads — anything blurry, cut off, or ambiguous should be marked with a [?] rather than guessed
Separate the ingredients list from any other label text (claims like "natural", "organic", certifications, marketing copy) — do not mix them
If the product has multiple components (e.g. a seasoning sachet + a base), extract each section separately and label them

Pitfall Prevention

Do not infer ingredients from the product name or category. A product that says "Vitamin C Serum" on the front might not list Ascorbic Acid — do not add it
Do not merge similar-sounding ingredients into one. "Sodium Chloride" and "Sea Salt" should remain as two separate entries if listed separately
Do not drop ingredients just because they appear after "less than 2% of" or similar threshold language — extract them all, but note the threshold flag
Watch for hidden allergen declarations and "contains" statements — extract those too as a separate block
Parenthetical ingredients (e.g. "Sugar (Beet)") should be kept intact, not split
Web search is mandatory. Before finalizing, search for the exact product's ingredient panel on official brand pages, retailer listings, or reliable food/cosmetic databases. Use that search to recover blurry, truncated, or partially hidden ingredients and to cross-check low-confidence reads. Prefer the most complete list that still matches the exact product variant in the uploaded image. Do not use web search to invent ingredients that are unsupported by either the image or a reliable matching source.
Available categories:
- Drinks & Beverages
- Food Products
- Eggs Scoring
- Milk Scoring
- Plant-Based Milk Scoring
- Bread Products
- Dairy Products
- Fast Food
- Produce
- Sweeteners
- Tea Products
- Meat & Seafood
- Cleaning Agents
- Home Essentials
- Food Storage Containers
- Bedding & Sleep Products
- Cookware
- Fragrances & Perfumes
- Dental Care
- Topical Products
- Feminine Care Products
- Baby Care Products
- Baby Formula
- Clothing & Textiles
WEB SEARCH REQUIREMENT:
Before finalizing the ingredient list, search for the exact product's official ingredient panel on brand pages, retailer listings, or food/cosmetic databases. Use results to recover blurry or truncated ingredients and to verify low-confidence reads. Do not add ingredients unsupported by both the image and a reliable web source.

Output Format
Return JSON with:
- product_name
- categories: one or more category labels that best fit the exact product
- extracted_ingredients: a clean numbered ingredient list only

The extracted_ingredients field must contain only:
- Ingredient name exactly as written
- Position number
- Low-confidence flag if applicable
- Section label if multi-component product

That is the entire output. Agent 1 is done.`;

const AGENT_TWO_PROMPT = `AGENT 2 — THE SENSE MAKER

Inputs: Product name, product category, full ordered ingredient list from Agent 1, user health profile, category-specific rules.

---

STAGE 1 — CLASSIFY EVERY INGREDIENT

For each ingredient, assign one of three categories:

GOOD — Demonstrated positive or neutral-positive function, well-researched safety profile, no credible concern at typical use levels.

OKAY — Functional filler, preservative, or processing aid with no meaningful benefit but no significant harm at typical exposure. Or: ingredient with mixed or genuinely inconclusive research where no regulatory body has raised a formal concern.

BAD — Has credible, peer-reviewed concern at typical consumer exposure levels. This includes: proven harmful, likely harmful, harmful specifically in this product type or format, or currently flagged by a major regulatory body (FDA, EFSA, Health Canada) as not generally recognized as safe — even if the ingredient remains technically legal and in use.

---

BASE REASONING STANDARD — APPLY TO EVERY INGREDIENT WITHOUT EXCEPTION

Before assigning any classification, answer these three questions:

1. What is this ingredient's current regulatory standing with FDA, EFSA, or Health Canada — not its historical approval status, its current standing as of the most recent review.
2. Is there peer-reviewed research published in the last 10 years raising concerns about endocrine disruption, carcinogenicity, systemic absorption, organ toxicity, or harm at typical consumer exposure levels for this ingredient.
3. Does the function of this ingredient in this specific product type increase or decrease its risk profile — a leave-on product is higher risk than a rinse-off, a food product means ingestion which changes absorption dynamics entirely.

Answer all three before assigning a classification. This applies to every ingredient regardless of category.

---

CLASSIFICATION RULES

Classification must be product-context aware. The product category changes the verdict. An ingredient that is safe in one format can be harmful in another — factor the delivery mechanism, exposure duration, and intended use into every call.

Quantity position matters. A BAD ingredient in position 2 or 3 is far more serious than the same ingredient in position 22. Factor this explicitly into the description, not just the score.

Do not classify based on wellness influencer culture or clean beauty marketing. The bar is published studies, regulatory agency positions, or toxicology consensus.

When research is genuinely mixed and no regulatory flag exists, classify as OKAY and say so explicitly. Do not inflate to BAD to seem thorough.

---

CATEGORY-SPECIFIC RULES

Category-specific rules for this product have been provided to you alongside this prompt. Read them fully before beginning classification. They take precedence over general reasoning where they conflict. Apply every rule that is relevant to an ingredient you encounter — do not skip a rule because the ingredient seems benign on the surface.

If no category rules are provided, fall back entirely on the base reasoning standard above.

---

STAGE 2 — HEALTH SCORE

Start at 100. Deduct using this logic:

BAD ingredient in top 5 by position — deduct 12 to 15 points depending on severity of the concern and strength of evidence
BAD ingredient in position 6 to 15 — deduct 6 to 10 points
BAD ingredient below position 15 — deduct 2 to 5 points
Multiple BAD ingredients from the same risk category — apply a compounding penalty, not separate full deductions. The risk compounds but does not simply stack.
OKAY ingredients carrying a mandatory risk note from the category rules — deduct 1 to 2 points per flagged ingredient as a minor cumulative penalty
GOOD ingredients — no bonus. 100 is the ceiling.

Show all working explicitly. Every deduction listed with ingredient name, position, reason, and points taken. The output must be fully auditable.

Final score is a number from 0 to 100 with a one-line verdict on what drove it there.

---

STAGE 3 — COMPATIBILITY SCORE

Runs after the health score. Uses the user profile exclusively.

For each BAD or OKAY ingredient, ask: does this create a specific elevated risk for this user beyond general population concern?

This score is entirely separate from the health score. A product can be 82 on health and 35 on compatibility. They measure different things and must never be averaged or merged.

Output a score from 0 to 100. List every ingredient that moved it down with the reason tied directly to the user's declared profile — not invented sensitivities, not general caution.

If user profile is empty, return health score only and flag: "Compatibility score unavailable — no user profile provided."

---

PITFALL PREVENTION

Never hallucinate a study or regulatory finding. If you cannot confirm the evidence base with confidence, downgrade to OKAY and flag as "limited data — classified conservatively."

Do not let product branding influence anything. "Dermatologist tested", "Natural", "Clean", "Organic", "Free from" on the label are marketing claims and carry zero weight in this analysis.

Do not penalise the same ingredient twice across health score and compatibility score without clearly labelling each deduction as separate and distinct in reasoning.

Do not be paranoid. An ingredient that is legal, widely studied, and shows no meaningful concern in peer-reviewed literature at typical use levels does not get penalised just because it sounds chemical or synthetic. The bar is real evidence, not precautionary anxiety.

---

OUTPUT STRUCTURE

Product name
Product category
Ingredient list — each with classification, position number, and specific description
Health Score: [number] / 100
Health Score deduction log
Compatibility Score: [number] / 100 (or unavailable flag)
Compatibility breakdown per ingredient tied to user profile
One paragraph plain-English verdict on the overall product`;

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

function ingredientTone(impact: string, isSelected: boolean) {
  if (impact === "good") {
    return isSelected
      ? "border-emerald-300/60 bg-emerald-500/20 text-emerald-100"
      : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200";
  }

  if (impact === "bad") {
    return isSelected
      ? "border-rose-300/60 bg-rose-500/20 text-rose-100"
      : "border-rose-400/30 bg-rose-500/10 text-rose-200";
  }

  return isSelected
    ? "border-amber-200/60 bg-amber-400/20 text-amber-50"
    : "border-amber-300/25 bg-amber-400/10 text-amber-100";
}

function ingredientLabel(impact: string) {
  if (impact === "good") {
    return "Good";
  }

  if (impact === "bad") {
    return "Bad";
  }

  return "Okay";
}

function renderScore(value: number | null | undefined) {
  return value ?? "N/A";
}

function formatUsd(value: number) {
  return `$${value.toFixed(6)}`;
}

function combineUsage(
  first: PromptRaceUsage | null,
  second: PromptRaceUsage | null,
) {
  if (!first || !second) {
    return null;
  }

  return {
    model: second.model,
    tokens: {
      prompt: first.tokens.prompt + second.tokens.prompt,
      cached: first.tokens.cached + second.tokens.cached,
      output: first.tokens.output + second.tokens.output,
      thoughts: first.tokens.thoughts + second.tokens.thoughts,
      total: first.tokens.total + second.tokens.total,
    },
    cost: {
      input_usd: Number(
        (first.cost.input_usd + second.cost.input_usd).toFixed(6),
      ),
      cached_usd: Number(
        (first.cost.cached_usd + second.cost.cached_usd).toFixed(6),
      ),
      output_usd: Number(
        (first.cost.output_usd + second.cost.output_usd).toFixed(6),
      ),
      thoughts_usd: Number(
        (first.cost.thoughts_usd + second.cost.thoughts_usd).toFixed(6),
      ),
      total_usd: Number(
        (first.cost.total_usd + second.cost.total_usd).toFixed(6),
      ),
    },
  } satisfies PromptRaceUsage;
}

function AnalysisColumn({
  title,
  analysis,
  usage,
  statusLabel,
  costNote,
  selectedCategories,
}: {
  title: string;
  analysis: PromptRaceAnalysis | null;
  usage: PromptRaceUsage | null;
  statusLabel?: string | null;
  costNote?: string | null;
  selectedCategories?: string[];
}) {
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(
    null,
  );
  const activeIngredient =
    analysis?.ingredients?.find(
      (ingredient) => ingredient.title === selectedIngredient,
    ) ?? null;

  return (
    <Card className="border-white/12 bg-[linear-gradient(180deg,rgba(36,33,36,0.92),rgba(20,18,23,0.98))]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
              {title}
            </p>
            {statusLabel ? (
              <p className="font-body mt-2 text-xs uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
                {statusLabel}
              </p>
            ) : null}
            <h3 className="font-title mt-2 text-2xl tracking-[-0.04em] text-[color:var(--color-text)]">
              {analysis?.product_name ?? "No result yet"}
            </h3>
            {analysis?.product_subtitle ? (
              <p className="font-body mt-2 text-sm text-[color:var(--color-text-secondary)]">
                {analysis.product_subtitle}
              </p>
            ) : null}
          </div>
          <div className="font-body rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-[color:var(--color-text-secondary)]">
            {analysis?.category ?? "Unknown"}
          </div>
          {costNote ? (
            <p className="font-body mt-2 text-xs text-[color:var(--color-text-tertiary)]">
              {costNote}
            </p>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <p className="font-accent text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
              Health Score
            </p>
            <p className="font-title mt-2 text-4xl tracking-[-0.04em] text-[color:var(--color-text)]">
              {renderScore(analysis?.health_score)}
            </p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <p className="font-accent text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
              Compatibility
            </p>
            <p className="font-title mt-2 text-4xl tracking-[-0.04em] text-[color:var(--color-text)]">
              {renderScore(analysis?.compatibility?.score)}
            </p>
            <p className="font-body mt-1 text-xs text-[color:var(--color-text-secondary)]">
              {analysis?.compatibility?.label ?? "No label"}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-accent text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
              Tokens & Cost
            </p>
            <p className="font-body text-xs text-[color:var(--color-text-tertiary)]">
              {usage?.model ?? "No model data"}
            </p>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/15 px-3 py-3">
              <p className="font-body text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                Prompt Tokens
              </p>
              <p className="font-title mt-1 text-2xl tracking-[-0.03em] text-[color:var(--color-text)]">
                {usage?.tokens.prompt ?? "N/A"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/15 px-3 py-3">
              <p className="font-body text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                Output Tokens
              </p>
              <p className="font-title mt-1 text-2xl tracking-[-0.03em] text-[color:var(--color-text)]">
                {usage?.tokens.output ?? "N/A"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/15 px-3 py-3">
              <p className="font-body text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                Total Tokens
              </p>
              <p className="font-title mt-1 text-2xl tracking-[-0.03em] text-[color:var(--color-text)]">
                {usage?.tokens.total ?? "N/A"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/15 px-3 py-3">
              <p className="font-body text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                Estimated Cost
              </p>
              <p className="font-title mt-1 text-2xl tracking-[-0.03em] text-[color:var(--color-text)]">
                {usage ? formatUsd(usage.cost.total_usd) : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
          <p className="font-accent text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
            Compatibility Summary
          </p>
          <p className="font-body mt-2 text-sm leading-7 text-[color:var(--color-text-secondary)]">
            {analysis?.compatibility?.summary ??
              "Run the prompt to see personalized compatibility."}
          </p>
        </div>

        {analysis?.reasoning ? (
          <details className="mt-5 rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <summary className="font-accent cursor-pointer text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
              Agent Reasoning
            </summary>
            <p className="font-body mt-3 whitespace-pre-wrap text-sm leading-7 text-[color:var(--color-text-secondary)]">
              {analysis.reasoning}
            </p>
          </details>
        ) : null}

        {selectedCategories?.length ? (
          <div className="mt-5 rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-accent text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                AI Selected Categories
              </p>
              <p className="font-body text-xs text-[color:var(--color-text-tertiary)]">
                {selectedCategories.length} selected
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <span
                  key={`${title}-${category}`}
                  className="font-body rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="font-accent text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
              Ingredients
            </p>
            <p className="font-body text-xs text-[color:var(--color-text-tertiary)]">
              {analysis?.ingredients?.length ?? 0} items
            </p>
          </div>

          {analysis?.ingredients?.length ? (
            <>
              <div className="flex flex-wrap gap-2">
                {analysis.ingredients.map((ingredient) => {
                  const isSelected = ingredient.title === selectedIngredient;

                  return (
                    <button
                      key={`${title}-${ingredient.title}`}
                      className={`rounded-full border px-3 py-2 text-left transition hover:scale-[1.01] ${ingredientTone(
                        ingredient.health_impact,
                        isSelected,
                      )}`}
                      onClick={() =>
                        setSelectedIngredient(
                          isSelected ? null : ingredient.title,
                        )
                      }
                      type="button"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-body text-sm">
                          {ingredient.title}
                        </span>
                        <span className="font-accent text-[10px] uppercase tracking-[0.14em] opacity-80">
                          {ingredientLabel(ingredient.health_impact)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-[20px] border border-white/10 bg-black/15 p-4">
                {activeIngredient ? (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-title text-xl tracking-[-0.03em] text-[color:var(--color-text)]">
                        {activeIngredient.title}
                      </h4>
                      <span
                        className={`font-body rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.12em] ${ingredientTone(
                          activeIngredient.health_impact,
                          false,
                        )}`}
                      >
                        {ingredientLabel(activeIngredient.health_impact)}
                      </span>
                    </div>
                    <p className="font-body mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                      {activeIngredient.description}
                    </p>
                  </>
                ) : (
                  <p className="font-body text-sm text-[color:var(--color-text-secondary)]">
                    Click any ingredient chip to see its description.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-[20px] border border-dashed border-white/10 bg-white/[0.02] p-4">
              <p className="font-body text-sm text-[color:var(--color-text-secondary)]">
                Ingredients will appear here after you run the prompt.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function GudForUsPromptRacePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [promptOne, setPromptOne] = useState(DEFAULT_PROMPT);
  const [agentOnePrompt, setAgentOnePrompt] = useState(AGENT_ONE_PROMPT);
  const [agentTwoPrompt, setAgentTwoPrompt] = useState(AGENT_TWO_PROMPT);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [promptOneResult, setPromptOneResult] = useState<{
    analysis: PromptRaceAnalysis;
    usage: PromptRaceUsage;
  } | null>(null);
  const [promptTwoResult, setPromptTwoResult] = useState<{
    analysis: PromptRaceAnalysis;
    agentOneResult: PromptRaceAgentOneResult;
    agentOneUsage: PromptRaceUsage;
    agentTwoUsage: PromptRaceUsage;
  } | null>(null);
  const [supabaseResult, setSupabaseResult] = useState<{
    analysis: PromptRaceAnalysis;
    usage: PromptRaceUsage;
  } | null>(null);
  const [agentThreeResult, setAgentThreeResult] = useState<{
    image: PromptRaceGeneratedImage;
    usage: PromptRaceUsage;
  } | null>(null);
  const [promptOneStatus, setPromptOneStatus] = useState<string>("Idle");
  const [promptTwoStatus, setPromptTwoStatus] = useState<string>("Idle");
  const [supabaseStatus, setSupabaseStatus] = useState<string>("Idle");
  const [agentThreeStatus, setAgentThreeStatus] = useState<string>("Idle");
  const [isRunning, setIsRunning] = useState(false);

  const canRun = useMemo(() => {
    return Boolean(
      imageBase64 &&
      promptOne.trim().length > 20 &&
      agentOnePrompt.trim().length > 20 &&
      agentTwoPrompt.trim().length > 20,
    );
  }, [imageBase64, promptOne, agentOnePrompt, agentTwoPrompt]);

  async function handleImageChange(file: File | null) {
    setSelectedFile(file);
    setErrorMessage(null);

    if (!file) {
      setImagePreviewUrl(null);
      setImageBase64(null);
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrorMessage("Upload a JPG, PNG, or WEBP image.");
      setSelectedFile(null);
      setImagePreviewUrl(null);
      setImageBase64(null);
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setImageBase64(dataUrl);
  }

  async function handleRun() {
    if (!imageBase64) {
      setErrorMessage("Upload a product image first.");
      return;
    }

    setErrorMessage(null);
    setIsRunning(true);
    setPromptOneResult(null);
    setPromptTwoResult(null);
    setSupabaseResult(null);
    setAgentThreeResult(null);
    setPromptOneStatus("Working");
    setPromptTwoStatus("Waiting for Agent 1");
    setSupabaseStatus("Working");
    setAgentThreeStatus("Generating product image");

    const promptOnePromise = analyzePromptRace({
      imageBase64,
      prompt: promptOne,
      enableGrounding: true,
    })
      .then((response) => {
        setPromptOneResult(response);
        setPromptOneStatus("Done");
      })
      .catch((error) => {
        setPromptOneStatus("Failed");
        setErrorMessage(
          (current) =>
            current ??
            (error instanceof ApiError
              ? error.message
              : error instanceof Error
                ? error.message
                : "Prompt 1 failed."),
        );
      });

    const promptTwoPromise = analyzePromptTwoAgentOne({
      imageBase64,
      prompt: agentOnePrompt,
      enableGrounding: true,
    })
      .then(async (agentOneResponse) => {
        setPromptTwoStatus("Agent 2 is working");
        const agentTwoResponse = await analyzePromptTwoAgentTwo({
          imageBase64,
          prompt: agentTwoPrompt,
          extractedIngredients: agentOneResponse.extractedIngredients,
          agentOneProductName: agentOneResponse.productName,
          agentOneCategories: agentOneResponse.categories,
          userProfile: MOCK_PROFILE,
          enableGrounding: true,
        });

        setPromptTwoResult({
          analysis: agentTwoResponse.analysis,
          agentOneResult: {
            productName: agentOneResponse.productName,
            categories: agentOneResponse.categories,
            extractedIngredients: agentOneResponse.extractedIngredients,
          },
          agentOneUsage: agentOneResponse.usage,
          agentTwoUsage: agentTwoResponse.usage,
        });
        setPromptTwoStatus("Done");
      })
      .catch((error) => {
        setPromptTwoStatus("Failed");
        setErrorMessage(
          (current) =>
            current ??
            (error instanceof ApiError
              ? error.message
              : error instanceof Error
                ? error.message
                : "Prompt 2 failed."),
        );
      });

    const agentThreePromise = analyzePromptTwoAgentThree({
      imageBase64,
    })
      .then((response) => {
        setAgentThreeResult(response);
        setAgentThreeStatus("Done");
      })
      .catch((error) => {
        setAgentThreeStatus("Failed");
        setErrorMessage(
          (current) =>
            current ??
            (error instanceof ApiError
              ? error.message
              : error instanceof Error
                ? error.message
                : "Agent 3 failed."),
        );
      });

    const supabasePromise = analyzeSupabaseScan({
      imageBase64,
    })
      .then((response) => {
        setSupabaseResult(response);
        setSupabaseStatus("Done");
      })
      .catch((error) => {
        setSupabaseStatus("Failed");
        setErrorMessage(
          (current) =>
            current ??
            (error instanceof ApiError
              ? error.message
              : error instanceof Error
                ? error.message
                : "Supabase scan failed."),
        );
      });

    await Promise.allSettled([
      promptOnePromise,
      promptTwoPromise,
      agentThreePromise,
      supabasePromise,
    ]);
    setIsRunning(false);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(191,14,110,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(248,101,64,0.14),transparent_30%),var(--color-bg)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-accent text-sm uppercase tracking-[0.18em] text-[color:var(--color-accent)]">
              Tool 04
            </p>
            <h1 className="font-title mt-2 text-4xl tracking-[-0.05em] text-[color:var(--color-text)] sm:text-6xl">
              Gud For Us Prompt Race
            </h1>
            <p className="font-body mt-3 max-w-3xl text-sm leading-7 text-[color:var(--color-text-secondary)] sm:text-base">
              Upload one product image, run two prompt variants against the same
              Gemini model, and compare health score, compatibility, and
              ingredient-level output side by side.
            </p>
          </div>

          <Button
            className="hidden sm:inline-flex"
            onClick={() => window.history.back()}
            type="button"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <Card className="border-white/12 bg-[linear-gradient(180deg,rgba(36,33,36,0.92),rgba(20,18,23,0.98))]">
              <CardContent className="p-5 sm:p-6">
                <p className="font-accent text-sm uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                  Mock Profile
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {Object.entries(MOCK_PROFILE).map(([key, values]) => (
                    <div
                      key={key}
                      className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4"
                    >
                      <p className="font-accent text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                        {key.replace(/([A-Z])/g, " $1")}
                      </p>
                      <p className="font-body mt-2 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                        {values.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/12 bg-[linear-gradient(180deg,rgba(36,33,36,0.92),rgba(20,18,23,0.98))]">
              <CardContent className="p-5 sm:p-6">
                <p className="font-accent text-sm uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                  Product Image
                </p>
                <label className="mt-4 flex cursor-pointer items-center justify-center rounded-[24px] border border-dashed border-white/15 bg-white/[0.03] px-5 py-8 text-center transition hover:border-white/25 hover:bg-white/[0.05]">
                  <input
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      void handleImageChange(event.target.files?.[0] ?? null);
                    }}
                    type="file"
                  />
                  <div>
                    <Upload className="mx-auto h-6 w-6 text-[color:var(--color-accent)]" />
                    <p className="font-body mt-3 text-sm text-[color:var(--color-text)]">
                      {selectedFile
                        ? selectedFile.name
                        : "Upload product image"}
                    </p>
                  </div>
                </label>

                {imagePreviewUrl ? (
                  <div className="mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt="Product preview"
                      className="aspect-square w-full object-cover"
                      src={imagePreviewUrl}
                    />
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-white/12 bg-[linear-gradient(180deg,rgba(36,33,36,0.92),rgba(20,18,23,0.98))]">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-accent text-sm uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                    Prompt Inputs
                  </p>
                  <Button
                    disabled={!canRun || isRunning}
                    onClick={() => void handleRun()}
                    type="button"
                  >
                    {isRunning ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Run
                  </Button>
                </div>

                <div className="mt-4 grid gap-4">
                  <label className="block">
                    <span className="font-body mb-2 block text-sm text-[color:var(--color-text-secondary)]">
                      Prompt 1
                    </span>
                    <textarea
                      className="font-body min-h-56 w-full rounded-[24px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,0.04)] px-4 py-4 text-sm leading-7 text-[color:var(--color-text)] outline-none transition placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-primary)]"
                      onChange={(event) => setPromptOne(event.target.value)}
                      value={promptOne}
                    />
                  </label>
                  <label className="block">
                    <span className="font-body mb-2 block text-sm text-[color:var(--color-text-secondary)]">
                      Prompt 2 · Agent 1
                    </span>
                    <textarea
                      className="font-body min-h-56 w-full rounded-[24px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,0.04)] px-4 py-4 text-sm leading-7 text-[color:var(--color-text)] outline-none transition placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-primary)]"
                      onChange={(event) =>
                        setAgentOnePrompt(event.target.value)
                      }
                      value={agentOnePrompt}
                    />
                  </label>
                  <label className="block">
                    <span className="font-body mb-2 block text-sm text-[color:var(--color-text-secondary)]">
                      Prompt 2 · Agent 2
                    </span>
                    <textarea
                      className="font-body min-h-56 w-full rounded-[24px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,0.04)] px-4 py-4 text-sm leading-7 text-[color:var(--color-text)] outline-none transition placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-primary)]"
                      onChange={(event) =>
                        setAgentTwoPrompt(event.target.value)
                      }
                      value={agentTwoPrompt}
                    />
                  </label>
                </div>

                {errorMessage ? (
                  <div className="mt-4 rounded-2xl border border-[rgba(236,45,48,0.2)] bg-[rgba(236,45,48,0.1)] px-4 py-3 text-sm text-[#ffb8b8]">
                    {errorMessage}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-3">
              <AnalysisColumn
                analysis={promptOneResult?.analysis ?? null}
                usage={promptOneResult?.usage ?? null}
                title="Prompt 1 Result"
                statusLabel={promptOneStatus}
              />
              <AnalysisColumn
                analysis={promptTwoResult?.analysis ?? null}
                usage={combineUsage(
                  promptTwoResult?.agentOneUsage ?? null,
                  promptTwoResult?.agentTwoUsage ?? null,
                )}
                title="Prompt 2 Result"
                statusLabel={promptTwoStatus}
                selectedCategories={promptTwoResult?.agentOneResult.categories ?? []}
                costNote={
                  promptTwoResult?.agentOneUsage &&
                  promptTwoResult?.agentTwoUsage
                    ? `Agent 1 cost ${formatUsd(promptTwoResult.agentOneUsage.cost.total_usd)} · Agent 2 cost ${formatUsd(
                        promptTwoResult.agentTwoUsage.cost.total_usd,
                      )}${
                        promptTwoResult.agentOneResult.categories.length
                          ? ` · Categories: ${promptTwoResult.agentOneResult.categories.join(", ")}`
                          : ""
                      }`
                    : isRunning
                      ? "Agent 1 and Agent 2 run sequentially."
                      : null
                }
              />
              <AnalysisColumn
                analysis={supabaseResult?.analysis ?? null}
                usage={supabaseResult?.usage ?? null}
                title="Supabase Result"
                statusLabel={supabaseStatus}
              />
            </div>

            <Card className="border-white/12 bg-[linear-gradient(180deg,rgba(36,33,36,0.92),rgba(20,18,23,0.98))]">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-accent text-xs uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                      Prompt 2 · Agent 3
                    </p>
                    <h3 className="font-title mt-2 text-2xl tracking-[-0.04em] text-[color:var(--color-text)]">
                      Generated Product Image
                    </h3>
                    <p className="font-body mt-2 text-xs uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
                      {agentThreeStatus}
                    </p>
                  </div>
                  <div className="font-body rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-[color:var(--color-text-secondary)]">
                    Separate lane
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-white">
                  {agentThreeResult?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt="Generated product listing style"
                      className="aspect-square w-full object-contain"
                      src={`data:${agentThreeResult.image.mimeType};base64,${agentThreeResult.image.data}`}
                    />
                  ) : (
                    <div className="flex aspect-square items-center justify-center bg-[linear-gradient(180deg,#ffffff,#f4f4f4)] px-6 text-center text-sm text-slate-500">
                      Agent 3 will generate a centered, white-background product
                      image here.
                    </div>
                  )}
                </div>

                <div className="mt-5 rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-accent text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                      Agent 3 Tokens & Cost
                    </p>
                    <p className="font-body text-xs text-[color:var(--color-text-tertiary)]">
                      {agentThreeResult?.usage.model ?? "No model data"}
                    </p>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-black/15 px-3 py-3">
                      <p className="font-body text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                        Prompt
                      </p>
                      <p className="font-title mt-1 text-2xl tracking-[-0.03em] text-[color:var(--color-text)]">
                        {agentThreeResult?.usage.tokens.prompt ?? "N/A"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/15 px-3 py-3">
                      <p className="font-body text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                        Output
                      </p>
                      <p className="font-title mt-1 text-2xl tracking-[-0.03em] text-[color:var(--color-text)]">
                        {agentThreeResult?.usage.tokens.output ?? "N/A"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/15 px-3 py-3">
                      <p className="font-body text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                        Total
                      </p>
                      <p className="font-title mt-1 text-2xl tracking-[-0.03em] text-[color:var(--color-text)]">
                        {agentThreeResult?.usage.tokens.total ?? "N/A"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/15 px-3 py-3">
                      <p className="font-body text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                        Estimated Cost
                      </p>
                      <p className="font-title mt-1 text-2xl tracking-[-0.03em] text-[color:var(--color-text)]">
                        {agentThreeResult?.usage
                          ? formatUsd(agentThreeResult.usage.cost.total_usd)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[linear-gradient(180deg,rgba(16,25,38,0.9),rgba(20,18,23,0.96))]">
              <CardContent className="p-5">
                <p className="font-accent text-sm uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                  What You Can Compare
                </p>
                <div className="font-body mt-4 grid gap-3 text-sm leading-7 text-[color:var(--color-text-secondary)] sm:grid-cols-2">
                  <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    1. Product name and category detection
                  </p>
                  <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    2. Health score output quality
                  </p>
                  <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    3. Compatibility score and summary
                  </p>
                  <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    4. Ingredient extraction completeness
                  </p>
                  <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    5. Ingredient description depth
                  </p>
                  <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    6. Confidence and category stability
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-[color:var(--color-text-tertiary)]">
                  <Search className="h-4 w-4" />
                  Grounding is enabled for both prompts in this V1 comparison.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
