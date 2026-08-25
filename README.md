# GoldenHour (https://goldenhour-wine.vercel.app/)

**A panic-optimised first-response co-pilot for Indian cyber-fraud victims**, built around NCRP (cybercrime.gov.in) and the 1930 helpline.

---

## 🔑 Judge credentials (demo login)

| Email | Password |
|---|---|
| `judge@demo.in` | `demo1234` |
| `partner@demo.in` | `demo1234` |
| `victim@demo.in` | `demo1234` |

The same credentials are printed on `/login`. Sessions are HMAC-signed and verified in middleware on every protected request. Demo accounts are pre-seeded for judging.

## What this is

When someone realises they have just been scammed, GoldenHour replaces panic with one calm screen: a live golden-hour countdown and three ordered actions —

1. **Call 1930** with a ready bilingual script (`tel:` link + read-aloud),
2. **Freeze with your bank** using words that invoke RBI limited-liability rules,
3. **File on NCRP** with the mandatory 200-character description auto-written from three taps, then submit through a faithful mirror of the portal's real four-tab form → mock 14-digit acknowledgement starting `99` → case tracker with computed escalation dates.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build && npm start
```

Tests (identity checksums, composer floor, triage mapping, i18n parity):

```bash
npm test
```

## Honest boundary

- **Real:** all product logic, the NCRP sub-category mapping, composer, validation limits, escalation date maths, bilingual UI.
- **Mocked:** accounts, complaint submission, acknowledgement numbers, bank helplines (`1800-000-0000` placeholders), every identifier, file uploads (validated then discarded).
- **The only real phone numbers in this codebase are 1930 and 112** — enforced by a grep in the build checklist.
- AI is optional: everything works with `OPENAI_API_KEY` unset; the model only polishes wording with a hard 2.5 s timeout and never replaces deterministic output.

See `/about` in the app for the full real-vs-mocked table.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · zod · openai (optional). No database — case state lives in `localStorage`, deliberately (serverless functions don't share memory; a disposable case belongs to one device; offline support comes free).

## Environment

Copy `.env.example` → `.env.local`. Both variables are optional.
