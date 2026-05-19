import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DISABLED_TOOL_ROUTES = new Set([
  "/facebook-ads",
  "/gud-for-us-prompt-race",
  "/presentation-decks",
  "/slides-maker",
]);

export function middleware(request: NextRequest) {
  if (DISABLED_TOOL_ROUTES.has(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/instagram-transcriber", request.url));
  }

  return NextResponse.next();
}
