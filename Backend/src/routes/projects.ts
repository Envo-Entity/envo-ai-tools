import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../lib/api-auth.js";
import { enqueueGenerationRun, generateProjectIdeas } from "../lib/slide-generation.js";
import {
  countProjectAssets,
  createGenerationRun,
  createProject,
  getProjectById,
  getProjectDetail,
  getProjectMedia,
  listProjects,
} from "../lib/projects.js";

const createProjectSchema = z.object({
  name: z.string().trim().min(1),
  about: z.string().trim().min(1),
});

const generateIdeasSchema = z.object({
  seed: z.string().trim().optional(),
});

const createGenerationSchema = z.object({
  prompt: z.string().trim().min(1),
  requestedOutputs: z.coerce.number().int().min(1).max(10),
  aspectRatio: z.enum(["9:16", "16:9", "1:1", "4:5", "3:4", "4:3"]),
  referenceSlideId: z.string().trim().optional().nullable(),
  trigger: z.enum(["prompt", "idea", "reference"]).optional(),
});

const projectsRouter = Router();

projectsRouter.use(requireAuth);

projectsRouter.get("/", async (_req, res) => {
  const projects = await listProjects();
  return res.json({ projects });
});

projectsRouter.post("/", async (req, res) => {
  const parsed = createProjectSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Project name and about are required.",
      details: parsed.error.flatten(),
    });
  }

  const result = await createProject(parsed.data);
  return res.status(201).json(result);
});

projectsRouter.get("/:projectId", async (req, res) => {
  const detail = await getProjectDetail(req.params.projectId);

  if (!detail) {
    return res.status(404).json({
      error: "Project not found.",
    });
  }

  return res.json(detail);
});

projectsRouter.get("/:projectId/media", async (req, res) => {
  const project = await getProjectById(req.params.projectId);

  if (!project) {
    return res.status(404).json({
      error: "Project not found.",
    });
  }

  const media = await getProjectMedia(project.id);
  return res.json({ media });
});

projectsRouter.post("/:projectId/ideas", async (req, res) => {
  const project = await getProjectById(req.params.projectId);

  if (!project) {
    return res.status(404).json({
      error: "Project not found.",
    });
  }

  const parsed = generateIdeasSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid ideas request.",
      details: parsed.error.flatten(),
    });
  }

  try {
    const result = await generateProjectIdeas(project.id, parsed.data.seed);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to generate ideas.",
    });
  }
});

projectsRouter.post("/:projectId/generations", async (req, res) => {
  const project = await getProjectById(req.params.projectId);

  if (!project) {
    return res.status(404).json({
      error: "Project not found.",
    });
  }

  const parsed = createGenerationSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid generation request.",
      details: parsed.error.flatten(),
    });
  }

  try {
    const { requestedOutputs, trigger, prompt, aspectRatio, referenceSlideId } = parsed.data;
    const generation = await createGenerationRun({
      projectId: project.id,
      trigger: referenceSlideId ? "reference" : (trigger ?? "prompt"),
      sourcePrompt: prompt,
      requestedOutputs,
      aspectRatio,
      referenceSlideId,
    });

    void enqueueGenerationRun(generation.run.id);

    return res.status(202).json(generation);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to create generation run.",
    });
  }
});

projectsRouter.get("/:projectId/assets/capacity", async (req, res) => {
  const project = await getProjectById(req.params.projectId);

  if (!project) {
    return res.status(404).json({
      error: "Project not found.",
    });
  }

  const count = await countProjectAssets(project.id);
  return res.json({
    count,
    remaining: Math.max(0, 10 - count),
    max: 10,
  });
});

export { projectsRouter };
