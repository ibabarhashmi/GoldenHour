"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetCase, setLang, useCase } from "../lib/case-store";
import { useT } from "../lib/use-t";
import type { Lang } from "../lib/types";
import { JourneySteps } from "./JourneySteps";

export function MockBanner() {
  const { t } = useT();
  return (
    <div
      role="note"
      className="w-full bg-ink px-3 py-1.5 text-center text-[11px] font-medium leading-snug tracking-wide text-clinical sm:text-xs"
    >
      {t("mock.banner")}
    </div>
  );
}

export function OfflineBanner() {
  const { t } = useT();
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (!offline) return null;
  return (
    <div
      role="status"
      className="w-full bg-urgent px-3 py-1.5 text-center text-xs font-semibold text-white"
    >
      {t("offline.banner")}
    </div>
  );
}

export function LangToggle({ className = "" }: { className?: string }) {
  const { t, lang } = useT();
  const next: Lang = lang === "en" ? "hi" : "en";
  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      className={`gh-btn gh-btn-outline h-11 min-w-24 px-3 text-sm ${className}`}
      aria-label={next === "hi" ? "Switch language to Hindi" : "भाषा बदलें English"}
    >
      <span aria-hidden>🌐</span>
      {t("lang.toggle")}
    </button>
  );
}

export function StartOverButton() {
  const { t } = useT();
  const router = useRouter();
  return (
    <button
      type="button"
      className="gh-link gh-link--quiet text-xs"
      onClick={() => {
        if (window.confirm(t("start.over.confirm"))) {
          resetCase();
          router.push("/");
        }
      }}
    >
      {t("start.over")}
    </button>
  );
}

function Wordmark() {
  const { t } = useT();
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label={t("app.name")}>
      {/* Emblem: a shield carrying the draining clock */}
      <svg
        aria-hidden
        width="30"
        height="34"
        viewBox="0 0 30 34"
        className="shrink-0"
      >
        <path
          d="M15 1 L28 5.5 V16 C28 24.5 22.5 30.4 15 33 C7.5 30.4 2 24.5 2 16 V5.5 Z"
          fill="#171a20"
        />
        <path
          d="M15 8 V17 L21 20.5"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="15" cy="17" r="1.6" fill="#c81e1e" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight">
          {t("app.name")}
        </span>
        <span className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.14em] text-muted sm:block">
          {t("app.tagline")}
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const { t } = useT();
  return (
    <>
      <a href="#main" className="skip-link">
        {t("skip.to.content")}
      </a>
      <MockBanner />
      <OfflineBanner />
      <header className="sticky top-0 z-20 bg-card shadow-card">
        <div className="mx-auto flex h-16 w-full max-w-2xl items-center justify-between gap-3 px-4">
          <Wordmark />
          <LangToggle />
        </div>
        <JourneySteps />
        <div aria-hidden className="gh-tricolor" />
      </header>
    </>
  );
}

export function Footer() {
  const { t } = useT();
  return (
    <>
      <footer className="mt-auto border-t border-hairline bg-card">
        <div className="mx-auto w-full max-w-2xl space-y-3 px-4 py-6 text-sm">
          <a href="tel:1930" className="gh-btn gh-btn-outline h-11 w-full text-base">
            ☎ 1930
          </a>
          <p className="text-xs leading-relaxed text-muted">{t("footer.note")}</p>
          <div className="flex items-center justify-between border-t border-hairline pt-3">
            <nav className="flex items-center gap-4" aria-label="Footer">
              <Link href="/about" className="gh-link gh-link--quiet text-xs">
                {t("landing.about.link")}
              </Link>
              <Link href="/compare" className="gh-link gh-link--quiet text-xs">
                {t("compare.title")}
              </Link>
            </nav>
            <StartOverButton />
          </div>
        </div>
      </footer>
      <footer className="site-footer">
        <p>
          Built by{" "}
          <a
            href="https://github.com/ibabarhashmi"
            target="_blank"
            rel="noopener noreferrer"
            className="creator-link"
          >
            Babar Hashmi
          </a>
        </p>
      </footer>
    </>
  );
}

export function Container({
  children,
  wide,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <main
      id="main"
      className={`mx-auto w-full ${wide ? "max-w-4xl" : "max-w-2xl"} flex-1 px-4 pb-12 pt-7`}
    >
      {children}
    </main>
  );
}

/** Reads the current case; null-safe for SSR. */
export function useCaseOrNull() {
  return useCase();
}
