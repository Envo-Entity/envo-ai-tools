import { ThinkingLevel } from "@google/genai";
import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { generationRuns, projectMedia } from "../db/schema.js";
import { GEMINI_IMAGE_MODEL, GEMINI_TEXT_MODEL, ai } from "./gemini.js";
import {
  attachMediaToSlide,
  createIdeaBatch,
  createProjectMedia,
  getGenerationRun,
  getProjectById,
  getProjectDetail,
  getProjectMedia,
  getSlideReference,
  replaceIdeaItems,
  updateGenerationRunStatus,
  updateSlide,
} from "./projects.js";
import { validateSlideHtmlDocument } from "./slide-html.js";
import { UTFile, utapi } from "./uploadthing-server.js";

type IdeaResult = {
  title: string;
  prompt: string;
};

type PlannerImageTask = {
  prompt: string;
  filename: string;
  aspectRatio?: string;
  imageSize?: "1K" | "2K" | "4K";
};

type PlannerResult = {
  title: string;
  designBrief: string;
  htmlInstructions: string[];
  imageTasks: PlannerImageTask[];
};

const ideaSchema = {
  type: "object",
  properties: {
    ideas: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          prompt: { type: "string" },
        },
        required: ["title", "prompt"],
      },
    },
  },
  required: ["ideas"],
};

const plannerSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    designBrief: { type: "string" },
    htmlInstructions: {
      type: "array",
      items: { type: "string" },
    },
    imageTasks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          prompt: { type: "string" },
          filename: { type: "string" },
          aspectRatio: { type: "string" },
          imageSize: { type: "string", enum: ["1K", "2K", "4K"] },
        },
        required: ["prompt", "filename"],
      },
    },
  },
  required: ["title", "designBrief", "htmlInstructions", "imageTasks"],
};

function parseJsonResponse<T>(raw: string | undefined | null): T {
  if (!raw) {
    throw new Error("Model returned an empty response.");
  }

  return JSON.parse(raw) as T;
}

function mediaContextLine(items: Array<{ kind: string; name: string; url: string }>) {
  if (items.length === 0) {
    return "None.";
  }

  return items.map((item) => `- [${item.kind}] ${item.name}: ${item.url}`).join("\n");
}

function buildProjectContext(project: { name: string; about: string }, media: Array<{ kind: string; name: string; url: string }>) {
  return [
    `Project name: ${project.name}`,
    `Project about: ${project.about}`,
    "Available project media:",
    mediaContextLine(media),
  ].join("\n");
}

async function generateStructuredJson<T>(input: {
  prompt: string;
  schema: unknown;
  thinkingLevel: ThinkingLevel;
}) {
  const response = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: input.prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: input.schema,
      thinkingConfig: {
        thinkingLevel: input.thinkingLevel,
      },
    },
  });

  return parseJsonResponse<T>(response.text);
}

export async function generateProjectIdeas(projectId: string, seed?: string) {
  const detail = await getProjectDetail(projectId);

  if (!detail) {
    throw new Error("Project not found.");
  }

  const projectContext = buildProjectContext(
    detail.project,
    detail.media.filter((item) => item.kind !== "generated_image"),
  );

  const prompt = [
    "You are creating slide-generation ideas for a design-forward AI slides tool.",
    "Return exactly 5 distinct ideas. Each idea must be specific enough to use directly for slide generation.",
    "Use the project context, assets, and inspirations to shape the ideas.",
    seed ? `Seed direction: ${seed}` : "Seed direction: none provided.",
    projectContext,
    "Each prompt should describe a single high-quality slide variant, not a deck.",
  ].join("\n\n");

  const result = await generateStructuredJson<{ ideas: IdeaResult[] }>({
    prompt,
    schema: ideaSchema,
    thinkingLevel: ThinkingLevel.MEDIUM,
  });

  const batch = await createIdeaBatch(projectId, seed ?? null);
  const items = await replaceIdeaItems(projectId, batch.id, result.ideas.slice(0, 5));

  return {
    batch,
    ideas: items,
  };
}

