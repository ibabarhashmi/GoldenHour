import { NextResponse } from "next/server";
import OpenAI from "openai";
import { composeDescription } from "../../../lib/compose";
import { clientIp, rateLimit } from "../../../lib/rate-limit";
import {
  descriptionSchema,
  draftRequestSchema,
  formatError,
} from "../../../lib/validation";

const SYSTEM_PROMPT = `You rewrite a cyber-fraud complaint description for India's National Cyber Crime Reporting Portal.
Rules:
- 220 to 400 characters.
- Plain factual first person, past tense.
- No special characters except comma, full stop, hyphen. Devanagari letters are allowed when the input is Hindi.
- Do not invent facts, names, amounts, or reference numbers not given.
- Do not give legal advice or promise recovery.
- Output ONLY: {"description": "..."} as JSON.`;

async function polish(input: {
  how: string | null;
  what: string | null;
  approved: string | null;
  amount?: number | null;
  bank?: string | null;
  utr?: string | null;
  handle?: string | null;
  fraudAt: number;
  lang: "en" | "hi";
}): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const client = new OpenAI({
      apiKey: key,
      timeout: 2500,
      maxRetries: 0,
    });
    const res = await client.chat.completions.create(
      {
        model: "gpt-4o-mini",
        temperature: 0.2,
        max_tokens: 250,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: JSON.stringify({
              language: input.lang,
              date_of_incident: new Date(input.fraudAt).toISOString(),
              how_it_started: input.how,
              what_happened: input.what,
              approval: input.approved,
              amount_rs: input.amount ?? undefined,
              bank_name: input.bank ?? undefined,
              utr: input.utr ?? undefined,
              counterparty_identifier: input.handle ?? undefined,
            }),
          },
        ],
      },
      { signal: AbortSignal.timeout(2500) },
    );
    const raw = res.choices[0]?.message?.content;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { description?: unknown };
    if (typeof parsed.description !== "string") return null;
    const clean = parsed.description.trim();
    // Same validator as the form — the model never gets a free pass.
    return descriptionSchema.safeParse(clean).success ? clean : null;
  } catch {
    return null; // timeout, quota, offline — deterministic text already rendered
  }
}

export async function POST(req: Request) {
  const rl = rateLimit(`draft:${clientIp(req)}`);
  if (!rl.ok) {
    return NextResponse.json(
      formatError("rate_limited", `Too many requests. Try again in ${rl.retryAfterSec}s.`),
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
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
  const parsed = draftRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      formatError("invalid_input", "Missing the details needed to draft a description."),
      { status: 400 },
    );
  }
  const deterministic = composeDescription(parsed.data);
  // The model runs in parallel with a hard timeout; it never blocks or replaces
  // the deterministic result.
  const polished = await polish(parsed.data);
  return NextResponse.json({
    description: deterministic,
    ...(polished && polished !== deterministic
      ? { polished: { description: polished } }
      : {}),
  });
}
