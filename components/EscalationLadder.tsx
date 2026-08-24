"use client";

import { useEffect, useState } from "react";
import { ESCALATION_LADDER } from "../data/escalation";
import { formatDate } from "../lib/clock";
import { useT } from "../lib/use-t";
import type { ActionStatus } from "../lib/types";

/**
 * The ladder renders computed calendar dates from fraudAt — never relative
 * labels like "in 30 days". A real date is something a victim can circle.
 */
export function EscalationLadder({
  fraudAt,
  actions,
}: {
  fraudAt: number;
  actions: Record<"call1930" | "bank" | "ncrp", ActionStatus>;
}) {
  const { t, lang } = useT();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const t0 = setTimeout(() => setNow(Date.now()), 0);
    const i = setInterval(() => setNow(Date.now()), 60_000);
    return () => {
      clearTimeout(t0);
      clearInterval(i);
    };
  }, []);
  return (
    <ol className="space-y-0">
      {ESCALATION_LADDER.map((step, i) => {
        const due = fraudAt + step.dayOffset * 86_400_000;
        const isDue = now !== null && now >= due;
        const trackedDone = !step.tracks || actions[step.tracks] === "done";
        return (
          <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
            <span
              aria-hidden
              className={`mt-1 inline-flex h-3 w-3 shrink-0 rounded-full ${
                trackedDone
                  ? "bg-stable"
                  : isDue
                    ? "bg-critical"
                    : "bg-hairline"
              }`}
            />
            <div className="min-w-0">
              <p className="text-sm font-medium leading-snug">
                {step.name[lang]}
                <span className="tnum ml-2 font-data text-xs text-muted">
                  {formatDate(due, lang)}
                </span>
                {!trackedDone && (
                  <span
                    className={`ml-2 rounded-sm border px-1.5 py-0.5 text-[11px] font-medium ${
                      isDue
                        ? "border-critical text-critical"
                        : "border-hairline text-muted"
                    }`}
                  >
                    {isDue ? t("case.status.due") : t("case.status.upcoming")}
                  </span>
                )}
                {trackedDone && (
                  <span className="ml-2 rounded-sm border border-stable px-1.5 py-0.5 text-[11px] font-medium text-stable">
                    {t("case.status.done")}
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-muted">
                {step.desc[lang]}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
