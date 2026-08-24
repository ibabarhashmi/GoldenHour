"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "../../../components/chrome";
import type { Bank } from "../../../lib/types";
import type { DictKey } from "../../../lib/i18n";
import { ScriptCard } from "../../../components/ScriptCard";
import { BANKS, UNIVERSAL_NUMBERS, bankById } from "../../../data/banks";
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
  const groups: { type: Bank["type"]; titleKey: DictKey; items: Bank[] }[] = [
    { type: "bank", titleKey: "bank.group.bank", items: BANKS.filter((b) => b.type === "bank") },
    { type: "wallet", titleKey: "bank.group.wallet", items: BANKS.filter((b) => b.type === "wallet") },
    { type: "card_network", titleKey: "bank.group.card", items: BANKS.filter((b) => b.type === "card_network") },
  ];
  const telHref = (s: string) => `tel:${s.replace(/[^\d+]/g, "")}`;
  const dialable = (s: string) => /^[\d\s()+-]+$/.test(s) && s.replace(/\D/g, "").length >= 3;

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

      <div role="note" className="mt-4 rounded-sm border border-stable/40 bg-stable/5 p-3">
        <p className="text-sm font-semibold text-stable">{t("bank.verified.title")}</p>
        <p className="mt-1 text-sm leading-snug">{t("bank.verified.body")}</p>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold">{t("bank.pick")}</legend>
        <div className="mt-2 max-h-80 space-y-4 overflow-y-auto pr-1">
          {groups.map((g) => (
            <div key={g.type}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                {t(g.titleKey)}
              </p>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {g.items.map((b) => (
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
            </div>
          ))}
        </div>
      </fieldset>

      {bank ? (
        <>
          <section className="mt-6 rounded-sm border border-hairline bg-card p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-base font-semibold">{bank.name}</h2>
              <a
                href={bank.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="gh-link text-xs"
              >
                {t("bank.source.label")} ↗
              </a>
            </div>
            {bank.note && (
              <p className="mt-2 text-xs leading-snug text-muted">{bank.note[lang]}</p>
            )}
            <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-critical">
              {t("bank.fraud.label")}
            </h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {bank.fraudLines.map((n) =>
                dialable(n) ? (
                  <a key={n} href={telHref(n)} className="gh-btn gh-btn-outline h-10 border-critical px-3 text-sm font-semibold text-critical hover:bg-critical/5">
                    ☎ {n}
                  </a>
                ) : (
                  <span key={n} className="px-1 py-2 text-sm">{n}</span>
                ),
              )}
            </div>
            <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
              {t("bank.general.label")}
            </h3>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              {bank.generalLines.map((n) =>
                dialable(n) ? (
                  <a key={n} href={telHref(n)} className="gh-link tnum text-sm">
                    ☎ {n}
                  </a>
                ) : (
                  <span key={n} className="text-sm text-muted">{n}</span>
                ),
              )}
            </div>
            {bank.emails.length > 0 && (
              <>
                <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
                  {t("bank.email.label")}
                </h3>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  {bank.emails.map((e) => (
                    <a key={e} href={`mailto:${e}`} className="gh-link break-all text-sm">
                      ✉ {e}
                    </a>
                  ))}
                </div>
              </>
            )}
          </section>

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
                bank.fraudLines.some(dialable) ? (
                  <a
                    href={telHref(bank.fraudLines.find(dialable)!)}
                    className="ml-auto inline-flex h-11 items-center rounded-sm border border-critical px-3 text-xs font-semibold text-critical hover:bg-critical/5"
                  >
                    ☎ {bank.fraudLines.find(dialable)}
                  </a>
                ) : null
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

          <section className="mt-5 rounded-sm border border-hairline bg-card p-4">
            <h2 className="text-sm font-semibold">{t("bank.universal.title")}</h2>
            <ul className="mt-3 divide-y divide-hairline">
              {UNIVERSAL_NUMBERS.map((u) => (
                <li key={u.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {u.name[lang]}
                      {u.url && (
                        <>
                          {" "}
                          <a href={u.url} target="_blank" rel="noreferrer" className="gh-link text-xs">
                            ↗
                          </a>
                        </>
                      )}
                    </p>
                    {u.detail && (
                      <p className="text-xs leading-snug text-muted">{u.detail[lang]}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {u.lines.map((n) => (
                      <a key={n} href={`tel:${n.replace(/[^\d+]/g, "")}`} className="gh-link tnum font-data text-sm font-semibold">
                        ☎ {n}
                      </a>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
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
