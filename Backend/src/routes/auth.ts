import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import {
  clearSessionCookie,
  hasValidSession,
  isAuthConfigured,
  setSessionCookie,
} from "../lib/auth.js";

const authRouter = Router();

const unlockSchema = z.object({
  password: z.string().length(4),
});

authRouter.get("/session", (req, res) => {
  return res.json({
    authenticated: hasValidSession(req),
  });
});

authRouter.post("/unlock", (req, res) => {
  if (!isAuthConfigured()) {
    return res.status(500).json({
      error: "Auth is not configured on the backend.",
    });
  }

  const parsed = unlockSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Password must be a 4-digit code.",
    });
  }

  if (parsed.data.password !== env.SITE_PASSWORD) {
    clearSessionCookie(res);
    return res.status(401).json({
      error: "Incorrect password.",
    });
  }

  setSessionCookie(res);

  return res.json({
    authenticated: true,
  });
});

authRouter.post("/logout", (_req, res) => {
  clearSessionCookie(res);

  return res.json({
    authenticated: false,
  });
});

export { authRouter };
