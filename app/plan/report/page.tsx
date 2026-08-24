"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "../../../components/chrome";
import {
  DescriptionComposer,
  type ComposerExtras,
} from "../../../components/DescriptionComposer";
import { NcrpMirrorForm } from "../../../components/NcrpMirrorForm";
import { scamTypeById } from "../../../data/scamTypes";
import { bankById } from "../../../data/banks";
import { readCase, updateCase, useCase } from "../../../lib/case-store";
import { useT } from "../../../lib/use-t";
import { fakeUtr } from "../../../lib/synthetic";

export default function ReportPage() {
  const { t, lang } = useT();
  const c = useCase();
  const [slots, setSlots] = useState(c?.narrativeSlots ?? { how: null, what: null, approved: null });
  const [extras, setExtras] = useState<ComposerExtras>({
    amount: c?.amount != null ? String(c.amount) : "",
    utr: c?.utr ?? "",
    handle: c?.counterpartyHandle ?? "",
  });
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Adopt whatever the case already knows, once, just after paint (async:
  // no setState-in-effect cascade; same pattern as the countdown band).
  useEffect(() => {
    const t0 = setTimeout(() => {
      const cur = readCase();
      if (!cur) return;
      setSlots(cur.narrativeSlots);
      setExtras({
        amount: cur.amount != null ? String(cur.amount) : "",
        utr: cur.utr ?? "",
        handle: cur.counterpartyHandle ?? "",
      });
    }, 0);
    return () => clearTimeout(t0);
  }, []);

  // Keep the store in sync as the description evolves (incl. polish swaps).
  useEffect(() => {
    if (!description) return;
    updateCase({ description });
  }, [description]);

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

  // Demo convenience: a provably-invalid UTR-shaped placeholder so the
  // description is fully populated during a judge walkthrough.
  const suggestUtr = () => setExtras({ ...extras, utr: fakeUtr() });

  const persistSlots = (next: typeof slots) => {
    setSlots(next);
    updateCase({
      narrativeSlots: next,
      ...(extras.amount ? { amount: Number(extras.amount) } : {}),
      utr: /^\d{12}$/.test(extras.utr) ? extras.utr : null,
      counterpartyHandle: extras.handle || null,
    });
  };

  return (
    <Container>
      <Link href="/plan" className="text-sm font-medium text-muted hover:text-ink">
        ← {t("call.back")}
      </Link>
      <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight">
        {t("report.title")}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {t("report.composer.sub")}{" "}
        {scam && (
          <span className="block text-xs">
            {t("triage.matched")}: <strong className="font-medium">{scam.ncrpSubCategory}</strong>
          </span>
        )}
      </p>

      <section className="mt-5 rounded-sm border border-hairline bg-card p-4">
        <h2 className="text-base font-semibold">{t("report.composer.title")}</h2>
        <div className="mt-4">
          <DescriptionComposer
            slots={slots}
            setSlots={persistSlots}
            extras={extras}
            setExtras={setExtras}
            bankName={bankById(c.bankId)?.name ?? null}
            fraudAt={c.fraudAt}
            onDescriptionChange={setDescription}
          />
        </div>
        {!c.utr && !extras.utr && (
          <button
            type="button"
            onClick={suggestUtr}
            className="gh-btn gh-btn-outline mt-3 min-h-11 px-3 text-xs font-medium text-muted hover:text-ink"
          >
            {lang === "en" ? "Use a mock UTR for this demo" : "इस डेमो के लिए मॉक UTR लगाएँ"}
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowForm(true)}
          disabled={description.length < 200}
          className="gh-btn gh-btn-danger mt-5 h-14 w-full px-5 text-lg"
        >
          {t("report.open.form")} →
        </button>
      </section>

      {showForm && (
        <section className="mt-6">
          <NcrpMirrorForm
            prefill={{
              caseId: c.id,
              ncrpCategory: scam?.ncrpCategory ?? "Online Financial Fraud",
              ncrpSubCategory:
                scam?.ncrpSubCategory ?? "UPI Related Frauds",
              fraudAt: c.fraudAt,
              amount: Number(extras.amount) || c.amount || null,
              utr: /^\d{12}$/.test(extras.utr) ? extras.utr : null,
              handle: extras.handle || null,
              description,
              onBehalfOf: c.onBehalfOf,
              lang,
            }}
            onSuccess={(ackNo, filedAt) => {
              updateCase({
                acknowledgementNo: ackNo,
                filedAt,
                actions: { ...c.actions, ncrp: "done" },
                timeline: [
                  ...c.timeline,
                  {
                    at: Date.now(),
                    kind: "filed",
                    label: {
                      en: `Filed on NCRP — ${ackNo}`,
                      hi: `NCRP पर दर्ज — ${ackNo}`,
                    },
                  },
                ],
              });
            }}
          />
        </section>
      )}
    </Container>
  );
}
