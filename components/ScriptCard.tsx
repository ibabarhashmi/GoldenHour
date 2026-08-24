"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useT } from "../lib/use-t";
import type { Lang } from "../lib/types";

export interface ScriptSection {
  headingKey: Parameters<ReturnType<typeof useT>["t"]>[0];
  lines: string[];
}

/**
 * A read-aloud script card. SpeechSynthesis is native; if the device has no
 * voice for the active language we hide the button and say so — never read
 * Hindi text in an English voice.
 */
export function ScriptCard({
  sections,
  lang,
  footer,
}: {
  sections: ScriptSection[];
  lang: Lang;
  footer?: React.ReactNode;
}) {
  const { t } = useT();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, []);

  const fullText = useMemo(
    () =>
      sections
        .map((s) => `${t(s.headingKey)}\n${s.lines.join("\n")}`)
        .join("\n\n"),
    [sections, t],
  );

  const hasVoice = voices.some((v) => v.lang.toLowerCase().startsWith(lang));

  const speak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(fullText);
    u.lang = lang === "hi" ? "hi-IN" : "en-IN";
    u.rate = 0.95;
    const voice = voices.find((v) => v.lang.toLowerCase().startsWith(lang));
    if (voice) u.voice = voice;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utterRef.current = u;
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable; the text is visible anyway */
    }
  };

  return (
    <div className="gh-card">
      <div className="whitespace-pre-wrap px-4 py-4 font-data text-[13px] leading-relaxed sm:text-sm">
        {sections.map((s, i) => (
          <section key={i} className={i > 0 ? "mt-5" : ""}>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-wide text-muted">
              {t(s.headingKey)}
            </h3>
            {s.lines.map((line, j) => (
              <p key={j} className="mt-1.5">
                {line}
              </p>
            ))}
          </section>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-hairline px-4 py-3">
        <button
          type="button"
          onClick={copy}
          className="gh-btn gh-btn-outline h-11 px-4 text-sm"
        >
          {copied ? t("call.copied") : t("call.copy")}
        </button>
        {"speechSynthesis" in window && (hasVoice || speaking) ? (
          <button
            type="button"
            onClick={speak}
            aria-pressed={speaking}
            className={`gh-btn gh-btn-outline h-11 px-4 text-sm ${speaking ? "!border-ink !bg-ink !text-white" : ""}`}
          >
            {speaking ? t("call.readaloud.stop") : t("call.readaloud")}
          </button>
        ) : (
          <span className="text-xs text-muted">{t("call.no.voice")}</span>
        )}
        {footer}
      </div>
    </div>
  );
}
