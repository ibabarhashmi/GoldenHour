"use client";

import { Container } from "../../components/chrome";
import { Stopwatch } from "../../components/Stopwatch";
import { useT } from "../../lib/use-t";

const BEFORE_TABS: { tab: string; fields: string[] }[] = [
  {
    tab: "1",
    fields: [
      "Category → find it in a 40-item list",
      "Sub-category → 7 financial-fraud options, no guidance",
      "Date of incident", "Time of incident", "State", "District",
    ],
  },
  {
    tab: "2",
    fields: [
      "Suspect name", "Suspect mobile / email / UPI", "Website or app link",
      "Bank name & beneficiary account number", "Amount lost", "UTR / transaction reference",
    ],
  },
  {
    tab: "3",
    fields: [
      "Description — minimum 200 characters, special characters rejected",
      "Upload ID (JPEG/PNG ≤ 5 MB)", "Upload evidence (≤ 10 MB)",
    ],
  },
  {
    tab: "4",
    fields: [
      "Your full name", "Mobile", "Email", "Re-enter everything for preview",
      "Captcha-style declaration", "Submit → acknowledgement number",
    ],
  },
];

const AFTER_STEPS: string[] = [
  'Tap "I\'ve been scammed" → clock starts',
  "Pick when it happened (one tap)",
  "Tap the tile that sounds right (one tap)",
  "Plan appears: call script ready, bank words ready",
  "Three taps → 200-character description writes itself",
  "Submit → acknowledgement number → tracker with real dates",
];

export default function ComparePage() {
  const { t } = useT();
  return (
    <Container wide>
      <h1 className="text-2xl font-semibold tracking-tight">{t("compare.title")}</h1>
      <p className="mt-2 text-sm text-muted">{t("compare.sub")}</p>

      <div className="mt-4">
        <Stopwatch />
        <p className="mt-2 max-w-xl text-xs leading-snug text-muted">
          {t("compare.verdict")}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="rounded-sm border border-hairline bg-card p-4">
          <h2 className="text-sm font-semibold">{t("compare.before.title")}</h2>
          <ol className="mt-3 space-y-4 text-sm">
            {BEFORE_TABS.map((tb) => (
              <li key={tb.tab}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {t("compare.before.tab", {
                    n: tb.tab,
                    tab:
                      tb.tab === "1"
                        ? t("report.tab.incident")
                        : tb.tab === "2"
                          ? t("report.tab.suspect")
                          : tb.tab === "3"
                            ? t("report.tab.complainant")
                            : t("report.tab.preview"),
                  })}
                </p>
                <ul className="mt-1.5 space-y-1 leading-snug">
                  {tb.fields.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span aria-hidden className="text-critical">✗</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <p className="tnum mt-3 font-data text-xs text-muted">≈ 15+ required inputs</p>
        </section>

        <section className="rounded-sm border-2 border-stable bg-card p-4">
          <h2 className="text-sm font-semibold text-stable">{t("compare.after.title")}</h2>
          <ol className="mt-3 space-y-2 text-sm">
            {AFTER_STEPS.map((s, i) => (
              <li key={i} className="flex gap-2 leading-snug">
                <span aria-hidden className="text-stable">✓</span>
                <span>
                  <strong className="font-medium">{t("compare.after.step", { n: i + 1 })}:</strong>{" "}
                  {s}
                </span>
              </li>
            ))}
          </ol>
          <p className="tnum mt-3 font-data text-xs text-stable">3 taps + 1 submit</p>
        </section>
      </div>
    </Container>
  );
}
