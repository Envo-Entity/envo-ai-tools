import { createUploadthing, createRouteHandler, type FileRouter } from "uploadthing/express";
import { env } from "./config/env.js";
import { hasValidSession } from "./lib/auth.js";

const f = createUploadthing();

export const uploadRouter = {
  assetUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 8,
    },
  })
    .middleware(({ req }) => {
      if (!hasValidSession(req)) {
        throw new Error("Unauthorized");
      }

      return {
        uploadedBy: "authenticated-user",
      };
    })
    .onUploadComplete(({ file, metadata }) => {
      return {
        name: file.name,
        url: file.ufsUrl,
        uploadedBy: metadata.uploadedBy,
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
