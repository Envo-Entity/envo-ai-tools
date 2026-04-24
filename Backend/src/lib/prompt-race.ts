import { z } from "zod";
import { GEMINI_IMAGE_MODEL, ai } from "./gemini.js";
import { loadCategoryDocs } from "./prompt-race-category-docs.js";

const PROMPT_RACE_MODEL = "gemini-3.1-flash-lite-preview";
const GEMINI_PRICING = {
  INPUT_PER_1M: 0.5,
  OUTPUT_PER_1M: 3.0,
  CACHED_PER_1M: 0.05,
};

const promptRaceAnalysisSchema = z.object({
  is_consumable: z.boolean(),
  confidence: z.number(),
  product_name: z.string().nullable(),
  product_subtitle: z.string().nullable().optional(),
  category: z.enum(["food", "beverage", "cosmetics", "other"]).nullable(),
  health_score: z.number().int().min(0).max(100).nullable(),
  planet_score: z.number().int().min(0).max(100).nullable(),
  reasoning: z.string().nullable().optional(),
  compatibility: z
    .object({
      score: z.number().int().min(0).max(100),
      label: z.enum(["low", "moderate", "high"]),
      summary: z.string(),
      likes: z.array(z.object({ text: z.string() })),
      concerns: z.array(z.object({ text: z.string() })),
    })
    .nullable(),
  ingredients: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        health_impact: z.enum(["good", "okay", "bad"]),
      }),
    )
    .nullable(),
});

export type PromptRaceAnalysis = z.infer<typeof promptRaceAnalysisSchema>;

export type PromptRaceUsage = {
  model: string;
  tokens: {
    prompt: number;
    cached: number;
    output: number;
    thoughts: number;
    total: number;
  };
  cost: {
    input_usd: number;
    cached_usd: number;
    output_usd: number;
    thoughts_usd: number;
    total_usd: number;
  };
};

export type PromptRaceGeneratedImage = {
  mimeType: string;
  data: string;
};

const userProfileSchema = z.object({
  allergies: z.array(z.string()),
  healthConditions: z.array(z.string()),
  dietaryPreferences: z.array(z.string()),
  skinConditions: z.array(z.string()),
});

export const promptOneRequestSchema = z.object({
  imageBase64: z.string().min(1),
  prompt: z.string().min(20),
  enableGrounding: z.boolean().default(true),
});

export const promptTwoAgentOneRequestSchema = z.object({
  imageBase64: z.string().min(1),
  prompt: z.string().min(20),
  enableGrounding: z.boolean().default(true),
});

export const promptTwoAgentTwoRequestSchema = z.object({
  imageBase64: z.string().min(1),
  prompt: z.string().min(20),
  extractedIngredients: z.string().min(1),
  agentOneProductName: z.string().nullable().optional(),
  agentOneCategories: z.array(z.string()).default([]),
  userProfile: userProfileSchema,
  enableGrounding: z.boolean().default(true),
});

export const promptTwoAgentThreeRequestSchema = z.object({
  imageBase64: z.string().min(1),
});

type GeminiUsageMetadata = {
  promptTokenCount?: number;
  cachedContentTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
  thoughtsTokenCount?: number;
};

type GeminiGenerateContentResponse = {
  text?: string;
  usageMetadata?: GeminiUsageMetadata;
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
};

function sanitizeBase64Image(imageBase64: string) {
  const trimmed = imageBase64.trim();
  const payload = trimmed.includes(",") ? trimmed.split(",").at(-1) ?? "" : trimmed;

  if (!payload) {
    throw new Error("Image data is missing.");
  }

  return payload;
}

function calculateUsage(usage: GeminiUsageMetadata | undefined): PromptRaceUsage {
  const prompt = usage?.promptTokenCount ?? 0;
  const cached = usage?.cachedContentTokenCount ?? 0;
  const output = usage?.candidatesTokenCount ?? 0;
  const thoughts = usage?.thoughtsTokenCount ?? 0;
  const total = usage?.totalTokenCount ?? prompt + cached + output + thoughts;

  const inputCost = (prompt / 1_000_000) * GEMINI_PRICING.INPUT_PER_1M;
  const cachedCost = (cached / 1_000_000) * GEMINI_PRICING.CACHED_PER_1M;
  const outputCost = (output / 1_000_000) * GEMINI_PRICING.OUTPUT_PER_1M;
  const thoughtsCost = (thoughts / 1_000_000) * GEMINI_PRICING.OUTPUT_PER_1M;

  return {
    model: PROMPT_RACE_MODEL,
    tokens: {
      prompt,
      cached,
      output,
      thoughts,
      total,
    },
    cost: {
      input_usd: Number(inputCost.toFixed(6)),
      cached_usd: Number(cachedCost.toFixed(6)),
      output_usd: Number(outputCost.toFixed(6)),
      thoughts_usd: Number(thoughtsCost.toFixed(6)),
      total_usd: Number((inputCost + cachedCost + outputCost + thoughtsCost).toFixed(6)),
    },
  };
}