async function planSlideVariant(input: {
  project: { name: string; about: string };
  media: Array<{ kind: string; name: string; url: string }>;
  prompt: string;
  aspectRatio: string;
  referenceHtml?: string | null;
}) {
  const plannerPrompt = [
    "You are planning one premium HTML slide variant for a slide generation system.",
    "Decide whether custom AI-generated images are needed. Only request new images when they are necessary and existing project media will not be enough.",
    "When an image is needed, add an imageTasks item with a descriptive prompt and filename.",
    "When an image is not needed, return an empty imageTasks array.",
    `Target aspect ratio: ${input.aspectRatio}`,
    `User prompt: ${input.prompt}`,
    buildProjectContext(input.project, input.media),
    input.referenceHtml
      ? `Reference slide HTML follows. Use it for continuity, but do not copy it verbatim.\n${input.referenceHtml}`
      : "No reference slide provided.",
  ].join("\n\n");

  return generateStructuredJson<PlannerResult>({
    prompt: plannerPrompt,
    schema: plannerSchema,
    thinkingLevel: ThinkingLevel.HIGH,
  });
}

async function generateImagesForVariant(input: {
  tasks: PlannerImageTask[];
  runId: string;
  projectId: string;
  fallbackAspectRatio: string;
}) {
  const uploadedMedia = await Promise.all(
    input.tasks.map(async (task, index) => {
      const response = await ai.models.generateContent({
        model: GEMINI_IMAGE_MODEL,
        contents: task.prompt,
        config: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: {
            aspectRatio: task.aspectRatio ?? input.fallbackAspectRatio,
            imageSize: task.imageSize ?? "2K",
          },
        },
      });

      const imagePart = response.candidates?.[0]?.content?.parts?.find((part) => part.inlineData);

      if (!imagePart?.inlineData?.data) {
        throw new Error(`Image generation did not return image data for task ${index + 1}.`);
      }

      const mimeType = imagePart.inlineData.mimeType ?? "image/png";
      const buffer = Buffer.from(imagePart.inlineData.data, "base64");
      const file = new UTFile([buffer], task.filename, {
        type: mimeType,
      });
      const upload = await utapi.uploadFiles(file);

      if (upload.error || !upload.data) {
        throw new Error(upload.error?.message ?? "Failed to upload generated image to UploadThing.");
      }

      return createProjectMedia({
        projectId: input.projectId,
        kind: "generated_image",
        storageProvider: "uploadthing",
        uploadthingKey: upload.data.key,
        url: upload.data.ufsUrl,
        name: upload.data.name,
        mimeType: upload.data.type,
        sizeBytes: upload.data.size,
        sourceGenerationRunId: input.runId,
      });
    }),
  );

  return uploadedMedia;
}

async function generateSlideHtml(input: {
  project: { name: string; about: string };
  prompt: string;
  aspectRatio: string;
  planner: PlannerResult;
  media: Array<{ kind: string; name: string; url: string }>;
  generatedImages: Array<{ name: string; url: string }>;
  referenceHtml?: string | null;
}) {
  const htmlPrompt = [
    "Generate one complete HTML document for a premium AI-generated slide.",
    "The slide must include a single root element with data-slide-root=\"true\".",
    "That root element must enforce the requested aspect ratio and include overflow: hidden.",
    "Do not use px units anywhere in HTML, CSS, inline styles, or JavaScript.",
    "Use percentages, flex, grid, aspect-ratio, rem, vw/vh, cqw/cqh, and clamp without px.",
    "Google Fonts links are allowed. Tailwind CDN is allowed.",
    "The slide should feel polished, intentional, and visually strong.",
    `Target aspect ratio: ${input.aspectRatio}`,
    `User prompt: ${input.prompt}`,
    `Planner title: ${input.planner.title}`,
    `Design brief: ${input.planner.designBrief}`,
    `HTML instructions:\n${input.planner.htmlInstructions.map((instruction) => `- ${instruction}`).join("\n")}`,
    buildProjectContext(input.project, input.media),
    input.generatedImages.length
      ? `Generated images for this slide:\n${input.generatedImages.map((image) => `- ${image.name}: ${image.url}`).join("\n")}`
      : "Generated images for this slide: none.",
    input.referenceHtml
      ? `Reference slide HTML follows. Keep continuity where useful, but create a distinct result.\n${input.referenceHtml}`
      : "No reference slide provided.",
    "Return HTML only. No markdown fences. No explanation.",
  ].join("\n\n");

  const response = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: htmlPrompt,
    config: {
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH,
      },
    },
  });

  const htmlDocument = response.text ?? "";
  validateSlideHtmlDocument(htmlDocument);
  return htmlDocument;
}

