import { ThinkingLevel } from "@google/genai";
import { Router } from "express";
import { z } from "zod";
import { ai, GEMINI_TEXT_MODEL } from "../lib/gemini.js";

const chatRouter = Router();

const messageSchema = z.object({
  role: z.enum(["user", "model"]),
  text: z.string().min(1),
});

const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1),
});

chatRouter.post("/", async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured in Backend/.env.",
    });
  }

  const parsed = chatRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request body.",
      details: parsed.error.flatten(),
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: parsed.data.messages.map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      })),
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    return res.json({
      reply: response.text ?? "No response generated.",
    });
  } catch (error) {
    console.error("Gemini chat error", error);

    return res.status(500).json({
      error: "Failed to generate chat response.",
    });
  }
});

export { chatRouter };