async function runGeminiPrompt({
  prompt,
  imageBase64,
  enableGrounding,
  responseMimeType = "application/json",
  responseSchema,
  temperature = 1,
}: {
  prompt: string;
  imageBase64: string;
  enableGrounding: boolean;
  responseMimeType?: "application/json" | "text/plain";
  responseSchema?: Record<string, unknown>;
  temperature?: number;
}) {
  const response = (await ai.models.generateContent({
    model: PROMPT_RACE_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: sanitizeBase64Image(imageBase64),
            },
          },
        ],
      },
    ],
    config: {
      temperature,
      maxOutputTokens: 65536,
      candidateCount: 1,
      responseMimeType,
      ...(responseSchema ? { responseSchema } : {}),
      ...(enableGrounding
        ? {
            tools: [
              {
                googleSearch: {},
              },
            ],
          }
        : {}),
    },
  })) as GeminiGenerateContentResponse;

  const responseText =
    response.text || response.candidates?.[0]?.content?.parts?.find((part) => "text" in part)?.text || "";

  if (!responseText) {
    throw new Error("Gemini returned an empty response.");
  }

  return {
    text: responseText,
    usage: calculateUsage(response.usageMetadata),
  };
}

async function runGeminiTextPrompt({
  prompt,
  enableGrounding,
  responseSchema,
}: {
  prompt: string;
  enableGrounding: boolean;
  responseSchema?: Record<string, unknown>;
}) {
  const response = (await ai.models.generateContent({
    model: PROMPT_RACE_MODEL,
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    config: {
      temperature: 0.4,
      maxOutputTokens: 65536,
      candidateCount: 1,
      responseMimeType: "application/json",
      ...(responseSchema ? { responseSchema } : {}),
      ...(enableGrounding
        ? {
            tools: [
              {
                googleSearch: {},
              },
            ],
          }
        : {}),
    },
  })) as GeminiGenerateContentResponse;

  const responseText =
    response.text || response.candidates?.[0]?.content?.parts?.find((part) => "text" in part)?.text || "";

  if (!responseText) {
    throw new Error("Gemini returned an empty response.");
  }

  return {
    text: responseText,
    usage: calculateUsage(response.usageMetadata),
  };
}

function cleanJsonText(text: string) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "");
}

export async function analyzePromptOne(input: z.infer<typeof promptOneRequestSchema>) {
  const response = await runGeminiPrompt({
    prompt: input.prompt,
    imageBase64: input.imageBase64,
    enableGrounding: input.enableGrounding,
    responseMimeType: "application/json",
    responseSchema: {
      type: "object",
      properties: {
        is_consumable: { type: "boolean" },
        confidence: { type: "number" },
        product_name: { type: ["string", "null"] },
        product_subtitle: { type: ["string", "null"] },
        category: {
          type: ["string", "null"],
          enum: ["food", "beverage", "cosmetics", "other"],
        },
        health_score: { type: ["integer", "null"], minimum: 0, maximum: 100 },
        planet_score: { type: ["integer", "null"], minimum: 0, maximum: 100 },
        compatibility: {
          type: ["object", "null"],
          properties: {
            score: { type: "integer", minimum: 0, maximum: 100 },
            label: { type: "string", enum: ["low", "moderate", "high"] },
            summary: { type: "string" },
            likes: {
              type: "array",
              items: {
                type: "object",
                properties: { text: { type: "string" } },
                required: ["text"],
              },
            },
            concerns: {
              type: "array",
              items: {
                type: "object",
                properties: { text: { type: "string" } },
                required: ["text"],
              },
            },
          },
          required: ["score", "label", "summary", "likes", "concerns"],
        },
        ingredients: {
          type: ["array", "null"],
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              health_impact: {
                type: "string",
                enum: ["good", "okay", "bad"],
              },
            },
            required: ["title", "description", "health_impact"],
          },
        },
        reasoning: {
          type: ["string", "null"],
        },
      },
      required: [
        "is_consumable",
        "confidence",
        "product_name",
        "category",
        "health_score",
        "planet_score",
        "compatibility",
        "ingredients",
      ],
    },
  });

  return {
    analysis: promptRaceAnalysisSchema.parse(JSON.parse(cleanJsonText(response.text))),
    usage: response.usage,
  };
}

export async function analyzePromptTwoAgentOne(input: z.infer<typeof promptTwoAgentOneRequestSchema>) {
  const response = await runGeminiPrompt({
    prompt: input.prompt,
    imageBase64: input.imageBase64,
    enableGrounding: input.enableGrounding,
    responseMimeType: "application/json",
    temperature: 0,
    responseSchema: {
      type: "object",
      properties: {
        product_name: { type: ["string", "null"] },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
        },
        extracted_ingredients: { type: "string" },
      },
      required: ["product_name", "categories", "extracted_ingredients"],
    },
  });

  const parsed = z
    .object({
      product_name: z.string().nullable(),
      categories: z.array(z.string()),
      extracted_ingredients: z.string().min(1),
    })
    .parse(JSON.parse(cleanJsonText(response.text)));

  return {
    productName: parsed.product_name,
    categories: parsed.categories,
    extractedIngredients: parsed.extracted_ingredients.trim(),
    usage: response.usage,
  };
}

