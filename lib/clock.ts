import type { Lang } from "./types.ts";

const MINUTE = 60_000;

export const GOLDEN_HOUR_MINUTES = 60;

/** Remaining golden-hour ms, clamped at 0. Negative never escapes this module. */
export function remainingMs(fraudAt: number, now: number): number {
  return Math.max(0, fraudAt + GOLDEN_HOUR_MINUTES * MINUTE - now);
}

export function elapsedMinutes(fraudAt: number, now: number): number {
  return Math.max(0, Math.floor((now - fraudAt) / MINUTE));
}

export function formatCountdown(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "00:00";
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export type BandPhase = "fast" | "golden" | "passed";

export function bandPhase(fraudAt: number, now: number): BandPhase {
  const mins = elapsedMinutes(fraudAt, now);
  if (mins < 20) return "fast";
  if (mins < GOLDEN_HOUR_MINUTES) return "golden";
  return "passed";
}

export function formatDateTime(epochMs: number, lang: Lang): string {
  const locale = lang === "hi" ? "hi-IN" : "en-IN";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(epochMs));
}

export function formatDate(epochMs: number, lang: Lang): string {
  const locale = lang === "hi" ? "hi-IN" : "en-IN";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(epochMs));
}

export function formatTime(epochMs: number, lang: Lang): string {
  const locale = lang === "hi" ? "hi-IN" : "en-IN";
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(epochMs));
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
