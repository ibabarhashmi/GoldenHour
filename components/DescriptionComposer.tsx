"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  APPROVAL_OPTIONS,
  HOW_OPTIONS,
  WHAT_OPTIONS,
  composeDescription,
} from "../lib/compose";
import { useT } from "../lib/use-t";
import { descriptionSchema } from "../lib/validation";
import type { NarrativeSlots } from "../lib/types";
import type { DictKey } from "../lib/i18n";

const HOW_IDS = Object.keys(HOW_OPTIONS);
const WHAT_IDS = Object.keys(WHAT_OPTIONS);
const APPROVAL_IDS = Object.keys(APPROVAL_OPTIONS);

export interface ComposerExtras {
  amount: string;
  utr: string;
  handle: string;
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-11 rounded-sm border px-3 py-2 text-sm font-medium transition-colors ${
        selected
          ? "border-ink bg-ink text-clinical"
          : "border-hairline bg-card hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  help,
  error,
  children,
}: {
  label: string;
  help?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium">
        <span>{label}</span>
        {help && (
          <span className="mt-0.5 block text-xs font-normal text-muted">{help}</span>
        )}
        {children}
      </label>
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-critical">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls = "gh-input mt-1";

/**
 * Three tap-rows assemble the portal's hardest field. Deterministic text is
 * what renders; an optional model-polished variant appears as a choice, never
 * a replacement, and never blocks the UI (2.5s server-side timeout).
 */
export function DescriptionComposer({
  slots,
  setSlots,
  extras,
  setExtras,
  bankName,
  fraudAt,
  onDescriptionChange,
}: {
  slots: NarrativeSlots;
  setSlots: (s: NarrativeSlots) => void;
  extras: ComposerExtras;
  setExtras: (e: ComposerExtras) => void;
  bankName: string | null;
  fraudAt: number;
  onDescriptionChange: (d: string) => void;
}) {
  const { t, lang } = useT();
  const [polishResult, setPolishResult] = useState<{
    key: string;
    text: string;
  } | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [polishing, setPolishing] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const composed = useMemo(
    () =>
      composeDescription({
        how: slots.how,
        what: slots.what,
        approved: slots.approved,
        amount: extras.amount ? Number(extras.amount) : null,
        bank: bankName,
        utr: /^\d{12}$/.test(extras.utr) ? extras.utr : null,
        handle: extras.handle || null,
        fraudAt,
        lang,
      }),
    [slots, extras, bankName, fraudAt, lang],
  );

  // A polish candidate is only visible while it matches the CURRENT inputs —
  // derived, so stale candidates vanish without resetting state.
  const requestKey = JSON.stringify([
    slots.how,
    slots.what,
    slots.approved,
    extras.amount,
    extras.utr,
    extras.handle,
    bankName,
    fraudAt,
    lang,
  ]);
  const polished =
    polishResult && polishResult.key === requestKey ? polishResult.text : null;

  // Deterministic text is what renders. A model-polished variant only swaps
  // in if the user accepts it.
  const finalText =
    accepted && polished && polished !== composed ? polished : composed;

  useEffect(() => {
    onDescriptionChange(finalText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalText]);

  // Optional AI polish: fires after the user pauses, times out fast, never blocks.
  useEffect(() => {
    if (!slots.how || !slots.what) return;
    const delay = setTimeout(async () => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      try {
        setPolishing(true);
        const res = await fetch("/api/draft", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ac.signal,
          body: JSON.stringify({
            how: slots.how,
            what: slots.what,
            approved: slots.approved,
            amount: extras.amount ? Number(extras.amount) : null,
            bank: bankName,
            utr: /^\d{12}$/.test(extras.utr) ? extras.utr : null,
            handle: extras.handle || null,
            fraudAt,
            lang,
          }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.polished?.description) {
          setPolishResult({ key: requestKey, text: data.polished.description });
        }
      } catch {
        /* offline or timeout — deterministic text stays */
      } finally {
        setPolishing(false);
      }
    }, 700);
    return () => clearTimeout(delay);
    // requestKey already encodes every input the fetch depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey, slots.how, slots.what]);

  const ok = finalText.length >= 200;

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-sm font-semibold">{t("report.q.how")}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {HOW_IDS.map((id) => (
            <Chip key={id} selected={slots.how === id} onClick={() => setSlots({ ...slots, how: id })}>
              {t((`report.how.${id}`) as DictKey)}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold">{t("report.q.what")}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {WHAT_IDS.map((id) => (
            <Chip key={id} selected={slots.what === id} onClick={() => setSlots({ ...slots, what: id })}>
              {t((`report.what.${id}`) as DictKey)}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold">{t("report.q.approved")}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {APPROVAL_IDS.map((id) => (
            <Chip key={id} selected={slots.approved === id} onClick={() => setSlots({ ...slots, approved: id })}>
              {t((`report.approved.${id}`) as DictKey)}
            </Chip>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t("report.amount.label")} help={undefined}>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            className={inputCls}
            value={extras.amount}
            onChange={(e) => setExtras({ ...extras, amount: e.target.value })}
          />
        </Field>
        <Field label={t("report.utr.label")}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={12}
            className={`tnum ${inputCls} font-data`}
            value={extras.utr}
            onChange={(e) =>
              setExtras({ ...extras, utr: e.target.value.replace(/\D/g, "").slice(0, 12) })
            }
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label={t("report.handle.label")}>
            <input
              type="text"
              className={inputCls}
              value={extras.handle}
              onChange={(e) => setExtras({ ...extras, handle: e.target.value })}
            />
          </Field>
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-semibold">{t("report.preview")}</h3>
          <p
            aria-live="polite"
            className={`tnum font-data text-sm ${
              ok ? "text-stable" : "font-semibold text-critical"
            }`}
          >
            {ok
              ? t("report.charcount.ok", { n: finalText.length })
              : t("report.charcount", { n: finalText.length })}
          </p>
        </div>
        {ok && !descriptionSchema.safeParse(finalText).success && (
          <p role="alert" className="mt-2 text-xs font-medium text-critical">
            {t("report.err.description.chars")}
          </p>
        )}
        <p className="mt-2 whitespace-pre-wrap rounded-sm border border-hairline bg-card px-4 py-3 font-data text-[13px] leading-relaxed">
          {finalText}
        </p>
        {(polished && polished !== composed) || polishing ? (
          <div className="mt-2 flex items-center gap-3">
            {polishing ? (
              <span className="text-xs text-muted" role="status">
                {t("report.improving")}
              </span>
            ) : accepted ? (
              <span className="text-xs text-stable">{t("report.polished.note")}</span>
            ) : (
              <button
                type="button"
                onClick={() => setAccepted(true)}
                className="min-h-11 rounded-sm border border-ink bg-card px-3 text-xs font-medium hover:bg-clinical"
              >
                {t("report.improve")}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { Field, inputCls };
