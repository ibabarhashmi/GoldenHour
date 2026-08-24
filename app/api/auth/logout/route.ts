import { NextResponse } from "next/server";

const COOKIE = "gh_session";

export async function POST() {
  const res = new NextResponse(null, { status: 204 });
  res.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
