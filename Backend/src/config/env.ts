import { config } from "dotenv";
import { z } from "zod";

config({ path: ".env" });

const booleanish = z.preprocess((value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }
  }

  return value;
}, z.boolean());

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1).optional(),
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_TEXT_MODEL: z.string().min(1).default("gemini-3.1-pro-preview"),
  GEMINI_IMAGE_MODEL: z.string().min(1).default("gemini-3.1-flash-image-preview"),
  META_APP_ID: z.string().min(1).optional(),
  META_APP_SECRET: z.string().min(1).optional(),
  META_ACCESS_TOKEN: z.string().min(1).optional(),
  META_AD_ACCOUNT_ID: z.string().regex(/^(act_)?\d+$/).optional(),
  META_PAGE_ID: z.string().min(1).optional(),
  META_DSA_BENEFICIARY: z.string().trim().min(1).optional(),
  META_DSA_PAYOR: z.string().trim().min(1).optional(),
  SITE_PASSWORD: z.string().length(4).optional(),
  AUTH_COOKIE_SECRET: z.string().min(16).optional(),
  AUTH_COOKIE_DOMAIN: z.string().trim().min(1).optional(),
  AUTH_COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
  AUTH_COOKIE_SECURE: booleanish.default(true),
  UPLOADTHING_TOKEN: z.string().min(1).optional(),
});

export const env = envSchema.parse(process.env);
