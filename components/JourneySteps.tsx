"use client";

import { usePathname } from "next/navigation";
import { useT } from "../lib/use-t";
import type { DictKey } from "../lib/i18n";

const STEPS: { key: DictKey; match: (p: string) => boolean }[] = [
  { key: "journey.step.start", match: (p) => p.startsWith("/start") },
  { key: "journey.step.describe", match: (p) => p.startsWith("/triage") },
  {
    key: "journey.step.act",
    match: (p) =>
      (p.startsWith("/plan") && !p.startsWith("/plan/report")) || p === "/plan",
  },
  {
    key: "journey.step.file",
    match: (p) => p.startsWith("/plan/report") || p.startsWith("/case"),
  },
];

export function JourneySteps() {
  const pathname = usePathname();
  const activeIdx = STEPS.findIndex((s) => s.match(pathname));
  if (activeIdx === -1) return null;

  return <JourneyStepsInner activeIdx={activeIdx} />;
}

function JourneyStepsInner({ activeIdx }: { activeIdx: number }) {
  const { t } = useT();
  return (
    <nav aria-label={t("journey.label")} className="border-t border-hairline bg-card">
      <ol className="mx-auto flex w-full max-w-2xl items-stretch px-4">
        {STEPS.map((step, i) => {
          const state =
            i < activeIdx ? "done" : i === activeIdx ? "current" : "todo";
          return (
            <li
              key={step.key}
              aria-current={state === "current" ? "step" : undefined}
              className="flex min-w-0 flex-1 items-center gap-2 py-2"
            >
              <span
                aria-hidden
                className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  state === "current"
                    ? "bg-ink text-white"
                    : state === "done"
                      ? "bg-stable text-white"
                      : "bg-clinical text-muted ring-1 ring-hairline"
                }`}
              >
                {state === "done" ? "✓" : i + 1}
              </span>
              <span
                className={`truncate text-[12px] font-semibold leading-tight ${
                  state === "todo" ? "text-muted" : ""
                }`}
              >
                {t(step.key)}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={`ml-1 hidden h-px flex-1 sm:block ${
                    state === "done" ? "bg-stable/50" : "bg-hairline"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
