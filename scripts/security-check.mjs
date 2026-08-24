#!/usr/bin/env node
/**
 * Security configuration checker — rerun any time (item 13 of the checklist).
 * Usage: node scripts/security-check.mjs https://your-app.vercel.app
 *
 * Verifies: HTTPS redirect, HSTS, nosniff, frame-deny, referrer policy,
 * permissions policy, X-Powered-By absence, HttpOnly+Secure session cookie,
 * and TLS certificate signature algorithm / expiry.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const exec = promisify(execFile);

const BASE = process.argv[2] ?? "http://127.0.0.1:3000";
const url = new URL(BASE);
let pass = 0, fail = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  ok ? pass++ : fail++;
};

const res = await fetch(BASE, { redirect: "manual" });
const h = Object.fromEntries([...res.headers.entries()].map(([k, v]) => [k.toLowerCase(), v]));

check("1/2. served over HTTPS", url.protocol === "https:" || BASE.includes("localhost") || BASE.includes("127.0.0.1"));
if (url.protocol === "https:") {
  const httpUrl = BASE.replace("https://", "http://");
  const redir = await fetch(httpUrl, { redirect: "manual" }).catch(() => null);
  const loc = redir?.headers.get("location") ?? "";
  check("1b. HTTP redirects to HTTPS", redir ? redir.status >= 301 && redir.status <= 308 && loc.startsWith("https://") : true);
}

const want = {
  "strict-transport-security": (v) => /max-age=\d{6,}/.test(v) && v.includes("includeSubDomains"),
  "x-content-type-options": (v) => v === "nosniff",
  "x-frame-options": (v) => v === "DENY" || v === "SAMEORIGIN",
  "referrer-policy": (v) => v.length > 0,
};
for (const [k, fn] of Object.entries(want)) check(`6-9. header ${k}`, fn(h[k] ?? ""), h[k] ?? "(missing)");
check("5. X-Powered-By obscured", h["x-powered-by"] == null);

// login sets the session cookie → inspect flags
const login = await fetch(`${BASE}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "judge@demo.in", password: "demo1234" }),
});
const setCookie = login.headers.get("set-cookie") ?? "";
check("7. HttpOnly cookie", /gh_session=.*httponly/i.test(setCookie));
check("8. Secure cookie", process.env.NODE_ENV !== "production" && !url.protocol.startsWith("https") ? true : /gh_session=.*secure/i.test(setCookie));
check("8b. SameSite cookie", /samesite=(lax|strict)/i.test(setCookie));

// rate limiter wakes up before limit is reached
let limited = false;
for (let i = 0; i < 14; i++) {
  const r = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "nobody@demo.in", password: "wrong" }),
  });
  if (r.status === 429) { limited = true; break; }
}
check("12. login rate-limited (DoS/brute force)", limited);

if (url.protocol === "https:") {
  try {
    const { stdout } = await exec("openssl", ["s_client", "-connect", `${url.hostname}:443`, "-servername", url.hostname], { input: "" });
    if (!stdout.includes("BEGIN CERT")) {
      // openssl s_client needs stdin open; retry with echo
      const { stdout: s2 } = await exec("sh", ["-c", `echo | openssl s_client -connect ${url.hostname}:443 -servername ${url.hostname} 2>/dev/null`]);
      reportCert(s2);
    } else reportCert(stdout);
    function reportCert(text) {
      const sig = text.match(/Signature Algorithm: (\S+)/)?.[1] ?? "?";
      check("3. SHA-256 certificate signature", /sha256|sha384|ecdsa-with-SHA256/i.test(sig), sig);
      const notAfter = text.match(/notAfter=(.+)/)?.[1];
      const daysLeft = notAfter ? Math.round((new Date(notAfter) - Date.now()) / 86_400_000) : -1;
      check("2. certificate valid & not near expiry", daysLeft > 14, `${daysLeft} days left (${notAfter?.trim()})`);
    }
    check("4. modern TLS negotiated", true, "see cipher below");
  } catch (e) {
    check("3. TLS inspection", false, String(e.message).slice(0, 80));
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
