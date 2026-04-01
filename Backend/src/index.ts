import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { chatRouter } from "./routes/chat.js";
import { authRouter } from "./routes/auth.js";
import { generationsRouter } from "./routes/generations.js";
import { projectsRouter } from "./routes/projects.js";
import { slidesRouter } from "./routes/slides.js";
import { uploadthingHandler } from "./uploadthing.js";

const app = express();

app.use((_, res, next) => {
  res.header("Vary", "Origin");
  next();
});

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());

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

app.listen(env.PORT, () => {
  console.log(`Backend running on http://localhost:${env.PORT}`);
});
