import Link from "next/link";
import { Container } from "../../components/chrome";
import { LoginForm } from "../../components/login-form";

/**
 * Server component: nothing here suspends, so a judge who follows a
 * protected link never sees a pulsing placeholder where the form should be.
 * Demo credentials shown below so judges don't need to open the README.
 */
export default function LoginPage() {
  return (
    <Container>
      <div className="mx-auto max-w-md pt-4">
        <h1 className="text-2xl font-bold tracking-tight">Sign in to GoldenHour</h1>
        <p className="mt-1 text-sm text-muted">
          Demonstration accounts only. Sessions are signed; nothing persists on a server.
        </p>

        <LoginForm />

        <div className="mt-4 rounded-sm border border-hairline bg-card p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            Demo credentials
          </p>
          <p className="mt-1 text-xs text-muted">
            Email: <span className="tnum font-data">judge@demo.in</span> · Password: <span className="tnum font-data">demo1234</span>
          </p>
          <p className="mt-0.5 text-xs text-muted">
            Also: partner@demo.in / victim@demo.in (same password)
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          <Link href="/about" className="gh-link gh-link--quiet">
            What is mocked vs real
          </Link>
        </p>
      </div>
    </Container>
  );
}
