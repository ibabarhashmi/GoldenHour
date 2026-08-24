import type { Lang } from "./types";
import { en, type DictKey } from "../locales/en";
import { hi } from "../locales/hi";

const dicts: Record<Lang, Record<DictKey, string>> = {
  en,
  hi,
};

export type { DictKey };

export function t(
  lang: Lang,
  key: DictKey,
  vars?: Record<string, string | number>,
): string {
  let s = dicts[lang][key] ?? dicts.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, String(v));
    }
  }
  return s;
}

// Gate 8: dev-time parity assertion. Any key in `en` missing from `hi` throws
// at module load in development — half-translated screens never ship.
if (
  process.env.NODE_ENV === "development" &&
  typeof window !== "undefined"
) {
  for (const key of Object.keys(en) as DictKey[]) {
    if (!(key in hi)) {
      throw new Error(`[i18n] Missing Hindi translation for key: ${key}`);
    }
  }
}
