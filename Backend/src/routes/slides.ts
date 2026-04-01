import { Router } from "express";
import { requireAuth } from "../lib/api-auth.js";
import { getSlideById } from "../lib/projects.js";
import { createSlideDownloadFilename } from "../lib/slide-html.js";
import { renderSlideToPng } from "../lib/slide-renderer.js";

const slidesRouter = Router();

slidesRouter.use(requireAuth);

slidesRouter.get("/:slideId", async (req, res) => {
  const slide = await getSlideById(req.params.slideId);

  if (!slide) {
    return res.status(404).json({
      error: "Slide not found.",
    });
  }

  return res.json({ slide });
});

slidesRouter.get("/:slideId/download", async (req, res) => {
  const slide = await getSlideById(req.params.slideId);

  if (!slide) {
    return res.status(404).json({
      error: "Slide not found.",
    });
  }

  if (!slide.htmlDocument) {
    return res.status(409).json({
      error: "Slide is not ready to download yet.",
    });
  }

  try {
    const png = await renderSlideToPng({
      htmlDocument: slide.htmlDocument,
      aspectRatio: slide.aspectRatio,
    });

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", `attachment; filename="${createSlideDownloadFilename(slide.title)}"`);
    return res.send(png);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to render slide download.",
    });
  }
});

export { slidesRouter };
