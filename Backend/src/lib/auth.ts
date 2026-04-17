import crypto from "node:crypto";
import type { Request, Response } from "express";
import { env } from "../config/env.js";

const COOKIE_NAME = "envo_auth";
const COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

function getSecret() {
  return env.AUTH_COOKIE_SECRET ?? "";
}

function createSignature(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function isAuthConfigured() {
  return Boolean(env.SITE_PASSWORD && env.AUTH_COOKIE_SECRET);
}

export function parseCookies(request: Request) {
  const header = request.headers.cookie;

  if (!header) {
    return {};
  }

  return Object.fromEntries(
    header.split(";").map((cookie) => {
      const [name, ...rest] = cookie.trim().split("=");
      return [name, decodeURIComponent(rest.join("="))];
    }),
  );
}

export function createSessionValue() {
  const payload = "unlocked";
  const signature = createSignature(payload);
  return `${payload}.${signature}`;
}

export function hasValidSession(request: Request) {
  if (!isAuthConfigured()) {
    return false;
  }

  const cookieValue = parseCookies(request)[COOKIE_NAME];

  if (!cookieValue) {
    return false;
  }

  const [payload, signature] = cookieValue.split(".");

  if (!payload || !signature) {
    return false;
  }

  return payload === "unlocked" && safeEqual(signature, createSignature(payload));
}

export function setSessionCookie(response: Response) {
  response.cookie(COOKIE_NAME, createSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  });
}

export function clearSessionCookie(response: Response) {
  response.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
  });
}
