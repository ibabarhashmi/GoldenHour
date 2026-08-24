import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  APPROVAL_OPTIONS,
  HOW_OPTIONS,
  WHAT_OPTIONS,
  composeDescription,
  sanitizeHandle,
} from "../lib/compose.ts";
import { DESCRIPTION_REGEX, descriptionSchema } from "../lib/validation.ts";

const fraudAt = Date.now() - 10 * 60_000;
const hows = [...Object.keys(HOW_OPTIONS), null];
const whats = [...Object.keys(WHAT_OPTIONS), null];
const approvals = [...Object.keys(APPROVAL_OPTIONS), null];

const bankVariants = [
  null,
  "State Bank of India",
  "IDFC FIRST Bank",
  "Paytm",
  "Airtel Money",
];
const amountVariants = [null, 500, 85000, 1234567];
const utrVariants = [null, "000012345678", "123456789012"];

test("every slot combination clears 200 chars and passes the portal regex, in both languages (Gate 4)", () => {
  let count = 0;
  for (const lang of ["en", "hi"] as const) {
    for (const how of hows) {
      for (const what of whats) {
        for (const approved of approvals) {
          for (const amount of amountVariants) {
            for (const bank of bankVariants) {
              for (const utr of utrVariants) {
                const desc = composeDescription({
                  how,
                  what,
                  approved,
                  amount,
                  bank,
                  utr,
                  handle: null,
                  fraudAt,
                  lang,
                });
                const parsed = descriptionSchema.safeParse(desc);
                assert.equal(
                  parsed.success,
                  true,
                  `FAILED lang=${lang} how=${how} what=${what} approved=${approved} amount=${amount} bank=${bank} utr=${utr} → len=${desc.length}: ${desc}`,
                );
                if (parsed.success) {
                  assert.ok(
                    parsed.data.length >= 200,
                    `below floor at len=${desc.length}`,
                  );
                }
                if (utr) {
                  assert.ok(
                    !desc.includes('"'),
                    `double quote leaked into description: ${desc}`,
                  );
                }
                count++;
              }
            }
          }
        }
      }
    }
  }
  // 2 langs x 6 hows x 4 whats x 3 approvals x 4 amounts x 5 banks x 3 utrs
  assert.equal(count, 8640);
});

test("with a handle added it still passes (handles are user-supplied free text)", () => {
  const desc = composeDescription({
    how: "clicked_link",
    what: "money_debited",
    approved: "not_approved",
    amount: 1000,
    bank: "HDFC Bank",
    utr: "000012345678",
    handle: "victim@ybl",
    fraudAt,
    lang: "hi",
  });
  assert.ok(descriptionSchema.safeParse(desc).success);
});

test("axy@upi renders unquoted as axy at upi and clears the portal allowlist in both languages", () => {
  for (const lang of ["en", "hi"] as const) {
    const desc = composeDescription({
      how: "shared_otp",
      what: "money_debited",
      approved: "not_approved",
      amount: 80000,
      bank: "HDFC Bank",
      utr: "789789778782",
      handle: "axy@upi",
      fraudAt,
      lang,
    });
    assert.ok(desc.length >= 200, `below floor at len=${desc.length} (${lang})`);
    assert.ok(
      desc.includes("axy at upi"),
      `sanitised handle missing in ${lang}: ${desc}`,
    );
    assert.ok(!desc.includes("@"), `@ leaked into ${lang}: ${desc}`);
    assert.ok(!desc.includes('"'), `double quote leaked into ${lang}: ${desc}`);
    assert.match(
      desc,
      DESCRIPTION_REGEX,
      `${lang} description has a character the portal rejects: ${desc}`,
    );
    assert.ok(
      descriptionSchema.safeParse(desc).success,
      `${lang} description fails zod schema: ${desc}`,
    );
  }
});

test("email-style handle name.surname@gmail.com renders as name.surname at gmail.com", () => {
  assert.equal(sanitizeHandle("name.surname@gmail.com"), "name.surname at gmail.com");
  for (const lang of ["en", "hi"] as const) {
    const desc = composeDescription({
      how: "clicked_link",
      what: "money_debited",
      approved: "not_approved",
      amount: 5000,
      bank: "State Bank of India",
      utr: "000012345678",
      handle: "name.surname@gmail.com",
      fraudAt,
      lang,
    });
    assert.ok(
      desc.includes("name.surname at gmail.com"),
      `expected sanitised email in ${lang}: ${desc}`,
    );
    assert.ok(!desc.includes("@"), `@ leaked into ${lang}: ${desc}`);
    assert.ok(!desc.includes('"'), `double quote leaked into ${lang}: ${desc}`);
    assert.match(
      desc,
      DESCRIPTION_REGEX,
      `${lang} description has a character the portal rejects: ${desc}`,
    );
    assert.ok(
      descriptionSchema.safeParse(desc).success,
      `${lang} description fails zod schema: ${desc}`,
    );
  }
});

test("no double quotes anywhere a UTR is present, in both languages", () => {
  for (const lang of ["en", "hi"] as const) {
    const desc = composeDescription({
      how: "call_impersonation",
      what: "card_used",
      approved: "tricked_approve",
      amount: 85000,
      bank: "IDFC FIRST Bank",
      utr: "123456789012",
      handle: null,
      fraudAt,
      lang,
    });
    assert.ok(!desc.includes('"'), `double quote leaked into ${lang}: ${desc}`);
    assert.match(desc, DESCRIPTION_REGEX);
  }
});
