import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("DATABASE_URL is not set yet. Drizzle is configured but not ready to connect.");
}

const sql = neon(databaseUrl ?? "");

export const db = drizzle({ client: sql });