async function processSlideVariant(input: {
  runId: string;
  slideId: string;
  projectId: string;
  sourcePrompt: string;
  aspectRatio: string;
  referenceHtml?: string | null;
}) {
  const detail = await getProjectDetail(input.projectId);

  if (!detail) {
    throw new Error("Project not found while processing slide.");
  }

  await updateSlide({
    slideId: input.slideId,
    status: "planning",
  });

  const planner = await planSlideVariant({
    project: detail.project,
    media: detail.media,
    prompt: input.sourcePrompt,
    aspectRatio: input.aspectRatio,
    referenceHtml: input.referenceHtml,
  });

  let generatedImages: Awaited<ReturnType<typeof generateImagesForVariant>> = [];

  if (planner.imageTasks.length > 0) {
    await updateGenerationRunStatus(input.runId, "generating_images");
    await updateSlide({
      slideId: input.slideId,
      status: "generating_images",
    });

    generatedImages = await generateImagesForVariant({
      tasks: planner.imageTasks,
      runId: input.runId,
      projectId: input.projectId,
      fallbackAspectRatio: input.aspectRatio,
    });
  }

  if (generatedImages.length > 0) {
    await updateGenerationRunStatus(input.runId, "uploading_images");
    await updateSlide({
      slideId: input.slideId,
      status: "uploading_images",
    });
  }

  await updateGenerationRunStatus(input.runId, "generating_html");
  await updateSlide({
    slideId: input.slideId,
    status: "generating_html",
  });

  const htmlDocument = await generateSlideHtml({
    project: detail.project,
    prompt: input.sourcePrompt,
    aspectRatio: input.aspectRatio,
    planner,
    media: detail.media,
    generatedImages,
    referenceHtml: input.referenceHtml,
  });

  await updateSlide({
    slideId: input.slideId,
    status: "completed",
    title: planner.title,
    htmlDocument,
  });

  await attachMediaToSlide(input.slideId, [
    ...detail.assets.map((media) => ({ mediaId: media.id, role: "asset" as const })),
    ...detail.inspirations.map((media) => ({ mediaId: media.id, role: "inspiration" as const })),
    ...generatedImages.map((media) => ({ mediaId: media.id, role: "generated_image" as const })),
  ]);
}

export async function processGenerationRun(runId: string) {
  const payload = await getGenerationRun(runId);

  if (!payload) {
    throw new Error("Generation run not found.");
  }

  const referenceSlide = await getSlideReference(payload.run.referenceSlideId);

  await updateGenerationRunStatus(runId, "planning");

  const results = await Promise.allSettled(
    payload.slides.map(async (slide) => {
      try {
        await processSlideVariant({
          runId,
          slideId: slide.id,
          projectId: slide.projectId,
          sourcePrompt: slide.prompt,
          aspectRatio: slide.aspectRatio,
          referenceHtml: referenceSlide?.htmlDocument ?? null,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown slide generation failure.";
        await updateSlide({
          slideId: slide.id,
          status: "failed",
          error: message,
        });
        throw error;
      }
    }),
  );

  const failed = results.filter((result) => result.status === "rejected");

  if (failed.length === results.length) {
    await updateGenerationRunStatus(runId, "failed", "All slide variants failed.");
    return;
  }

  await updateGenerationRunStatus(
    runId,
    "completed",
    failed.length > 0 ? `${failed.length} variant(s) failed.` : null,
  );
}

export async function enqueueGenerationRun(runId: string) {
  queueMicrotask(() => {
    void processGenerationRun(runId).catch(async (error) => {
      const message = error instanceof Error ? error.message : "Generation run failed.";
      await updateGenerationRunStatus(runId, "failed", message);
    });
  });
}

export async function persistUploadedProjectMedia(input: {
  projectId: string;
  kind: "asset" | "inspiration";
  key: string;
  url: string;
  name: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
}) {
  const existing = await db
    .select()
    .from(projectMedia)
    .where(and(eq(projectMedia.projectId, input.projectId), eq(projectMedia.uploadthingKey, input.key)))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  return createProjectMedia({
    projectId: input.projectId,
    kind: input.kind,
    storageProvider: "uploadthing",
    uploadthingKey: input.key,
    url: input.url,
    name: input.name,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
  });
}
