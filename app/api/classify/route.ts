import { NextResponse } from "next/server";
import { SCAM_TYPES } from "../../../data/scamTypes";
import { classifyRequestSchema, formatError } from "../../../lib/validation";
import { clientIp, rateLimit } from "../../../lib/rate-limit";

const KEYWORDS: { id: string; re: RegExp }[] = [
  { id: "sim_swap", re: /\b(sim|सिम)\b|सिम स्वैप/i },
  { id: "otp_vishing", re: /\b(otp|ओटीपी|ओ टी पी)\b|वन टाइम/i },
  { id: "investment_app", re: /(trading|invest|निवेश|ट्रेडिंग|शेयर)/i },
  { id: "email_takeover", re: /(email|ईमेल|hack.*mail)/i },
  { id: "netbanking", re: /(net ?banking|internet banking|नेट बैंकिंग)/i },
  { id: "wallet_fraud", re: /(wallet|वॉलेट|mobikwik|amazon ?pay)/i },
  { id: "card_fraud", re: /(\bcard\b|कार्ड|atm)/i },
  { id: "upi_fraud", re: /(\bupi\b|यूपीआई|phonepe|gpay|google ?pay|paytm|भीम|qr)/i },
];

function keywordClassify(text: string): { id: string | null; ambiguous: boolean } {
  const matched = KEYWORDS.filter((k) => k.re.test(text)).map((k) => k.id);
  if (matched.length === 0) return { id: null, ambiguous: true };
  if (new Set(matched).size > 1) return { id: null, ambiguous: true };
  return { id: matched[0], ambiguous: false };
}

async function modelClassify(text: string): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: key, timeout: 2500, maxRetries: 0 });
    const res = await client.chat.completions.create(
      {
        model: "gpt-4o-mini",
        temperature: 0,
        max_tokens: 60,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'Classify an Indian cyber-fraud victim description into exactly one id from this list: ' +
              SCAM_TYPES.map((s) => s.id).join(", ") +
              '. Output ONLY {"scamTypeId": "...", "confidence": 0..1}. If unsure, confidence below 0.6.',
          },
          { role: "user", content: text.slice(0, 800) },
        ],
      },
      { signal: AbortSignal.timeout(2500) },
    );
    const raw = res.choices[0]?.message?.content;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { scamTypeId?: string; confidence?: number };
    const known = SCAM_TYPES.some((s) => s.id === parsed.scamTypeId);
    if (!known || (parsed.confidence ?? 0) < 0.6) return null;
    return parsed.scamTypeId!;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const rl = rateLimit(`classify:${clientIp(req)}`);
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
  const parsed = classifyRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      formatError("invalid_input", "Write a sentence about what happened."),
      { status: 400 },
    );
  }
  // Deterministic keyword map first; model only when ambiguous; never guess.
  const kw = keywordClassify(parsed.data.text);
  if (kw.id && !kw.ambiguous) {
    return NextResponse.json({ scamTypeId: kw.id, confidence: 0.9, source: "keywords" });
  }
  const modelId = await modelClassify(parsed.data.text);
  if (modelId) {
    return NextResponse.json({ scamTypeId: modelId, confidence: 0.75, source: "model" });
  }
  // Refuse to pick for the user — wrong NCRP sub-category is real-world harm.
  return NextResponse.json({ scamTypeId: null, confidence: 0, source: "none" });
}
