"use client";

import { useSyncExternalStore } from "react";
import type { ActionKey, CaseFile, Lang } from "./types";
import { mockCaseId } from "./synthetic";

const CASE_KEY = "gh:case:v1";
const LANG_KEY = "gh:lang:v1";

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === CASE_KEY || e.key === LANG_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// useSyncExternalStore requires a referentially stable snapshot: parsing
// localStorage on every call yields a new object each time and sends React
// into an infinite render loop (error #185). Cache by raw-string identity.
let caseRawCache: string | null | undefined;
let caseCache: CaseFile | null = null;

function getCaseSnapshot(): CaseFile | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CASE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== caseRawCache) {
    caseRawCache = raw;
    try {
      caseCache = raw ? (JSON.parse(raw) as CaseFile) : null;
    } catch {
      caseCache = null;
    }
  }
  return caseCache;
}

function getLangSnapshot(): Lang | null {
  if (typeof window === "undefined") return null;
  try {
    return (window.localStorage.getItem(LANG_KEY) as Lang | null) ?? null;
  } catch {
    return null;
  }
}

const serverSnapshotNull = () => null;

export function useCase(): CaseFile | null {
  return useSyncExternalStore(
    subscribe,
    getCaseSnapshot,
    serverSnapshotNull,
  );
}

/** One-shot synchronous read for effects that must not subscribe. */
export function readCase(): CaseFile | null {
  return getCaseSnapshot();
}

export function useLang(): { lang: Lang } {
  // Server snapshot is "en", so SSR HTML is English and the hydration pass
  // matches it exactly. If the visitor has a stored preference it applies
  // immediately after boot — no skeleton gating anywhere in the app.
  const stored = useSyncExternalStore(subscribe, getLangSnapshot, (): Lang => "en");
  return { lang: stored ?? "en" };
}

export function updateCase(patch: Partial<CaseFile>): void {
  if (typeof window === "undefined") return;
  const current = getCaseSnapshot();
  if (!current) return;
  const next = { ...current, ...patch };
  window.localStorage.setItem(CASE_KEY, JSON.stringify(next));
  emit();
}

export function setLang(lang: Lang): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang === "hi" ? "hi" : "en";
  const c = getCaseSnapshot();
  if (c && c.lang !== lang) {
    window.localStorage.setItem(
      CASE_KEY,
      JSON.stringify({ ...c, lang }),
    );
  }
  emit();
}

export function createCase(fraudAt: number, onBehalfOf: "self" | "someone_else", lang: Lang): CaseFile {
  const c: CaseFile = {
    id: mockCaseId(),
    createdAt: Date.now(),
    fraudAt,
    lang,
    onBehalfOf,
    scamTypeId: null,
    amount: null,
    bankId: null,
    counterpartyHandle: null,
    utr: null,
    narrativeSlots: { how: null, what: null, approved: null },
    description: null,
    actions: { call1930: "pending", bank: "pending", ncrp: "pending" },
    acknowledgementNo: null,
    filedAt: null,
    timeline: [
      {
        at: Date.now(),
        kind: "created",
        label: {
          en: "Case opened. The clock started.",
          hi: "केस खुला. घड़ी शुरू हो गई.",
        },
      },
    ],
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CASE_KEY, JSON.stringify(c));
    window.localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    emit();
  }
  return c;
}

export function resetCase(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CASE_KEY);
  emit();
}

export function markActionDone(key: ActionKey, label: Record<Lang, string>): void {
  const c = getCaseSnapshot();
  if (!c || c.actions[key] === "done") return;
  updateCase({
    actions: { ...c.actions, [key]: "done" },
    timeline: [
      ...c.timeline,
      { at: Date.now(), kind: "action_done", label },
    ],
  });
}
