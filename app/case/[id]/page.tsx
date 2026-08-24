"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Container } from "../../../components/chrome";
import { EscalationLadder } from "../../../components/EscalationLadder";
import { formatDate, formatDateTime } from "../../../lib/clock";
import { formatRs } from "../../../lib/compose";
import { useCase } from "../../../lib/case-store";
import { useT } from "../../../lib/use-t";

export default function CasePage() {
  const { t, lang } = useT();
  const params = useParams<{ id: string }>();
  const c = useCase();

  if (!c || c.id !== params.id) {
    return (
      <Container>
        <div className="pt-10 text-center">
          <h1 className="text-xl font-semibold">{t("state.wrongid.title")}</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            {t("state.wrongid.body")}
          </p>
          <Link
            href="/"
            className="gh-btn gh-btn-primary mt-6 h-12 px-5 text-sm"
          >
            {t("state.empty.cta")} →
          </Link>
        </div>
      </Container>
    );
  }

  const statusChip = (done: boolean) => (
    <span
      className={`rounded-sm border px-2 py-0.5 text-[11px] font-semibold ${
        done ? "border-stable text-stable" : "border-hairline text-muted"
      }`}
    >
      {done ? t("case.status.done") : t("case.status.pending")}
    </span>
  );

  return (
    <Container>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {t("case.title")}
      </p>
      <h1 className="tnum mt-1 font-data text-2xl font-medium tracking-wide">
        {c.id}
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
        <span suppressHydrationWarning>{formatDateTime(c.fraudAt, lang)}</span>
        {c.amount != null && (
          <span className="tnum font-data">Rs {formatRs(c.amount)}</span>
        )}
        <span
          className={`rounded-sm border px-2 py-0.5 text-[11px] font-semibold ${
            c.acknowledgementNo
              ? "border-stable text-stable"
              : "border-hairline text-muted"
          }`}
        >
          {c.acknowledgementNo ? t("case.filed") : t("case.notfiled")}
        </span>
      </div>

      {c.acknowledgementNo && (
        <div className="mt-4 rounded-sm border border-stable bg-card p-4 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            {t("report.ack")}
          </p>
          <p className="tnum mt-1 font-data text-2xl font-medium select-all">
            {c.acknowledgementNo}
          </p>
        </div>
      )}

      {/* The three actions, mirrored from the plan */}
      <section className="mt-6 rounded-sm border border-hairline bg-card p-4">
        <h2 className="text-sm font-semibold">{t("case.actions.title")}</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex min-h-8 items-center justify-between gap-3">
            <span>{t("plan.card.call.title")}</span>
            {statusChip(c.actions.call1930 === "done")}
          </li>
          <li className="flex min-h-8 items-center justify-between gap-3">
            <span>{t("plan.card.bank.title")}</span>
            {statusChip(c.actions.bank === "done")}
          </li>
          <li className="flex min-h-8 items-center justify-between gap-3">
            <span>{t("plan.card.ncrp.title")}</span>
            {statusChip(c.actions.ncrp === "done")}
          </li>
        </ul>
        {(c.actions.call1930 !== "done" ||
          c.actions.bank !== "done" ||
          c.actions.ncrp !== "done") && (
          <Link
            href="/plan"
            className="mt-3 inline-flex h-11 items-center text-sm font-medium underline underline-offset-2"
          >
            ← {t("plan.title")}
          </Link>
        )}
      </section>

      {/* Honest expectations — no promises */}
      <section className="mt-4 rounded-sm border border-hairline bg-card p-4">
        <h2 className="text-sm font-semibold">{t("case.expectations.title")}</h2>
        <ul className="mt-2 space-y-2 text-sm leading-snug text-muted">
          <li>• {t("case.expectations.1")}</li>
          <li>• {t("case.expectations.2")}</li>
          <li>• {t("case.expectations.3")}</li>
        </ul>
      </section>

      {/* Timeline */}
      <section className="mt-4 rounded-sm border border-hairline bg-card p-4">
        <h2 className="text-sm font-semibold">{t("case.timeline.title")}</h2>
        <ol className="mt-3 space-y-0">
          {[...c.timeline]
            .sort((a, b) => a.at - b.at)
            .map((ev, i) => (
              <li key={i} className="relative flex gap-3 pb-4 last:pb-0">
                <span
                  aria-hidden
                  className={`mt-1 inline-flex h-2 w-2 shrink-0 rounded-full ${
                    ev.kind === "filed"
                      ? "bg-stable"
                      : ev.kind === "action_done"
                        ? "bg-urgent"
                        : "bg-ink/40"
                  }`}
                />
                <div className="text-sm leading-snug">
                  <span suppressHydrationWarning className="mr-2 tnum font-data text-xs text-muted">
                    {formatDate(ev.at, lang)}
                  </span>
                  {ev.label[lang]}
                </div>
              </li>
            ))}
        </ol>
      </section>

      {/* Escalation ladder with computed calendar dates (Gate 7) */}
      <section className="mt-4 rounded-sm border border-hairline bg-card p-4">
        <h2 className="text-sm font-semibold">{t("case.escalation.title")}</h2>
        <p className="mb-4 mt-1 text-xs text-muted">{t("case.escalation.sub")}</p>
        <EscalationLadder fraudAt={c.fraudAt} actions={c.actions} />
      </section>

      <section className="mt-4 rounded-sm border border-hairline bg-card p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
          {t("about.odds.disclaimer")}
        </h2>
      </section>
    </Container>
  );
}
