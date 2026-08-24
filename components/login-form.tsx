"use client";

import { useState } from "react";
import { useT } from "../lib/use-t";

export function LoginForm() {
  const { t } = useT();
  const [email, setEmail] = useState("judge@demo.in");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 401) {
        throw new Error(t("login.error"));
      }
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message ?? t("login.error.network"));
      }
      // Read at submit time — avoids useSearchParams, which would suspend
      // this form out of the SSR HTML and leave a pulsing box in its place.
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") ?? "/start";
      const target = next.startsWith("/") ? next : "/start";
      // Full document navigation, NOT router.push: when this page was reached
      // via the proxy's redirect of the original target, the app router
      // considers that target "current" and silently no-ops a push back to
      // it. A hard hand-off across the auth boundary is immune.
      window.location.assign(target);
    } catch (err) {
      if (err instanceof TypeError) {
        // fetch itself failed — server unreachable, not bad credentials
        setError(t("login.error.network"));
      } else {
        setError(err instanceof Error ? err.message : t("login.error"));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-5 space-y-4">
      <label className="block text-sm font-medium">
        <span>{t("login.email")}</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="gh-input mt-1"
        />
      </label>
      <label className="block text-sm font-medium">
        <span>{t("login.password")}</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="gh-input mt-1"
        />
      </label>
      {error && (
        <p role="alert" className="rounded-sm border border-critical bg-critical/5 p-3 text-sm text-critical">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="gh-btn gh-btn-primary h-12 w-full px-5 text-base"
      >
        {busy ? t("login.submitting") : t("login.submit")}
      </button>
      <p className="text-xs text-muted">{t("login.privacy")}</p>
    </form>
  );
}
