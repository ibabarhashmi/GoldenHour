import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { DEMO_ACCOUNTS } from "../../../../data/accounts";
import { formatError, loginSchema } from "../../../../lib/validation";
import { clientIp, rateLimit } from "../../../../lib/rate-limit";

const COOKIE = "gh_session";
const SESSION_VALUE = "gh-demo-session";

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) {
    // still burn comparable time to avoid a length oracle
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

export async function POST(req: Request) {
  if (!rateLimit(`login:${clientIp(req)}`, 10).ok) {
    return NextResponse.json(
      formatError("too_many", "Too many attempts. Try again in a minute."),
      { status: 429 },
    );
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(formatError("bad_json", "Malformed request."), {
      status: 400,
    });
  }
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      formatError("invalid_input", "Enter an email and password.", "email"),
      { status: 400 },
    );
  }
  const match = DEMO_ACCOUNTS.find((a) => a.email === parsed.data.email);
  if (!match || !safeEqual(match.password, parsed.data.password)) {
    return NextResponse.json(
      formatError("bad_credentials", "That email or password doesn't match a demo account."),
      { status: 401 },
    );
  }
  const store = await cookies();
  store.set(COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return new NextResponse(null, { status: 204 });
}
