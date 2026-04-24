import { Router } from "express";
import { requireAuth } from "../lib/api-auth.js";
import {
  analyzePromptOne,
  analyzePromptTwoAgentOne,
  analyzePromptTwoAgentTwo,
  analyzePromptTwoAgentThree,
  promptOneRequestSchema,
  promptTwoAgentOneRequestSchema,
  promptTwoAgentTwoRequestSchema,
  promptTwoAgentThreeRequestSchema,
} from "../lib/prompt-race.js";

const promptRaceRouter = Router();

promptRaceRouter.use(requireAuth);

promptRaceRouter.post("/prompt-one", async (req, res) => {
  const parsed = promptOneRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request body.",
      details: parsed.error.flatten(),
    });
  }

  try {
    const result = await analyzePromptOne(parsed.data);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to analyze product image.",
    });
  }
});

promptRaceRouter.post("/prompt-two/agent-one", async (req, res) => {
  const parsed = promptTwoAgentOneRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request body.",
      details: parsed.error.flatten(),
    });
  }

  try {
    const result = await analyzePromptTwoAgentOne(parsed.data);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to run prompt two agent one.",
    });
  }
});

promptRaceRouter.post("/prompt-two/agent-two", async (req, res) => {
  const parsed = promptTwoAgentTwoRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request body.",
      details: parsed.error.flatten(),
    });
  }

  try {
    const result = await analyzePromptTwoAgentTwo(parsed.data);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to run prompt two agent two.",
    });
  }
});

promptRaceRouter.post("/prompt-two/agent-three", async (req, res) => {
  const parsed = promptTwoAgentThreeRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request body.",
      details: parsed.error.flatten(),
    });
  }

  try {
    const result = await analyzePromptTwoAgentThree(parsed.data);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to run prompt two agent three.",
    });
  }
});

export { promptRaceRouter };