export async function analyzePromptTwoAgentTwo(input: z.infer<typeof promptTwoAgentTwoRequestSchema>) {
  const profile = input.userProfile;
  const userProfileBlock = [
    `Allergies: ${profile.allergies.join(", ") || "None"}`,
    `Health Conditions: ${profile.healthConditions.join(", ") || "None"}`,
    `Dietary Preferences: ${profile.dietaryPreferences.join(", ") || "None"}`,
    `Skin Conditions: ${profile.skinConditions.join(", ") || "None"}`,
  ].join("\n");
  const categoryDocs = await loadCategoryDocs(input.agentOneCategories);

  const finalPrompt = `${input.prompt}

AGENT 1 OUTPUT:
Product name: ${input.agentOneProductName ?? "Unknown"}
Categories: ${categoryDocs.categories.join(", ") || "None identified"}
${input.extractedIngredients}

USER HEALTH PROFILE:
${userProfileBlock}

---
${categoryDocs.combinedRules}
---

Return valid JSON with these fields only:
- is_consumable
- confidence
- product_name
- product_subtitle
- category
- health_score
- planet_score
- compatibility: { score, label, summary, likes: [{text}], concerns: [{text}] }
- ingredients: [{ title, description, health_impact }]

For ingredients, preserve the ingredient names from Agent 1 as closely as possible.
Do not include markdown.`;

  const response = await runGeminiTextPrompt({
    prompt: finalPrompt,
    enableGrounding: input.enableGrounding,
    responseSchema: {
      type: "object",
      properties: {
        is_consumable: { type: "boolean" },
        confidence: { type: "number" },
        product_name: { type: ["string", "null"] },
        product_subtitle: { type: ["string", "null"] },
        category: {
          type: ["string", "null"],
          enum: ["food", "beverage", "cosmetics", "other"],
        },
        health_score: { type: ["integer", "null"], minimum: 0, maximum: 100 },
        planet_score: { type: ["integer", "null"], minimum: 0, maximum: 100 },
        reasoning: {
          type: ["string", "null"],
        },
        compatibility: {
          type: ["object", "null"],
          properties: {
            score: { type: "integer", minimum: 0, maximum: 100 },
            label: { type: "string", enum: ["low", "moderate", "high"] },
            summary: { type: "string" },
            likes: {
              type: "array",
              items: {
                type: "object",
                properties: { text: { type: "string" } },
                required: ["text"],
              },
            },
            concerns: {
              type: "array",
              items: {
                type: "object",
                properties: { text: { type: "string" } },
                required: ["text"],
              },
            },
          },
          required: ["score", "label", "summary", "likes", "concerns"],
        },
        ingredients: {
          type: ["array", "null"],
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              health_impact: {
                type: "string",
                enum: ["good", "okay", "bad"],
              },
            },
            required: ["title", "description", "health_impact"],
          },
        },
      },
      required: [
        "is_consumable",
        "confidence",
        "product_name",
        "category",
        "health_score",
        "planet_score",
        "compatibility",
        "ingredients",
      ],
    },
  });

  return {
    analysis: promptRaceAnalysisSchema.parse(JSON.parse(cleanJsonText(response.text))),
    usage: response.usage,
  };
}

export async function analyzePromptTwoAgentThree(input: z.infer<typeof promptTwoAgentThreeRequestSchema>) {
  const response = (await ai.models.generateContent({
    model: GEMINI_IMAGE_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              "Create a professional square product photo of the exact same product shown in the input image. Keep the product centered, straightened, fully visible, cleanly lit, and isolated on a pure white background. Make it look like a polished ecommerce store listing image. No props, no shadows bleeding into the background, no visible environment, no extra text, no cropped edges.",
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: sanitizeBase64Image(input.imageBase64),
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K",
      },
    },
  })) as GeminiGenerateContentResponse & {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
          inlineData?: { mimeType?: string; data?: string };
        }>;
      };
    }>;
  };

  const parts = response.candidates?.[0]?.content?.parts as
    | Array<{ text?: string; inlineData?: { mimeType?: string; data?: string } }>
    | undefined;
  const imagePart = parts?.find((part) => part.inlineData?.data);

  if (!imagePart?.inlineData?.data) {
    throw new Error("Agent 3 did not return an image.");
  }

  return {
    image: {
      mimeType: imagePart.inlineData.mimeType ?? "image/png",
      data: imagePart.inlineData.data,
    } satisfies PromptRaceGeneratedImage,
    usage: calculateUsage(response.usageMetadata),
  };
}
