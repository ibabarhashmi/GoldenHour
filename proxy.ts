import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/session";

const PROTECTED = ["/start", "/triage", "/plan", "/case", "/report"];

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (!PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }
  const session = req.cookies.get("gh_session")?.value;
  if (await verifySession(session)) return NextResponse.next();
  const url = new URL("/login", req.url);
  url.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/start/:path*",
    "/triage/:path*",
    "/plan/:path*",
    "/case/:path*",
    "/report/:path*",
  ],
};
