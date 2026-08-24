"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "../../components/chrome";
import { SCAM_TYPES, scamTypeById } from "../../data/scamTypes";
import { updateCase, useCase } from "../../lib/case-store";
import { useT } from "../../lib/use-t";

export default function TriagePage() {
  const { t, lang } = useT();
  const router = useRouter();
  const c = useCase();
  const [freeText, setFreeText] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!c) {
    return (
      <Container>
        <div className="pt-10 text-center">
          <h1 className="text-xl font-semibold">{t("state.empty.title")}</h1>
          <p className="mt-2 text-sm text-muted">{t("state.empty.body")}</p>
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

  const pick = (id: string) => {
    const st = scamTypeById(id);
    updateCase({ scamTypeId: id });
    void st; // sub-category is derived at render time from the id — single source of truth
    router.push("/plan");
  };

  const classify = async () => {
    setBusy(true);
    setFailed(false);
    try {
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: freeText, lang }),
      });
      const data = await res.json();
      if (data?.scamTypeId) {
        pick(data.scamTypeId);
        return;
      }
      setFailed(true); // includes low-confidence refusals — never guess for the user
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container>
      <h1 className="text-2xl font-semibold leading-tight tracking-tight">
        {t("triage.title")}
      </h1>
      <p className="mt-2 text-sm text-muted">{t("triage.subtitle")}</p>

      <section className="mt-5 rounded-sm border border-hairline bg-card p-4">
        <label htmlFor="freetext" className="block text-sm font-semibold">
          {t("triage.freetext.title")}
        </label>
        <textarea
          id="freetext"
          rows={3}
          maxLength={1000}
          value={freeText}
          onChange={(e) => {
            setFreeText(e.target.value);
            setFailed(false);
          }}
          placeholder={t("triage.freetext.placeholder")}
          className="gh-input mt-2"
        />
        <button
          type="button"
          disabled={busy || freeText.trim().length < 3}
          onClick={classify}
          className="gh-btn gh-btn-primary mt-3 h-12 w-full px-4 text-sm"
        >
          {busy ? t("triage.classifying") : t("triage.classify")}
        </button>
        {failed && (
          <p role="alert" className="mt-2 rounded-sm border border-critical bg-critical/5 p-3 text-xs leading-snug text-critical">
            {t("triage.classify.fail")}
          </p>
        )}
      </section>

      <h2 className="mt-7 text-xs font-semibold uppercase tracking-wide text-muted">
        {t("triage.tiles.title")}
      </h2>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SCAM_TYPES.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => pick(s.id)}
              className="gh-card gh-card-hover flex min-h-16 w-full flex-col items-start p-3 text-left"
            >
              <span className="text-[15px] font-medium leading-snug">
                {s.label[lang]}
              </span>
              <span className="mt-0.5 text-xs leading-snug text-muted">
                {s.hint[lang]}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Container>
  );
}
