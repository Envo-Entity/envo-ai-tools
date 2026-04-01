import { genUploader } from "uploadthing/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const uploadthingClient = genUploader({
  url: `${API_URL}/api/uploadthing`,
});
