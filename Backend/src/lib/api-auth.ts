import type { NextFunction, Request, Response } from "express";
import { hasValidSession } from "./auth.js";

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  if (!hasValidSession(request)) {
    return response.status(401).json({
      error: "Unauthorized.",
    });
  }

  next();
}
