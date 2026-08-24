"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "../../../components/chrome";
import { ScriptCard } from "../../../components/ScriptCard";
import { BANKS, bankById } from "../../../data/banks";
import { updateCase, useCase } from "../../../lib/case-store";
import { formatRs } from "../../../lib/compose";
import { useT } from "../../../lib/use-t";

export default function BankPage() {
  const { t, lang } = useT();
  const c = useCase();
  const [selected, setSelected] = useState<string | null>(null);

  if (!c) {
    return (
      <Container>
        <div className="pt-10 text-center">
          <h1 className="text-xl font-semibold">{t("state.empty.title")}</h1>
          <a
            href="/start"
            className="gh-btn gh-btn-primary mt-6 h-12 px-5 text-sm"
          >
            {t("state.empty.cta")} →
          </a>
        </div>
      </Container>
    );
  }

  const bankId = selected ?? c.bankId;
  const bank = bankById(bankId);
  const amount = c.amount != null ? `Rs ${formatRs(c.amount)}` : "";

  const pick = (id: string) => {
    setSelected(id);
    updateCase({ bankId: id });
  };

  return (
    <Container>
      <Link href="/plan" className="text-sm font-medium text-muted hover:text-ink">
        ← {t("bank.back")}
      </Link>
      <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight">
        {t("bank.title")}
      </h1>

      {/* SAFETY RULE: the mock-number warning renders here, from the component,
          above the fold — it can never be forgotten in the data. */}
      <div role="note" className="mt-4 rounded-sm border border-critical bg-critical/5 p-3">
        <p className="text-sm font-semibold text-critical">{t("bank.mock.title")}</p>
        <p className="mt-1 text-sm leading-snug">{t("bank.mock.body")}</p>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold">{t("bank.pick")}</legend>
        <ul className="mt-2 grid max-h-72 grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
          {BANKS.map((b) => (
            <li key={b.id}>
              <label
                className={`gh-card flex min-h-11 cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors ${
                  bankId === b.id ? "ring-2 ring-ink" : "hover:border-muted"
                }`}
              >
                <input
                  type="radio"
                  name="bank"
                  value={b.id}
                  checked={bankId === b.id}
                  onChange={() => pick(b.id)}
                  className="h-4 w-4 accent-[#15181c]"
                />
                {b.name}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {bank ? (
        <>
          <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted">
            {t("bank.script.title")}
          </h2>
          <div className="mt-2">
            <ScriptCard
              lang={lang}
              sections={[
                {
                  headingKey: "call.section.what",
                  lines: [
                    lang === "en"
                      ? `I am reporting an unauthorised transaction of ${amount || "[amount]"} on my account with ${bank.name}. I did not authorise this transaction.`
                      : `${bank.name} के मेरे खाते से ${amount || "[राशि]"} का अनधिकृत लेन-देन हुआ है. मैंने इस लेन-देन को अधिकृत नहीं किया.`,
                    lang === "en"
                      ? "I request you to invoke zero liability as per RBI's limited liability circular and freeze further debits."
                      : "मैं अनुरोध करती/करता हूँ कि RBI के सीमित दायित्व परिपत्र के अनुसार शून्य दायित्व लागू कर आगे की कटौती रोकी जाए.",
                  ],
                },
                {
                  headingKey: "call.section.details",
                  lines: [
                    c.utr ? `UTR: ${c.utr}` : "",
                    c.counterpartyHandle
                      ? `${lang === "en" ? "Beneficiary identifier" : "लाभार्थी पहचान"}: ${c.counterpartyHandle}`
                      : "",
                  ].filter(Boolean),
                },
              ]}
              footer={
                bank.type === "card_network" ? null : (
                  <a
                    href={`tel:${bank.mockFraudLine}`}
                    className="ml-auto inline-flex h-11 items-center rounded-sm border border-critical px-3 text-xs font-semibold text-critical hover:bg-critical/5"
                  >
                    ☎ {bank.mockFraudLine} ({lang === "en" ? "mock number" : "मॉक नंबर"})
                  </a>
                )
              }
            />
          </div>

          <section className="mt-5 rounded-sm border border-hairline bg-card p-4">
            <h2 className="text-sm font-semibold">{t("bank.rbi.title")}</h2>
            <p className="mt-2 text-sm leading-snug text-muted">{t("bank.rbi.body")}</p>
          </section>

          <section className="mt-3 rounded-sm border border-hairline bg-card p-4">
            <h2 className="text-sm font-semibold">{t("bank.email.title")}</h2>
            <p className="mt-2 text-sm leading-snug text-muted">{t("bank.email.body")}</p>
          </section>

          <button
            type="button"
            onClick={() =>
              updateCase({
                actions: {
                  ...c.actions,
                  bank: "done",
                },
                timeline: [
                  ...c.timeline,
                  {
                    at: Date.now(),
                    kind: "action_done",
                    label: {
                      en: `Informed the bank (${bank.name})`,
                      hi: `बैंक को सूचित किया (${bank.name})`,
                    },
                  },
                ],
              })
            }
            className={`mt-6 h-14 w-full px-5 text-base ${
              c.actions.bank === "done"
                ? "gh-btn gh-btn-outline border-stable font-semibold text-stable"
                : "gh-btn gh-btn-success"
            }`}
          >
            {c.actions.bank === "done" ? t("plan.done") + " ✓" : t("bank.markdone")}
          </button>
        </>
      ) : (
        <p className="mt-6 rounded-sm bg-card border border-hairline p-4 text-sm text-muted">
          {t("bank.none")}
        </p>
      )}
    </Container>
  );
}
