import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { chatRouter } from "./routes/chat.js";
import { authRouter } from "./routes/auth.js";

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

app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);

app.listen(env.PORT, () => {
  console.log(`Backend running on http://localhost:${env.PORT}`);
});
