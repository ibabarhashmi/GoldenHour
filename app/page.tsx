"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Container, useCaseOrNull } from "../components/chrome";
import { useT } from "../lib/use-t";

export default function Landing() {
  const { t, lang } = useT();
  const router = useRouter();
  const existingCase = useCaseOrNull();

  // Resume mid-journey: a judge who reloads lands back on their plan.
  useEffect(() => {
    if (existingCase) {
      router.replace("/plan");
    }
  }, [existingCase, router]);

  return (
    <Container>
      <div className="flex flex-col items-start pt-4">
        {/* Official badge strip */}
        <p className="gh-tag text-muted">
          <span aria-hidden className="inline-block h-2 w-2 rounded-full bg-critical" />
          {t("landing.badge")}
        </p>

        <h1 className="mt-5 text-[44px] font-bold leading-[1.04] tracking-tight sm:text-6xl">
          {t("landing.headline")}
        </h1>
        <div aria-hidden className="mt-5 h-1.5 w-16 rounded-full bg-critical" />

        <p className="mt-5 max-w-md text-lg leading-snug text-muted">
          {t("landing.sub")}
        </p>

        {/* Primary decision, unmissable */}
        <Link
          href="/start?for=self"
          className="gh-btn gh-btn-danger mt-8 h-20 w-full px-6 text-center text-2xl font-bold sm:h-24 sm:text-3xl"
        >
          {t("landing.cta.self")} →
        </Link>

        <Link
          href="/start?for=someone_else"
          className="gh-btn gh-btn-outline mt-3 h-14 w-full px-6 text-base"
        >
          {t("landing.cta.other")}
        </Link>

        {/* Trust chips — quiet, factual */}
        <ul className="mt-7 grid w-full grid-cols-3 gap-2" aria-label={t("landing.badge")}>
          <li className="gh-card flex min-h-14 flex-col items-center justify-center px-2 py-2 text-center">
            <span className="tnum font-data text-sm font-semibold">24×7</span>
            <span className="mt-0.5 text-[11px] leading-none text-muted">
              {t("landing.stat.always")}
            </span>
          </li>
          <li className="gh-card flex min-h-14 flex-col items-center justify-center px-2 py-2 text-center">
            <span className="tnum font-data text-sm font-semibold">1930</span>
            <span className="mt-0.5 text-[11px] leading-none text-muted">
              {t("landing.stat.free")}
            </span>
          </li>
          <li className="gh-card flex min-h-14 flex-col items-center justify-center px-2 py-2 text-center">
            <span className="font-data text-sm font-semibold">EN · हिं</span>
            <span className="mt-0.5 text-[11px] leading-none text-muted">
              {t("landing.stat.langs")}
            </span>
          </li>
        </ul>

        {/* What happens here — numbered civic step list */}
        <section aria-labelledby="how-title" className="mt-9 w-full">
          <h2 id="how-title" className="gh-tag text-muted">
            {t("landing.how.title")}
          </h2>
          <ol className="mt-4 space-y-0 border-l-2 border-hairline pl-5">
            {(["landing.how.1", "landing.how.2", "landing.how.3"] as const).map(
              (key, i) => (
                <li key={key} className="relative pb-5 text-[15px] leading-snug last:pb-0">
                  <span
                    aria-hidden
                    className="tnum absolute -left-[31px] top-0 inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-ink font-data text-[11px] font-bold text-white"
                  >
                    {i + 1}
                  </span>
                  {t(key)}
                </li>
              ),
            )}
          </ol>
        </section>

        <p className="sr-only">
          {lang === "hi" ? "भाषा: हिंदी" : "Language: English"}
        </p>
      </div>
    </Container>
  );
}
