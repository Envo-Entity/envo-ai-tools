import { createUploadthing, createRouteHandler, type FileRouter } from "uploadthing/express";
import { z } from "zod";
import { env } from "./config/env.js";
import { countProjectAssets, getProjectById } from "./lib/projects.js";
import { persistUploadedProjectMedia } from "./lib/slide-generation.js";

const f = createUploadthing();

export const uploadRouter = {
  assetUploader: f(
    {
      image: {
        maxFileSize: "4MB",
        maxFileCount: 10,
      },
    },
    {
      awaitServerData: false,
    },
  )
    .input(
      z.object({
        projectId: z.string().min(1),
        kind: z.enum(["asset", "inspiration"]),
      }),
    )
    .middleware(async ({ input }) => {
      const project = await getProjectById(input.projectId);

      if (!project) {
        throw new Error("Project not found.");
      }

      if (input.kind === "asset") {
        const existingAssetCount = await countProjectAssets(input.projectId);

        if (existingAssetCount >= 10) {
          throw new Error("Project asset limit reached.");
        }
      }

      return {
        projectId: input.projectId,
        kind: input.kind,
      };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      await persistUploadedProjectMedia({
        projectId: metadata.projectId,
        kind: metadata.kind,
        key: file.key,
        url: file.ufsUrl,
        name: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });

      return {
        key: file.key,
        name: file.name,
        url: file.ufsUrl,
        kind: metadata.kind,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

export const uploadthingHandler = createRouteHandler({
  router: uploadRouter,
  config: {
    token: env.UPLOADTHING_TOKEN,
  },
});
