import { config } from "dotenv";
import { z } from "zod";

config({ path: ".env" });

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1).optional(),
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_TEXT_MODEL: z.string().min(1).default("gemini-3.1-pro-preview"),
  GEMINI_IMAGE_MODEL: z.string().min(1).default("gemini-3.1-flash-image-preview"),
  SITE_PASSWORD: z.string().length(4).optional(),
  AUTH_COOKIE_SECRET: z.string().min(16).optional(),
  UPLOADTHING_TOKEN: z.string().min(1).optional(),
});

export const env = envSchema.parse(process.env);
