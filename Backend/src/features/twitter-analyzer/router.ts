import { Router } from "express";
import { analyzeRequestSchema } from "./schema.js";
import { analyzeTwitterTimeline } from "./service.js";

const twitterAnalyzerRouter = Router();

twitterAnalyzerRouter.post("/analyze", async (req, res) => {
  const parsed = analyzeRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    const message =
      parsed.error.flatten().fieldErrors.username?.[0] ?? "Invalid request body.";
    return res.status(400).json({ error: message });
  }

  try {
    const result = await analyzeTwitterTimeline(parsed.data.username);
    return res.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed. Please try again.";
    return res.status(500).json({ error: message });
  }
});

export { twitterAnalyzerRouter };
