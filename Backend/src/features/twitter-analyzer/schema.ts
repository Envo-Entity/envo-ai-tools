import { z } from "zod";

export const analyzeRequestSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required.")
    .max(50, "Username is too long.")
    .regex(/^[A-Za-z0-9_]+$/, "Enter a valid Twitter username — letters, numbers, and underscores only."),
});

export const geminiDigestSchema = z.object({
  summary: z.string(),
  mainTopics: z.array(z.string()).min(1),
  writingStyle: z.string(),
  sentiment: z.enum(["positive", "neutral", "negative", "mixed"]),
  engagementInsight: z.string(),
  notableTweets: z.array(
    z.object({
      text: z.string(),
      reason: z.string(),
    }),
  ),
});

export const geminiResponseSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    mainTopics: { type: "array", items: { type: "string" } },
    writingStyle: { type: "string" },
    sentiment: { type: "string", enum: ["positive", "neutral", "negative", "mixed"] },
    engagementInsight: { type: "string" },
    notableTweets: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string" },
          reason: { type: "string" },
        },
        required: ["text", "reason"],
      },
    },
  },
  required: ["summary", "mainTopics", "writingStyle", "sentiment", "engagementInsight", "notableTweets"],
} as const;
