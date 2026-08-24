import Link from "next/link";
import { Container } from "../../components/chrome";
import { LoginForm } from "../../components/login-form";

/**
 * Server component: nothing here suspends, so a judge who follows a
 * protected link never sees a pulsing placeholder where the form should be.
 * Demo credentials live in the README, not on screen.
 */
export default function LoginPage() {
  return (
    <Container>
      <div className="mx-auto max-w-md pt-4">
        <h1 className="text-2xl font-bold tracking-tight">Sign in to GoldenHour</h1>
        <p className="mt-1 text-sm text-muted">
          Demonstration accounts only. Nothing is stored on a server.
        </p>

        <LoginForm />

        <p className="mt-4 text-center text-xs text-muted">
          <Link href="/about" className="gh-link gh-link--quiet">
            What is mocked vs real
          </Link>
        </p>
      </div>
    </Container>
  );
}
