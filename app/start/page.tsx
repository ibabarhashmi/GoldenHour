"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "../../components/chrome";
import { useT } from "../../lib/use-t";
import { createCase } from "../../lib/case-store";

type Choice = "justnow" | "withinhour" | "earlier";

export default function StartPage() {
  const { t, lang } = useT();
  const router = useRouter();
  // Read at submit time — avoids useSearchParams, whose suspension broke
  // soft-navigations into this page (the login bounce bug).
  const [choice, setChoice] = useState<Choice | null>(null);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onBehalfOf =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("for") === "someone_else"
      ? "someone_else"
      : "self";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let fraudAt: number;
    if (choice === "justnow") fraudAt = Date.now();
    else if (choice === "withinhour")
      fraudAt = Date.now() - Math.floor(Math.random() * 40 + 5) * 60_000;
    else {
      if (!custom) {
        setError(t("report.err.required"));
        return;
      }
      fraudAt = new Date(custom).getTime();
      if (!Number.isFinite(fraudAt)) {
        setError(t("report.err.required"));
        return;
      }
    }
    if (fraudAt > Date.now()) {
      setError(t("start.future.error"));
      return;
    }
    if (fraudAt < Date.now() - 365 * 86_400_000) {
      setError(t("start.tooold.error"));
      return;
    }
    createCase(fraudAt, onBehalfOf, lang);
    router.push("/triage");
  };

  const radioCard = (c: Choice, label: string) => (
    <label
      key={c}
      className={`gh-card flex min-h-14 cursor-pointer items-center gap-3 px-4 py-3 text-base font-medium transition-colors ${
        choice === c ? "ring-2 ring-ink" : "hover:border-muted"
      }`}
    >
      <input
        type="radio"
        name="when"
        value={c}
        checked={choice === c}
        onChange={() => setChoice(c)}
        className="h-5 w-5 accent-[#c81e1e]"
      />
      {label}
    </label>
  );

  return (
    <Container>
      <form onSubmit={submit} className="pt-4">
        <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          {t("start.title")}
        </h1>
        <p className="mt-2 text-sm text-muted">{t("start.subtitle")}</p>

        <fieldset className="mt-6 space-y-3">
          <legend className="sr-only">{t("start.title")}</legend>
          {radioCard("justnow", t("start.justnow"))}
          {radioCard("withinhour", t("start.withinhour"))}
          {radioCard("earlier", t("start.earlier"))}
        </fieldset>

        {choice === "earlier" && (
          <label className="mt-4 block text-sm font-medium">
            <span>{t("start.time")}</span>
            <input
              type="datetime-local"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              className="gh-input mt-1 h-11"
            />
          </label>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-sm border border-critical bg-critical/5 p-3 text-sm text-critical">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!choice}
          className="gh-btn gh-btn-primary mt-6 h-14 w-full px-5 text-lg"
        >
          {t("start.continue")} →
        </button>
        <p className="mt-3 text-center text-xs text-muted">{t("start.note")}</p>
      </form>
    </Container>
  );
}
