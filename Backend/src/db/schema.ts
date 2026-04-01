// Add Drizzle table definitions here as persistence is implemented.
import { index, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const mediaKindEnum = pgEnum("media_kind", ["asset", "inspiration", "generated_image"]);
export const ideaBatchStatusEnum = pgEnum("idea_batch_status", ["completed", "failed"]);
export const generationTriggerEnum = pgEnum("generation_trigger", ["prompt", "idea", "reference"]);
export const generationStatusEnum = pgEnum("generation_status", [
  "queued",
  "planning",
  "generating_images",
  "uploading_images",
  "generating_html",
  "completed",
  "failed",
]);
export const slideMediaRoleEnum = pgEnum("slide_media_role", ["asset", "inspiration", "generated_image"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  about: text("about").notNull(),
  ...timestamps,
});

export const projectMedia = pgTable(
  "project_media",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    kind: mediaKindEnum("kind").notNull(),
    storageProvider: text("storage_provider").notNull(),
    uploadthingKey: text("uploadthing_key"),
    url: text("url").notNull(),
    name: text("name").notNull(),
    mimeType: text("mime_type"),
    width: integer("width"),
    height: integer("height"),
    sizeBytes: integer("size_bytes"),
    sourceGenerationRunId: text("source_generation_run_id"),
    ...timestamps,
  },
  (table) => ({
    projectIdx: index("project_media_project_idx").on(table.projectId),
    kindIdx: index("project_media_kind_idx").on(table.kind),
  }),
);

export const ideaBatches = pgTable(
  "idea_batches",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    seed: text("seed"),
    status: ideaBatchStatusEnum("status").notNull().default("completed"),
    ...timestamps,
  },
  (table) => ({
    projectIdx: index("idea_batches_project_idx").on(table.projectId),
  }),
);

export const ideaItems = pgTable(
  "idea_items",
  {
    id: text("id").primaryKey(),
    batchId: text("batch_id")
      .notNull()
      .references(() => ideaBatches.id, { onDelete: "cascade" }),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    prompt: text("prompt").notNull(),
    order: integer("order").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    projectIdx: index("idea_items_project_idx").on(table.projectId),
    batchIdx: index("idea_items_batch_idx").on(table.batchId),
  }),
);

export const generationRuns = pgTable(
  "generation_runs",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    trigger: generationTriggerEnum("trigger").notNull(),
    sourcePrompt: text("source_prompt").notNull(),
    requestedOutputs: integer("requested_outputs").notNull(),
    aspectRatio: text("aspect_ratio").notNull(),
    referenceSlideId: text("reference_slide_id"),
    status: generationStatusEnum("status").notNull().default("queued"),
    error: text("error"),
    ...timestamps,
  },
  (table) => ({
    projectIdx: index("generation_runs_project_idx").on(table.projectId),
    statusIdx: index("generation_runs_status_idx").on(table.status),
  }),
);

export const slides = pgTable(
  "slides",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    generationRunId: text("generation_run_id")
      .notNull()
      .references(() => generationRuns.id, { onDelete: "cascade" }),
    variantIndex: integer("variant_index").notNull(),
    title: text("title").notNull(),
    prompt: text("prompt").notNull(),
    aspectRatio: text("aspect_ratio").notNull(),
    status: generationStatusEnum("status").notNull().default("queued"),
    htmlDocument: text("html_document").notNull().default(""),
    referenceSlideId: text("reference_slide_id"),
    error: text("error"),
    ...timestamps,
  },
  (table) => ({
    projectIdx: index("slides_project_idx").on(table.projectId),
    runIdx: index("slides_generation_run_idx").on(table.generationRunId),
    statusIdx: index("slides_status_idx").on(table.status),
  }),
);

export const slideMedia = pgTable(
  "slide_media",
  {
    id: text("id").primaryKey(),
    slideId: text("slide_id")
      .notNull()
      .references(() => slides.id, { onDelete: "cascade" }),
    mediaId: text("media_id")
      .notNull()
      .references(() => projectMedia.id, { onDelete: "cascade" }),
    role: slideMediaRoleEnum("role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slideIdx: index("slide_media_slide_idx").on(table.slideId),
    mediaIdx: index("slide_media_media_idx").on(table.mediaId),
  }),
);

export type MediaKind = (typeof mediaKindEnum.enumValues)[number];
export type GenerationStatus = (typeof generationStatusEnum.enumValues)[number];
export type GenerationTrigger = (typeof generationTriggerEnum.enumValues)[number];
export type SlideMediaRole = (typeof slideMediaRoleEnum.enumValues)[number];
