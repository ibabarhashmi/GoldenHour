import { strict as assert } from "node:assert";
import { test } from "node:test";
import { en } from "../locales/en.ts";
import { hi } from "../locales/hi.ts";

test("every English key has a Hindi translation (Gate 8)", () => {
  const missing = (Object.keys(en) as (keyof typeof en)[]).filter(
    (k) => !(k in hi) || !hi[k]?.trim(),
  );
  assert.deepEqual(missing, [], `missing hi translations: ${missing.join(", ")}`);
});

test("no extra Hindi keys that don't exist in English", () => {
  const extra = Object.keys(hi).filter((k) => !(k in en));
  assert.deepEqual(extra, []);
});
