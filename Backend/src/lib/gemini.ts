import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

export const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

export const GEMINI_TEXT_MODEL = env.GEMINI_TEXT_MODEL;
export const GEMINI_IMAGE_MODEL = env.GEMINI_IMAGE_MODEL;
