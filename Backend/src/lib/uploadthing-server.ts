import { UTApi, UTFile } from "uploadthing/server";
import { env } from "../config/env.js";

export const utapi = new UTApi({
  token: env.UPLOADTHING_TOKEN,
});

export { UTFile };
