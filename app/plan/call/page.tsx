"use client";

import Link from "next/link";
import { Container } from "../../../components/chrome";
import { EvidenceChecklist } from "../../../components/EvidenceChecklist";
import { ScriptCard } from "../../../components/ScriptCard";
import { scamTypeById } from "../../../data/scamTypes";
import { markActionDone, useCase } from "../../../lib/case-store";
import { formatRs } from "../../../lib/compose";
import { formatDate, formatTime } from "../../../lib/clock";
import { useT } from "../../../lib/use-t";

export default function CallPage() {
  const { t, lang } = useT();
  const c = useCase();

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

  const scam = scamTypeById(c.scamTypeId);
  const amountLine = c.amount != null ? `Rs ${formatRs(c.amount)}` : null;
  const whatHappened = scam
    ? scam.descriptionTemplate[lang]
        .replace("{{date}}", formatDate(c.fraudAt, lang))
        .replace("{{time}}", formatTime(c.fraudAt, lang))
    : lang === "en"
      ? "Money was debited from my account without my authorisation."
      : "मेरे खाते से मेरी स्वीकृति के बिना राशि कटी.";

  return (
    <Container>
      <Link href="/plan" className="text-sm font-medium text-muted hover:text-ink">
        ← {t("call.back")}
      </Link>
      <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight">
        {t("call.title")}
      </h1>
      <p className="mt-2 text-sm text-muted">{t("call.subtitle")}</p>

      <a
        href="tel:1930"
        className="gh-btn gh-btn-danger mt-4 h-16 w-full text-xl font-bold"
      >
        <span aria-hidden>☎</span> {t("call.tel")}
      </a>

      <div className="mt-5">
        <ScriptCard
          lang={lang}
          sections={[
            {
              headingKey: "call.section.intro",
              lines: [
                lang === "en"
                  ? "Namaste. I want to report an online financial fraud that happened today. Please register my complaint and freeze the beneficiary account."
                  : "नमस्ते. मुझे आज हुई ऑनलाइन वित्तीय धोखाधड़ी की शिकायत दर्ज करनी है. कृपया मेरी शिकायत दर्ज करें और लाभार्थी खाता फ्रीज़ करवाएँ.",
              ],
            },
            {
              headingKey: "call.section.what",
              lines: [
                whatHappened,
                amountLine
                  ? `${lang === "en" ? "The amount is" : "राशि है"} ${amountLine}.`
                  : "",
              ].filter(Boolean),
            },
            {
              headingKey: "call.section.details",
              lines: [
                c.utr
                  ? `${lang === "en" ? "Transaction reference (UTR)" : "लेन-देन संदर्भ"}: ${c.utr}`
                  : "",
                c.counterpartyHandle
                  ? `${lang === "en" ? "Other party's identifier" : "दूसरे पक्ष का पहचान विवरण"}: ${c.counterpartyHandle}`
                  : "",
              ].filter(Boolean),
            },
            {
              headingKey: "call.section.ask",
              lines: [
                lang === "en"
                  ? "Please place the beneficiary account on hold under the CFCFRMS process so the amount can be restored to my account."
                  : "कृपया CFCFRMS प्रक्रिया के तहत लाभार्थी खाते को रोकें ताकि राशि मेरे खाते में वापस आ सके.",
              ],
            },
          ]}
        />
      </div>

      <ul className="mt-5 space-y-2 rounded-sm border border-hairline bg-card p-4 text-sm leading-snug">
        <li>• {t("call.tip.1")}</li>
        <li>• {t("call.tip.2")}</li>
        <li>• {t("call.tip.3")}</li>
      </ul>

      {scam && (
        <div className="mt-4">
          <EvidenceChecklist ids={scam.evidence} />
        </div>
      )}

      <button
        type="button"
        onClick={() =>
          markActionDone("call1930", {
            en: "Called 1930",
            hi: "1930 पर कॉल की",
          })
        }
        className={`mt-6 h-14 w-full px-5 text-base ${
          c.actions.call1930 === "done"
            ? "gh-btn gh-btn-outline border-stable font-semibold text-stable"
            : "gh-btn gh-btn-success"
        }`}
      >
        {c.actions.call1930 === "done" ? t("plan.done") + " ✓" : t("plan.markdone")}
      </button>
    </Container>
  );
}
