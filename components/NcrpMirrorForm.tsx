"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { fakeAadhaar, fakePan } from "../lib/synthetic";
import { fileComplaintSchema } from "../lib/validation";
import { formatDate, formatTime } from "../lib/clock";
import { useT } from "../lib/use-t";
import type { Lang } from "../lib/types";
import { Field, inputCls } from "./DescriptionComposer";

type TabKey = "incident" | "suspect" | "complainant" | "preview";

const TABS: { key: TabKey; labelKey: Parameters<ReturnType<typeof useT>["t"]>[0] }[] = [
  { key: "incident", labelKey: "report.tab.incident" },
  { key: "suspect", labelKey: "report.tab.suspect" },
  { key: "complainant", labelKey: "report.tab.complainant" },
  { key: "preview", labelKey: "report.tab.preview" },
];

const MAX_EVIDENCE = 10 * 1024 * 1024;
const MAX_ID = 5 * 1024 * 1024;

export interface MirrorPrefill {
  caseId: string;
  ncrpCategory: string;
  ncrpSubCategory: string;
  fraudAt: number;
  amount: number | null;
  utr: string | null;
  handle: string | null;
  description: string;
  onBehalfOf: "self" | "someone_else";
  lang: Lang;
}

export function NcrpMirrorForm({
  prefill,
  onSuccess,
}: {
  prefill: MirrorPrefill;
  onSuccess: (ackNo: string, filedAt: number) => void;
}) {
  const { t } = useT();
  const [tab, setTab] = useState<TabKey>("incident");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [ack, setAck] = useState<{ no: string; at: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileNames, setFileNames] = useState<{ id?: string; evidence?: string }>({});

  const [fields, setFields] = useState({
    state: "",
    district: "",
    suspectName: "",
    website: "",
    beneficiaryAccount: "",
    complainantName: "",
    mobile: "",
    email: "",
    onBehalfOf: prefill.onBehalfOf as "self" | "someone_else",
    idType: "aadhaar" as "aadhaar" | "pan",
    declarationAccepted: false,
    utr: prefill.utr ?? "",
    description: prefill.description,
  });

  // Synthetic identity: generated to be provably invalid; regenerated per type.
  const syntheticId = useMemo(
    () => (fields.idType === "aadhaar" ? fakeAadhaar() : fakePan()),
    [fields.idType],
  );

  const set = (k: keyof typeof fields, v: string | boolean) =>
    setFields((f) => ({ ...f, [k]: v }));

  const checkFile = (
    input: HTMLInputElement,
    max: number,
    errKey: string,
  ): boolean => {
    const f = input.files?.[0];
    if (!f) return true;
    const typeOk = ["image/jpeg", "image/png"].includes(f.type);
    if (!typeOk || f.size > max) {
      setErrors((e) => ({ ...e, [errKey]: t("report.err.required") }));
      return false;
    }
    setErrors((e) => {
      const rest = { ...e };
      delete rest[errKey];
      return rest;
    });
    return true; // validated, then discarded — never uploaded
  };

  const submit = async () => {
    setServerError(null);
    const payload = {
      caseId: prefill.caseId,
      scamTypeId: prefill.ncrpSubCategory,
      ncrpCategory: prefill.ncrpCategory,
      ncrpSubCategory: prefill.ncrpSubCategory,
      fraudAt: prefill.fraudAt,
      amount: prefill.amount ?? 1,
      utr: /^\d{12}$/.test(fields.utr) ? fields.utr : null,
      handle: prefill.handle,
      suspectName: fields.suspectName || null,
      description: fields.description,
      complainantName: fields.complainantName,
      complainantMobile: fields.mobile,
      complainantEmail: fields.email,
      onBehalfOf: fields.onBehalfOf,
      declarationAccepted: fields.declarationAccepted === true,
    };
    const parsed = fileComplaintSchema.safeParse(payload);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        map[String(issue.path[0])] = issue.message.includes("200")
          ? t("report.err.description.short")
          : issue.message.includes("12")
            ? t("report.err.utr")
            : t("report.err.required");
      }
      if (!/^\d{10}$/.test(fields.mobile)) map.complainantMobile = t("report.err.mobile");
      setErrors(map);
      const keys = Object.keys(map);
      const firstTabWithIssue = keys[0];
      // A missing declaration must keep the user on Preview — the checkbox
      // and its error both live here; yanking them to another tab hides it.
      if (keys.length === 1 && firstTabWithIssue === "declarationAccepted") return;
      if (["description", "fraudAt", "amount", "utr", "state"].includes(firstTabWithIssue))
        setTab("incident");
      else if (firstTabWithIssue === "handle") setTab("suspect");
      else setTab("complainant");
      return;
    }
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 900)); // feels real; nothing stored
      const res = await fetch("/api/file-complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message || t("report.err.server"));
      }
      const data = await res.json();
      setAck({ no: data.acknowledgementNo, at: data.filedAt });
      onSuccess(data.acknowledgementNo, data.filedAt);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : t("report.err.server"));
    } finally {
      setSubmitting(false);
    }
  };

  if (ack) {
    return (
      <div className="rounded-sm border border-stable bg-card p-6 text-center">
        <p className="text-4xl" aria-hidden>
          ✓
        </p>
        <h2 className="mt-2 text-xl font-semibold text-stable">
          {t("report.success.title")}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          {t("report.success.body")}
        </p>
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted">
          {t("report.ack")}
        </p>
        <p className="tnum mt-1 font-data text-3xl font-medium tracking-wide select-all">
          {ack.no}
        </p>
        <Link
          href={`/case/${prefill.caseId}`}
          className="mt-6 inline-flex h-12 items-center rounded-sm bg-ink px-5 text-sm font-semibold text-clinical hover:bg-black"
        >
          {t("report.success.next")} →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-hairline bg-card">
      <h3 className="border-b border-hairline px-4 py-3 text-sm font-semibold">
        {t("report.form.title")}
      </h3>

      {/* Tabs — same four sections, in order, as the real portal */}
      <div role="tablist" aria-label={t("report.form.title")} className="grid grid-cols-2 border-b border-hairline sm:grid-cols-4">
        {TABS.map((tb, i) => (
          <button
            key={tb.key}
            role="tab"
            aria-selected={tab === tb.key}
            onClick={() => setTab(tb.key)}
            className={`min-h-11 px-2 py-2 text-xs font-medium sm:text-[13px] ${
              tab === tb.key
                ? "border-b-2 border-critical font-semibold text-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            {i + 1}. {t(tb.labelKey)}
          </button>
        ))}
      </div>

      <div className="space-y-4 p-4" role="tabpanel">
        {tab === "incident" && (
          <>
            <Field label={t("report.field.category")}>
              <output className={`block ${inputCls} bg-clinical`}>
                {prefill.ncrpCategory}
              </output>
            </Field>
            <Field label={t("report.field.subcategory")} help={t("report.field.prefilled")}>
              <output className={`block ${inputCls} bg-clinical`}>
                {prefill.ncrpSubCategory}
              </output>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t("report.field.date")}>
                <input
                  type="text"
                  readOnly
                  value={formatDate(prefill.fraudAt, prefill.lang)}
                  className={`${inputCls} bg-clinical`}
                />
              </Field>
              <Field label={t("report.field.time")}>
                <input
                  type="text"
                  readOnly
                  value={formatTime(prefill.fraudAt, prefill.lang)}
                  className={`${inputCls} bg-clinical`}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t("report.field.state")}>
                <input
                  className={inputCls}
                  value={fields.state}
                  onChange={(e) => set("state", e.target.value)}
                />
              </Field>
              <Field label={t("report.field.district")}>
                <input
                  className={inputCls}
                  value={fields.district}
                  onChange={(e) => set("district", e.target.value)}
                />
              </Field>
            </div>
            <Field
              label={t("report.field.description")}
              help={t("report.field.description.help")}
            >
              <textarea
                rows={7}
                className={`${inputCls} h-auto py-2 font-data text-[13px] leading-relaxed`}
                value={fields.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>
            {errors.description && (
              <p role="alert" className="text-xs font-medium text-critical">
                {fields.description.length < 200
                  ? t("report.err.description.short")
                  : t("report.err.description.chars")}
              </p>
            )}
          </>
        )}

        {tab === "suspect" && (
          <>
            <Field label={t("report.field.suspect.name")}>
              <input
                className={inputCls}
                value={fields.suspectName}
                onChange={(e) => set("suspectName", e.target.value)}
              />
            </Field>
            <Field label={t("report.field.suspect.handle")}>
              <input
                readOnly
                value={prefill.handle ?? ""}
                className={`${inputCls} bg-clinical`}
              />
            </Field>
            <Field label={t("report.field.suspect.website")}>
              <input
                className={inputCls}
                value={fields.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </Field>
            <Field label={t("report.field.suspect.account")}>
              <input
                className={inputCls}
                value={fields.beneficiaryAccount}
                onChange={(e) => set("beneficiaryAccount", e.target.value)}
              />
            </Field>
          </>
        )}

        {tab === "complainant" && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t("report.field.name")}>
                <input
                  className={inputCls}
                  value={fields.complainantName}
                  onChange={(e) => set("complainantName", e.target.value)}
                />
              </Field>
              <Field label={t("report.field.behalf")}>
                <select
                  className={inputCls}
                  value={fields.onBehalfOf}
                  onChange={(e) =>
                    set("onBehalfOf", e.target.value as "self" | "someone_else")
                  }
                >
                  <option value="self">{t("report.behalf.self")}</option>
                  <option value="someone_else">{t("report.behalf.other")}</option>
                </select>
              </Field>
              <Field label={t("report.field.mobile")} error={errors.complainantMobile}>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  className={`tnum ${inputCls}`}
                  value={fields.mobile}
                  onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                />
              </Field>
              <Field label={t("report.field.email")} error={errors.complainantEmail}>
                <input
                  type="email"
                  className={inputCls}
                  value={fields.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t("report.field.idtype")}>
                <select
                  className={inputCls}
                  value={fields.idType}
                  onChange={(e) =>
                    set("idType", e.target.value as "aadhaar" | "pan")
                  }
                >
                  <option value="aadhaar">Aadhaar</option>
                  <option value="pan">PAN</option>
                </select>
              </Field>
              <Field label={t("report.field.idnumber")} help={t("report.id.synthetic")}>
                <input
                  readOnly
                  className={`tnum ${inputCls} bg-clinical font-data`}
                  value={syntheticId}
                />
              </Field>
            </div>
            <fieldset className="rounded-md border-2 border-dashed border-muted/40 bg-clinical/30 p-4 pt-3">
              <legend className="px-1 text-sm font-semibold">{t("report.upload.title")}</legend>
              <p className="mb-3 text-xs leading-snug text-muted">{t("report.upload.note")}</p>
              <div className="space-y-2">
                {([
                  { key: "id" as const, label: t("report.upload.id"), hint: t("report.upload.hint.id"), errKey: "uploadId", accept: "image/jpeg,image/png", max: MAX_ID },
                  { key: "evidence" as const, label: t("report.upload.evidence"), hint: t("report.upload.hint.evidence"), errKey: "uploadEvidence", accept: "image/jpeg,image/png", max: MAX_EVIDENCE },
                ] as const).map((row) => (
                  <label
                    key={row.key}
                    className={`gh-card flex min-h-12 cursor-pointer items-center gap-3 px-3 py-2 transition-colors ${
                      errors[row.errKey]
                        ? "border-critical"
                        : fileNames[row.key]
                          ? "border-stable"
                          : "hover:border-muted"
                    }`}
                  >
                    <input
                      type="file"
                      accept={row.accept}
                      multiple={row.key === "evidence"}
                      className="sr-only"
                      onChange={(e) => {
                        const input = e.currentTarget;
                        if (row.key === "id") {
                          setFileNames((n) => ({ ...n, id: input.files?.[0]?.name }));
                        } else {
                          const count = input.files?.length ?? 0;
                          setFileNames((n) => ({
                            ...n,
                            evidence: count > 0
                              ? `${count} file${count > 1 ? "s" : ""}`
                              : undefined,
                          }));
                        }
                        checkFile(input, row.max, row.errKey);
                      }}
                    />
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-xs font-semibold ${
                        fileNames[row.key]
                          ? "bg-stable/10 text-stable"
                          : "bg-muted/10 text-muted"
                      }`}
                    >
                      {fileNames[row.key] ? "✓" : row.key === "id" ? "ID" : "E"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {fileNames[row.key] || row.label}
                      </p>
                      {errors[row.errKey] ? (
                        <p className="text-xs text-critical">{errors[row.errKey]}</p>
                      ) : (
                        <p className="text-xs text-muted">{row.hint}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {tab === "preview" && (
          <>
            <dl className="space-y-2 rounded-sm bg-clinical p-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{t("report.field.category")}</dt>
                <dd className="font-medium">{prefill.ncrpCategory}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{t("report.field.subcategory")}</dt>
                <dd className="text-right font-medium">{prefill.ncrpSubCategory}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{t("report.field.date")}</dt>
                <dd className="font-medium">{formatDate(prefill.fraudAt, prefill.lang)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">{t("report.amount.label")}</dt>
                <dd className="tnum font-data font-medium">
                  Rs {(prefill.amount ?? 0).toLocaleString("en-IN")}
                </dd>
              </div>
            </dl>
            <label className="flex min-h-11 cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={fields.declarationAccepted}
                onChange={(e) => set("declarationAccepted", e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0"
              />
              <span>{t("report.declaration")}</span>
            </label>
            {errors.declarationAccepted && (
              <p role="alert" className="text-xs font-medium text-critical">
                {t("report.err.required")}
              </p>
            )}
            {serverError && (
              <p role="alert" className="rounded-sm border border-critical bg-critical/5 p-3 text-sm text-critical">
                {serverError}
              </p>
            )}
            <button
              type="button"
              disabled={submitting}
              onClick={submit}
              className="h-12 w-full rounded-sm bg-critical px-5 text-base font-semibold text-white hover:bg-[#a51818] disabled:opacity-60"
            >
              {submitting ? t("report.submitting") : t("report.submit")}
            </button>
          </>
        )}
      </div>

      <div className="flex gap-3 border-t border-hairline px-4 py-4">
        {tab !== "incident" && (
          <button
            type="button"
            onClick={() => {
              const i = TABS.findIndex((x) => x.key === tab);
              if (i > 0) setTab(TABS[i - 1].key);
            }}
            className="gh-btn gh-btn-outline h-12 flex-1 text-sm sm:flex-none sm:px-6"
          >
            <span aria-hidden>←</span> {t("report.nav.back")}
          </button>
        )}
        {tab !== "preview" && (
          <button
            type="button"
            onClick={() => {
              const i = TABS.findIndex((x) => x.key === tab);
              if (i < TABS.length - 1) setTab(TABS[i + 1].key);
            }}
            className="gh-btn gh-btn-primary h-12 flex-1 text-sm"
          >
            {t("report.nav.next")}: {t(TABS[TABS.findIndex((x) => x.key === tab) + 1].labelKey)}{" "}
            <span aria-hidden>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
