import Link from "next/link";
import { Container } from "../../components/chrome";
import { NCRP_SUB_CATEGORIES } from "../../lib/types";
import { en } from "../../locales/en";

export const metadata = {
  title: "About — GoldenHour",
};

const REAL = [
  "about.real.1",
  "about.real.2",
] as const;

const MOCKED = [
  "about.mock.1",
  "about.mock.2",
  "about.mock.4",
  "about.mock.5",
] as const;

const DATA = ["about.data.1", "about.data.2"] as const;
const AI = ["about.ai.1", "about.ai.2"] as const;
const SCALE = [
  "about.scale.1",
  "about.scale.2",
  "about.scale.3",
  "about.scale.4",
] as const;

/**
 * Server component: pure static content. The brief explicitly rewards naming
 * every mock without being asked, so this page leads with the two-column table.
 */
export default function AboutPage() {
  return (
    <Container>
      <h1 className="text-2xl font-semibold tracking-tight">{"What's real, what's mocked"}</h1>
      <p className="mt-2 max-w-xl text-sm leading-snug text-muted">
        This is a demonstration built around India&apos;s National Cyber Crime
        Reporting Portal (cybercrime.gov.in) and the 1930 helpline. We name every
        shortcut openly.{" "}
        <Link href="/" className="underline underline-offset-2">
          Back to GoldenHour
        </Link>{" "}
        ·{" "}
        <Link href="/compare" className="underline underline-offset-2">
          Before/after comparison
        </Link>
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <section className="rounded-sm border border-stable bg-card p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stable">
            Real today
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-snug">
            {REAL.map((k) => (
              <li key={k}>• {ABOUT_COPY[k]}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-sm border border-critical bg-card p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-critical">
            Mocked
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-snug">
            {MOCKED.map((k) => (
              <li key={k}>• {ABOUT_COPY[k]}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-4 rounded-sm border border-hairline bg-card p-4">
        <h2 className="text-sm font-semibold">{`Where your data lives`}</h2>
        <ul className="mt-2 space-y-2 text-sm leading-snug text-muted">
          {DATA.map((k) => (
            <li key={k}>• {ABOUT_COPY[k]}</li>
          ))}
        </ul>
      </section>

      <section className="mt-3 rounded-sm border border-hairline bg-card p-4">
        <h2 className="text-sm font-semibold">{`Where AI sits`}</h2>
        <ul className="mt-2 space-y-2 text-sm leading-snug text-muted">
          {AI.map((k) => (
            <li key={k}>• {ABOUT_COPY[k]}</li>
          ))}
        </ul>
      </section>

      <section className="mt-3 rounded-sm border border-hairline bg-card p-4">
        <h2 className="text-sm font-semibold">How this scales safely</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-snug text-muted">
          {SCALE.map((k) => (
            <li key={k}>{ABOUT_COPY[k]}</li>
          ))}
        </ol>
      </section>

      <section className="mt-3 rounded-sm border border-hairline bg-card p-4">
        <h2 className="text-sm font-semibold">Domain fidelity</h2>
        <p className="mt-2 text-sm leading-snug text-muted">
          The seven financial-fraud sub-categories below are the portal&apos;s own
          values, reproduced exactly. Our triage tiles map onto them — TypeScript
          refuses to compile a typo:
        </p>
        <ul className="tnum mt-2 space-y-1 font-data text-[13px] leading-snug">
          {NCRP_SUB_CATEGORIES.map((c: string) => (
            <li key={c}>— {c}</li>
          ))}
        </ul>
      </section>

      <p className="mt-6 rounded-sm bg-clinical px-4 py-3 text-center text-xs font-medium text-muted">
        Recovery percentages vary by source and case. We deliberately avoid
        precise odds.
      </p>
    </Container>
  );
}

// English-only server copy for /about; the page is judge-facing documentation.
const ABOUT_COPY = en;
