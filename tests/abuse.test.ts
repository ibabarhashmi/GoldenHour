import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  caseInputSchema,
  descriptionSchema,
  fileComplaintSchema,
  loginSchema,
} from "../lib/validation.ts";

const now = Date.now();

test("10 000-char description is rejected, not crashed", () => {
  const big = "a".repeat(10_000);
  const r = descriptionSchema.safeParse(big);
  assert.equal(r.success, false);
});

test("description under 200 chars is rejected", () => {
  const r = descriptionSchema.safeParse("short");
  assert.equal(r.success, false);
});

test("XSS payload in description is rejected by charset regex", () => {
  const xss = '<script>alert(1)</script> ' + "a".repeat(200);
  const r = descriptionSchema.safeParse(xss);
  assert.equal(r.success, false, "angle brackets must fail the portal charset");
});

test("negative amount is rejected", () => {
  const r = fileComplaintSchema.safeParse({
    caseId: "abc",
    scamTypeId: "x",
    ncrpCategory: "Online Financial Fraud",
    ncrpSubCategory: "x",
    fraudAt: now - 1000,
    amount: -5000,
    description: "a".repeat(200),
    complainantName: "Test User",
    complainantMobile: "9999999999",
    complainantEmail: "t@t.in",
    onBehalfOf: "self",
    declarationAccepted: true,
  });
  assert.equal(r.success, false);
});

test("absurdly large amount is rejected", () => {
  const r = fileComplaintSchema.safeParse({
    caseId: "abc",
    scamTypeId: "x",
    ncrpCategory: "Online Financial Fraud",
    ncrpSubCategory: "x",
    fraudAt: now - 1000,
    amount: 999_999_999_999,
    description: "a".repeat(200),
    complainantName: "Test User",
    complainantMobile: "9999999999",
    complainantEmail: "t@t.in",
    onBehalfOf: "self",
    declarationAccepted: true,
  });
  assert.equal(r.success, false);
});

test("future fraudAt is rejected by caseInputSchema", () => {
  const r = caseInputSchema.safeParse({
    description: "a".repeat(200),
    fraudAt: now + 86_400_000 * 365,
    amount: 1000,
  });
  assert.equal(r.success, false);
});

test("declaration not accepted is rejected", () => {
  const r = fileComplaintSchema.safeParse({
    caseId: "abc",
    scamTypeId: "x",
    ncrpCategory: "Online Financial Fraud",
    ncrpSubCategory: "x",
    fraudAt: now - 1000,
    amount: 1000,
    description: "a".repeat(200),
    complainantName: "Test User",
    complainantMobile: "9999999999",
    complainantEmail: "t@t.in",
    onBehalfOf: "self",
    declarationAccepted: false,
  });
  assert.equal(r.success, false);
});

test("login rejects empty email", () => {
  const r = loginSchema.safeParse({ email: "", password: "x" });
  assert.equal(r.success, false);
});

test("login rejects password over 128 chars", () => {
  const r = loginSchema.safeParse({ email: "a@b.com", password: "x".repeat(200) });
  assert.equal(r.success, false);
});

test("complainant mobile must be exactly 10 digits", () => {
  const base = {
    caseId: "abc",
    scamTypeId: "x",
    ncrpCategory: "Online Financial Fraud",
    ncrpSubCategory: "x",
    fraudAt: now - 1000,
    amount: 1000,
    description: "a".repeat(200),
    complainantName: "Test User",
    complainantEmail: "t@t.in",
    onBehalfOf: "self",
    declarationAccepted: true,
  };
  assert.equal(fileComplaintSchema.safeParse({ ...base, complainantMobile: "123" }).success, false);
  assert.equal(fileComplaintSchema.safeParse({ ...base, complainantMobile: "12345678901" }).success, false);
  assert.equal(fileComplaintSchema.safeParse({ ...base, complainantMobile: "abcdefghij" }).success, false);
});

test("handle over 120 chars is rejected", () => {
  const r = fileComplaintSchema.safeParse({
    caseId: "abc",
    scamTypeId: "x",
    ncrpCategory: "Online Financial Fraud",
    ncrpSubCategory: "x",
    fraudAt: now - 1000,
    amount: 1000,
    description: "a".repeat(200),
    handle: "x".repeat(200),
    complainantName: "Test User",
    complainantMobile: "9999999999",
    complainantEmail: "t@t.in",
    onBehalfOf: "self",
    declarationAccepted: true,
  });
  assert.equal(r.success, false);
});

test("ncrpCategory must be the exact literal", () => {
  const r = fileComplaintSchema.safeParse({
    caseId: "abc",
    scamTypeId: "x",
    ncrpCategory: "Something Else",
    ncrpSubCategory: "x",
    fraudAt: now - 1000,
    amount: 1000,
    description: "a".repeat(200),
    complainantName: "Test User",
    complainantMobile: "9999999999",
    complainantEmail: "t@t.in",
    onBehalfOf: "self",
    declarationAccepted: true,
  });
  assert.equal(r.success, false);
});
