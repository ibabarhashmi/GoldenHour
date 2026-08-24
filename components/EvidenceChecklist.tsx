"use client";

import { useState } from "react";
import { EVIDENCE_ITEMS } from "../data/evidence";
import { useT } from "../lib/use-t";

export function EvidenceChecklist({ ids }: { ids: string[] }) {
  const { t, lang } = useT();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  if (!ids.length) return null;
  return (
    <fieldset className="rounded-sm border border-hairline bg-card p-4">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">
        {t("call.tip.title")}
      </legend>
      <div className="mt-1 space-y-2">
        {ids.map((id) => {
          const item = EVIDENCE_ITEMS[id];
          if (!item) return null;
          return (
            <label
              key={id}
              className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"
            >
              <input
                type="checkbox"
                checked={!!checked[id]}
                onChange={(e) =>
                  setChecked((c) => ({ ...c, [id]: e.target.checked }))
                }
                className="h-5 w-5 shrink-0 accent-[#15703f]"
              />
              <span className={checked[id] ? "text-muted line-through" : ""}>
                {item.label[lang]}
              </span>
            </label>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted">{t("report.upload.note")}</p>
    </fieldset>
  );
}
