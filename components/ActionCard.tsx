"use client";

import Link from "next/link";
import { useT } from "../lib/use-t";
import type { ActionStatus } from "../lib/types";
import type { DictKey } from "../lib/i18n";

const BAND_STYLES = {
  critical: { border: "border-l-critical", text: "text-critical", chip: "bg-critical/10 text-critical" },
  urgent: { border: "border-l-urgent", text: "text-urgent", chip: "bg-urgent/10 text-urgent" },
  stable: { border: "border-l-stable", text: "text-stable", chip: "bg-stable/10 text-stable" },
} as const;

const STATUS_STYLES: Record<ActionStatus, string> = {
  done: "bg-stable/10 text-stable border-stable",
  in_progress: "bg-urgent/10 text-urgent border-urgent",
  pending: "bg-card text-muted border-hairline",
  skipped: "bg-card text-muted border-hairline line-through",
};

export function ActionCard({
  band,
  orderLabel,
  title,
  desc,
  href,
  status,
  onMarkDone,
}: {
  band: keyof typeof BAND_STYLES;
  orderLabel: DictKey;
  title: string;
  desc: string;
  href: string;
  status: ActionStatus;
  onMarkDone?: () => void;
}) {
  const { t } = useT();
  const done = status === "done";
  const bandStyle = BAND_STYLES[band];
  return (
    <article
      className={`gh-card gh-card-hover gh-rise border-l-4 p-4 ${bandStyle.border}`}
      style={{ animationDelay: `${band === "critical" ? 0 : band === "urgent" ? 60 : 120}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={`gh-tag ${bandStyle.text}`}>{t(orderLabel)}</p>
        {!done && onMarkDone ? (
          <button
            type="button"
            onClick={onMarkDone}
            className={`gh-btn rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
          >
            {t("plan.markdone")}
          </button>
        ) : (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
          >
            {done && (
              <svg aria-hidden width="12" height="12" viewBox="0 0 12 12">
                <path
                  d="M2 6.5 L5 9 L10 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            )}
            {done ? t("plan.done") : t("plan.pending")}
          </span>
        )}
      </div>
      <h3 className={done ? "mt-2.5 text-lg font-bold text-muted" : "mt-2.5 text-lg font-bold"}>
        {title}
      </h3>
      <p className="mt-1 text-sm leading-snug text-muted">{desc}</p>
      <Link
        href={href}
        className="gh-btn gh-btn-primary mt-4 h-11 w-full px-4 text-sm group"
      >
        <span className="flex-1 truncate text-left">
          {done && <span aria-hidden className="mr-1.5 text-stable">✓</span>}
          {title}
        </span>
        <span
          aria-hidden
          className="transition-transform duration-150 group-hover:translate-x-0.5"
        >
          →
        </span>
        <span className="sr-only"> {title}</span>
      </Link>
    </article>
  );
}
