import { strict as assert } from "node:assert";
import { test } from "node:test";
import { SCAM_TYPES } from "../data/scamTypes.ts";
import { NCRP_SUB_CATEGORIES } from "../lib/types.ts";

test("every scam type maps to exactly one of NCRP's real seven sub-categories (Gate 3)", () => {
  assert.equal(SCAM_TYPES.length, 8);
  const real = new Set<string>(NCRP_SUB_CATEGORIES);
  for (const s of SCAM_TYPES) {
    assert.equal(s.ncrpCategory, "Online Financial Fraud");
    assert.ok(
      real.has(s.ncrpSubCategory),
      `"${s.ncrpSubCategory}" is not a real NCRP sub-category`,
    );
    assert.ok(s.label.en && s.label.hi && s.hint.en && s.hint.hi);
    assert.ok(s.evidence.length > 0);
  }
});

test("all seven real sub-categories are covered by at least one tile", () => {
  const used = new Set(SCAM_TYPES.map((s) => s.ncrpSubCategory));
  for (const c of NCRP_SUB_CATEGORIES) {
    assert.ok(used.has(c), `sub-category "${c}" has no plain-language tile`);
  }
});
