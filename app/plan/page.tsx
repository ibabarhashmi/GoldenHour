"use client";

import { ActionCard } from "../../components/ActionCard";
import { GoldenHourBand } from "../../components/GoldenHourBand";
import { markActionDone, useCase } from "../../lib/case-store";
import { useT } from "../../lib/use-t";

export default function PlanPage() {
  const { t, lang } = useT();
  const c = useCase();

  if (!c) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 pt-16 text-center">
        <h1 className="text-xl font-semibold">{t("state.empty.title")}</h1>
        <p className="mt-2 text-sm text-muted">{t("state.empty.body")}</p>
        <a
          href="/start"
          className="gh-btn gh-btn-primary mt-6 h-12 px-5 text-sm"
        >
          {t("state.empty.cta")} →
        </a>
      </div>
    );
  }

  return (
    <>
      {/* The signature element, pinned under the header on every in-case screen */}
      <GoldenHourBand fraudAt={c.fraudAt} />
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 pb-10 pt-5">
        <h1 className="text-xl font-semibold tracking-tight">{t("plan.title")}</h1>

        <div className="mt-4 space-y-3">
          <ActionCard
            band="critical"
            orderLabel="plan.first"
            title={t("plan.card.call.title")}
            desc={t("plan.card.call.desc")}
            href="/plan/call"
            status={c.actions.call1930}
            onMarkDone={() =>
              markActionDone("call1930", {
                en: "Called 1930",
                hi: "1930 पर कॉल की",
              })
            }
          />
          <ActionCard
            band="urgent"
            orderLabel="plan.then"
            title={t("plan.card.bank.title")}
            desc={t("plan.card.bank.desc")}
            href="/plan/bank"
            status={c.actions.bank}
            onMarkDone={() =>
              markActionDone("bank", {
                en: "Informed the bank",
                hi: "बैंक को सूचित किया",
              })
            }
          />
          <ActionCard
            band="stable"
            orderLabel="plan.final"
            title={t("plan.card.ncrp.title")}
            desc={t("plan.card.ncrp.desc")}
            href="/plan/report"
            status={c.actions.ncrp}
          />
        </div>

        {lang === "hi" && (
          <p className="sr-only" role="status">
            {t("lang.switched")}
          </p>
        )}
      </div>
    </>
  );
}
