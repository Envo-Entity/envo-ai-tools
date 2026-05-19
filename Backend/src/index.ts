import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { chatRouter } from "./routes/chat.js";
import { authRouter } from "./routes/auth.js";
import { generationsRouter } from "./routes/generations.js";
import { projectsRouter } from "./routes/projects.js";
import { slidesRouter } from "./routes/slides.js";
import { facebookAdsRouter } from "./routes/facebook-ads.js";
import { promptRaceRouter } from "./routes/prompt-race.js";
import { instagramTranscriberRouter } from "./routes/instagram-transcriber.js";
import { twitterAnalyzerRouter } from "./features/twitter-analyzer/router.js";
import { uploadthingHandler } from "./uploadthing.js";
import { runFacebookAdsHealthCheck } from "./lib/facebook-ads.js";

const app = express();
const allowedOrigins = new Set([
  env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
]);

function isAllowedOrigin(origin?: string) {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.has(origin)) {
    return true;
  }

  try {
    const parsed = new URL(origin);
    return ["localhost", "127.0.0.1"].includes(parsed.hostname) && /^3\d{3}$/.test(parsed.port);
  } catch {
    return false;
  }
}

app.use((_, res, next) => {
  res.header("Vary", "Origin");
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "35mb" }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "ENVO AI TOOLS Backend",
  });
});

app.use("/api/uploadthing", uploadthingHandler);
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/generations", generationsRouter);
app.use("/api/slides", slidesRouter);
app.use("/api/facebook-ads", facebookAdsRouter);
app.use("/api/prompt-race", promptRaceRouter);
app.use("/api/instagram-transcriber", instagramTranscriberRouter);
app.use("/api/twitter-analyzer", twitterAnalyzerRouter);

app.listen(env.PORT, () => {
  console.log(`Backend running on http://localhost:${env.PORT}`);
  void runFacebookAdsHealthCheck();
});
