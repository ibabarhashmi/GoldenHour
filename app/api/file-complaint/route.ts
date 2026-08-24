import { NextResponse } from "next/server";
import { mockAckNo } from "../../../lib/synthetic";
import {
  fileComplaintSchema,
  formatError,
} from "../../../lib/validation";

/**
 * MOCK — nothing reaches the real NCRP. Validates with the exact schema the
 * form uses, waits long enough to feel honest, and returns a 99-prefixed
 * acknowledgement number so no one can mistake it for a real one.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(formatError("bad_json", "Malformed request."), {
      status: 400,
    });
  }
  const parsed = fileComplaintSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      formatError(
        "validation_failed",
        first?.message.includes("200")
          ? "The description needs at least 200 characters."
          : (first?.message ?? "Some fields need attention before submitting."),
        String(first?.path[0] ?? ""),
      ),
      { status: 400 },
    );
  }
  await new Promise((r) => setTimeout(r, 900));
  return NextResponse.json({
    acknowledgementNo: mockAckNo(),
    filedAt: Date.now(),
  });
}
