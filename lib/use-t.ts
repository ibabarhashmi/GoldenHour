"use client";

import { useLang } from "./case-store";
import { t, type DictKey } from "./i18n";
import type { Lang } from "./types";

export function useT() {
  const { lang } = useLang();
  const translate = (key: DictKey, vars?: Record<string, string | number>) =>
    t(lang, key, vars);
  return { lang, t: translate };
}

export type Translate = (key: DictKey, vars?: Record<string, string | number>) => string;
export type { Lang };
