import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  generationRuns,
  ideaBatches,
  ideaItems,
  projectMedia,
  projects,
  slideMedia,
  slides,
  type GenerationStatus,
  type GenerationTrigger,
  type MediaKind,
  type SlideMediaRole,
} from "../db/schema.js";
import { createId } from "./ids.js";
import { utapi } from "./uploadthing-server.js";

export async function listProjects() {
  const rows = await db
    .select({
      id: projects.id,
      name: projects.name,
      about: projects.about,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .orderBy(desc(projects.updatedAt));

  return Promise.all(
    rows.map(async (project) => {
      const [assetCount, slideCount] = await Promise.all([
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(projectMedia)
          .where(and(eq(projectMedia.projectId, project.id), eq(projectMedia.kind, "asset"))),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(slides)
          .where(eq(slides.projectId, project.id)),
      ]);

      return {
        ...project,
        assetCount: assetCount[0]?.count ?? 0,
        slideCount: slideCount[0]?.count ?? 0,
      };
    }),
  );
}

export async function createProject(input: { name: string; about: string }) {
  const project = {
    id: createId("project"),
    name: input.name,
    about: input.about,
  };

  await db.insert(projects).values(project);

  return getProjectDetail(project.id);
}

export async function getProjectById(projectId: string) {
  const rows = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  return rows[0] ?? null;
}

export async function getProjectMedia(projectId: string) {
  return db.select().from(projectMedia).where(eq(projectMedia.projectId, projectId)).orderBy(desc(projectMedia.createdAt));
}

export async function getProjectDetail(projectId: string) {
  const project = await getProjectById(projectId);

  if (!project) {
    return null;
  }

  const [mediaRows, runRows, slideRows, batchRows] = await Promise.all([
    getProjectMedia(projectId),
    db.select().from(generationRuns).where(eq(generationRuns.projectId, projectId)).orderBy(desc(generationRuns.createdAt)),
    db.select().from(slides).where(eq(slides.projectId, projectId)).orderBy(asc(slides.createdAt)),
    db.select().from(ideaBatches).where(eq(ideaBatches.projectId, projectId)).orderBy(desc(ideaBatches.createdAt)),
  ]);

  const latestBatch = batchRows[0] ?? null;
  const latestIdeas = latestBatch
    ? await db.select().from(ideaItems).where(eq(ideaItems.batchId, latestBatch.id)).orderBy(asc(ideaItems.order))
    : [];

  return {
    project,
    media: mediaRows,
    assets: mediaRows.filter((item) => item.kind === "asset"),
    inspirations: mediaRows.filter((item) => item.kind === "inspiration"),
    generatedImages: mediaRows.filter((item) => item.kind === "generated_image"),
    slides: slideRows,
    generationRuns: runRows,
    latestIdeaBatch: latestBatch,
    latestIdeas,
  };
}

export async function createIdeaBatch(projectId: string, seed: string | null) {
  const batch = {
    id: createId("idea_batch"),
    projectId,
    seed,
    status: "completed" as const,
  };

  await db.insert(ideaBatches).values(batch);
  return batch;
}

export async function replaceIdeaItems(
  projectId: string,
  batchId: string,
  items: Array<{ title: string; prompt: string }>,
) {
  const values = items.map((item, index) => ({
    id: createId("idea"),
    batchId,
    projectId,
    title: item.title,
    prompt: item.prompt,
    order: index,
  }));

  await db.insert(ideaItems).values(values);
  return values;
}

export async function createGenerationRun(input: {
  projectId: string;
  trigger: GenerationTrigger;
  sourcePrompt: string;
  requestedOutputs: number;
  aspectRatio: string;
  referenceSlideId?: string | null;
}) {
  const run = {
    id: createId("run"),
    projectId: input.projectId,
    trigger: input.trigger,
    sourcePrompt: input.sourcePrompt,
    requestedOutputs: input.requestedOutputs,
    aspectRatio: input.aspectRatio,
    referenceSlideId: input.referenceSlideId ?? null,
    status: "queued" as const,
    error: null,
  };

  const slideValues = Array.from({ length: input.requestedOutputs }, (_, index) => ({
    id: createId("slide"),
    projectId: input.projectId,
    generationRunId: run.id,
    variantIndex: index,
    title: `Variant ${index + 1}`,
    prompt: input.sourcePrompt,
    aspectRatio: input.aspectRatio,
    status: "queued" as const,
    htmlDocument: "",
    referenceSlideId: input.referenceSlideId ?? null,
    error: null,
  }));

  await db.insert(generationRuns).values(run);
  await db.insert(slides).values(slideValues);

  return {
    run,
    slides: slideValues,
  };
}

export async function getGenerationRun(runId: string) {
  const runRows = await db.select().from(generationRuns).where(eq(generationRuns.id, runId)).limit(1);
  const run = runRows[0] ?? null;

  if (!run) {
    return null;
  }

  const runSlides = await db.select().from(slides).where(eq(slides.generationRunId, runId)).orderBy(asc(slides.variantIndex));

  return {
    run,
    slides: runSlides,
  };
}

export async function getSlideById(slideId: string) {
  const rows = await db.select().from(slides).where(eq(slides.id, slideId)).limit(1);
  return rows[0] ?? null;
}

export async function deleteSlideById(slideId: string) {
  const generatedMediaRows = await db
    .select({
      id: projectMedia.id,
      storageProvider: projectMedia.storageProvider,
      uploadthingKey: projectMedia.uploadthingKey,
    })
    .from(slideMedia)
    .innerJoin(projectMedia, eq(slideMedia.mediaId, projectMedia.id))
    .where(
      and(
        eq(slideMedia.slideId, slideId),
        eq(slideMedia.role, "generated_image"),
        eq(projectMedia.kind, "generated_image"),
      ),
    );

  const rows = await db.delete(slides).where(eq(slides.id, slideId)).returning();
  const removed = rows[0] ?? null;

  if (!removed) {
    return null;
  }

  for (const media of generatedMediaRows) {
    if (media.storageProvider === "uploadthing" && media.uploadthingKey) {
      await utapi.deleteFiles(media.uploadthingKey);
    }
  }

  const generatedMediaIds = [...new Set(generatedMediaRows.map((media) => media.id))];

  if (generatedMediaIds.length > 0) {
    await db.delete(projectMedia).where(inArray(projectMedia.id, generatedMediaIds));
  }

  return removed;
}

export async function updateGenerationRunStatus(runId: string, status: GenerationStatus, error?: string | null) {
  await db
    .update(generationRuns)
    .set({
      status,
      error: error ?? null,
      updatedAt: new Date(),
    })
    .where(eq(generationRuns.id, runId));
}

export async function updateSlide(input: {
  slideId: string;
  status: GenerationStatus;
  title?: string;
  htmlDocument?: string;
  error?: string | null;
}) {
  await db
    .update(slides)
    .set({
      status: input.status,
      title: input.title,
      htmlDocument: input.htmlDocument,
      error: input.error ?? null,
      updatedAt: new Date(),
    })
    .where(eq(slides.id, input.slideId));
}

export async function createProjectMedia(input: {
  projectId: string;
  kind: MediaKind;
  storageProvider: string;
  uploadthingKey?: string | null;
  url: string;
  name: string;
  mimeType?: string | null;
  width?: number | null;
  height?: number | null;
  sizeBytes?: number | null;
  sourceGenerationRunId?: string | null;
}) {
  const media = {
    id: createId("media"),
    projectId: input.projectId,
    kind: input.kind,
    storageProvider: input.storageProvider,
    uploadthingKey: input.uploadthingKey ?? null,
    url: input.url,
    name: input.name,
    mimeType: input.mimeType ?? null,
    width: input.width ?? null,
    height: input.height ?? null,
    sizeBytes: input.sizeBytes ?? null,
    sourceGenerationRunId: input.sourceGenerationRunId ?? null,
  };

  await db.insert(projectMedia).values(media);
  return media;
}

export async function attachMediaToSlide(slideId: string, attachments: Array<{ mediaId: string; role: SlideMediaRole }>) {
  if (attachments.length === 0) {
    return;
  }

  await db.insert(slideMedia).values(
    attachments.map((attachment) => ({
      id: createId("slide_media"),
      slideId,
      mediaId: attachment.mediaId,
      role: attachment.role,
    })),
  );
}

export async function getSlideReference(slideId: string | null | undefined) {
  if (!slideId) {
    return null;
  }

  return getSlideById(slideId);
}

export async function countProjectAssets(projectId: string) {
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(projectMedia)
    .where(and(eq(projectMedia.projectId, projectId), eq(projectMedia.kind, "asset")));

  return rows[0]?.count ?? 0;
}

export async function getMediaByIds(mediaIds: string[]) {
  if (mediaIds.length === 0) {
    return [];
  }

  return db.select().from(projectMedia).where(inArray(projectMedia.id, mediaIds));
}

export async function renameProjectMedia(input: {
  projectId: string;
  mediaId: string;
  name: string;
}) {
  const rows = await db
    .update(projectMedia)
    .set({
      name: input.name,
      updatedAt: new Date(),
    })
    .where(and(eq(projectMedia.projectId, input.projectId), eq(projectMedia.id, input.mediaId)))
    .returning();

  return rows[0] ?? null;
}

export async function deleteProjectMedia(input: { projectId: string; mediaId: string }) {
  const existingRows = await db
    .select()
    .from(projectMedia)
    .where(and(eq(projectMedia.projectId, input.projectId), eq(projectMedia.id, input.mediaId)))
    .limit(1);

  const media = existingRows[0] ?? null;

  if (!media) {
    return null;
  }

  if (media.storageProvider === "uploadthing" && media.uploadthingKey) {
    await utapi.deleteFiles(media.uploadthingKey);
  }

  const rows = await db
    .delete(projectMedia)
    .where(and(eq(projectMedia.projectId, input.projectId), eq(projectMedia.id, input.mediaId)))
    .returning();

  return rows[0] ?? null;
}

export async function deleteProject(projectId: string) {
  const rows = await db.delete(projects).where(eq(projects.id, projectId)).returning();
  return rows[0] ?? null;
}

export async function deleteIdeaItem(projectId: string, ideaId: string) {
  const rows = await db
    .delete(ideaItems)
    .where(and(eq(ideaItems.projectId, projectId), eq(ideaItems.id, ideaId)))
    .returning();

  return rows[0] ?? null;
}
