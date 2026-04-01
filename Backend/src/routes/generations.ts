import { Router } from "express";
import { requireAuth } from "../lib/api-auth.js";
import { getGenerationRun } from "../lib/projects.js";

const generationsRouter = Router();

generationsRouter.use(requireAuth);

generationsRouter.get("/:runId", async (req, res) => {
  const payload = await getGenerationRun(req.params.runId);

  if (!payload) {
    return res.status(404).json({
      error: "Generation run not found.",
    });
  }

  return res.json(payload);
});

export { generationsRouter };
