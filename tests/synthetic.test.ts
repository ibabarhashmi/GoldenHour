import { strict as assert } from "node:assert";
import { signSession, verifySession } from "../lib/session.ts";
import { test } from "node:test";
import { fakeAadhaar, fakePan, fakeUtr, mockAckNo, verhoeffValid } from "../lib/synthetic.ts";

test("generated Aadhaar-shaped numbers are provably invalid (1000 samples)", () => {
  for (let i = 0; i < 1000; i++) {
    const n = fakeAadhaar();
    assert.equal(n.length, 12, "must be 12 digits");
    assert.match(n, /^\d{12}$/, "digits only");
    assert.ok(n.startsWith("0"), "UIDAI never issues a leading 0");
    assert.equal(verhoeffValid(n), false, `sample ${n} must FAIL Verhoeff`);
  }
});

test("verhoeffValid rejects junk and accepts the reference example", () => {
  assert.equal(verhoeffValid(""), false);
  assert.equal(verhoeffValid("abc"), false);
  // 2363 is the Verhoeff worked example (append check digit 3 to 236).
  assert.equal(verhoeffValid("2363"), true);
});

test("PAN placeholder is the reserved impossible pattern", () => {
  const p = fakePan();
  assert.equal(p, "ZZZZZ0000Z");
  assert.ok(!/^[A-Z]{3}[ABCFGHJLPT][A-Z][0-9]{4}[A-Z]$/.test(p), "cannot parse as a real PAN pattern");
});

test("UTR placeholders always carry the 0000 tell", () => {
  for (let i = 0; i < 500; i++) {
    const u = fakeUtr();
    assert.match(u, /^\d{12}$/);
    assert.ok(u.startsWith("0000"), "real UTRs do not start 0000");
  }
});

test("acknowledgement numbers are 14 digits starting 99", () => {
  for (let i = 0; i < 500; i++) {
    const a = mockAckNo();
    assert.match(a, /^\d{14}$/);
    assert.ok(a.startsWith("99"), "99 prefix is the visible mock tell");
  }
});

test("rejects a tampered session cookie", async () => {
  const token = await signSession("demo@goldenhour.in");
  const tampered = token.slice(0, -1) + (token.at(-1) === "A" ? "B" : "A");
  const result = await verifySession(tampered);
  assert.strictEqual(result, null);
});

test("rejects a malformed token", async () => {
  const result1 = await verifySession("garbage");
  const result2 = await verifySession(undefined);
  assert.strictEqual(result1, null);
  assert.strictEqual(result2, null);
});

test("accepts a valid token", async () => {
  const result = await verifySession(await signSession("u1"));
  assert.deepStrictEqual(result, { uid: "u1" });
});
