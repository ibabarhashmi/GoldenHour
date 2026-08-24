"use client";

import { useEffect, useState } from "react";
import { bandPhase, formatCountdown, remainingMs } from "../lib/clock";
import { useT } from "../lib/use-t";

const PHASE_STYLES = {
  fast: "bg-stable text-white",
  golden: "bg-urgent text-white",
  passed: "bg-hairline text-ink",
} as const;

/**
 * The signature element. Drains over 60 minutes from fraudAt.
 * - The visual timer ticks every second and is aria-hidden: a per-second
 *   live region would be a screen-reader denial-of-service.
 * - The polite live-region text depends only on ceil(remaining/60000), so
 *   its DOM text — and therefore the announcement — changes once per minute.
 * - After 60 minutes it becomes a calm grey band — never scolds, never hides.
 */
export function GoldenHourBand({ fraudAt }: { fraudAt: number }) {
  const { t } = useT();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // First tick lands just after paint (async: no setState-in-render cascade);
    // hydration-safe because the server always rendered the --:-- skeleton.
    const t0 = setTimeout(() => setNow(Date.now()), 0);
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearTimeout(t0);
      clearInterval(i);
    };
  }, []);

  const remaining = now === null ? null : remainingMs(fraudAt, now);
  const phase = now === null ? null : bandPhase(fraudAt, now);
  const minutesLeft =
    remaining === null ? null : Math.max(0, Math.ceil(remaining / 60_000));

  // Stable within each minute → SR announces once per minute, not per second.
  let liveLine = "";
  if (phase === "passed") liveLine = t("plan.band.passed.body");
  else if (phase === "golden")
    liveLine = `${minutesLeft} min — ${t("plan.odds.golden")}`;
  else if (phase === "fast") liveLine = `${minutesLeft} min — ${t("plan.odds.fast")}`;

  return (
    <section
      aria-label={t("plan.title")}
      className={`w-full px-4 py-4 transition-colors duration-700 ${
        phase ? PHASE_STYLES[phase] : "bg-card text-ink"
      }`}
    >
      <div suppressHydrationWarning className="mx-auto max-w-2xl">
        {remaining === null || phase === null ? (
          <>
            <p className="tnum font-data text-[64px] font-medium leading-none tracking-tight text-muted" aria-hidden>
              --:--
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-hairline" />
          </>
        ) : phase === "passed" ? (
          <>
            <h2 className="text-lg font-semibold">{t("plan.band.passed.title")}</h2>
            <p className="mt-0.5 text-sm">{t("plan.band.passed.body")}</p>
          </>
        ) : (
          <>
            <div className="flex items-end justify-between gap-3">
              <p
                className="tnum font-data text-[64px] font-medium leading-none tracking-tight"
                aria-hidden
              >
                {formatCountdown(remaining)}
              </p>
              <p className="pb-1 text-sm font-medium uppercase tracking-wide">
                {t("plan.band.left")}
              </p>
            </div>
            <div
              role="progressbar"
              aria-label={t("plan.band.left")}
              aria-valuemin={0}
              aria-valuemax={60}
              aria-valuenow={Math.round((remaining / 3_600_000) * 60)}
              className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/20"
            >
              <div
                className="h-full rounded-full bg-white/90 transition-[width] duration-1000 ease-linear"
                style={{ width: `${Math.max(0, Math.min(1, remaining / 3_600_000)) * 100}%` }}
              />
            </div>
          </>
        )}

        <p className="mt-3 text-sm leading-snug" aria-live="polite">
          {liveLine}
        </p>
      </div>
    </section>
  );
}
