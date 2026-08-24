import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/start", "/triage", "/plan", "/case"];

/**
 * Next.js 16: middleware is now "proxy". Mock-session gate — presence of the
 * httpOnly cookie set by /api/auth/login. No real auth; stated openly in /about.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (!PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }
  const session = request.cookies.get("gh_session")?.value;
  if (session === "gh-demo-session") return NextResponse.next();
  const login = new URL("/login", request.url);
  login.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/start/:path*",
    "/triage/:path*",
    "/plan/:path*",
    "/case/:path*",
  ],
};
