import type { NextConfig } from "next";

/**
 * Security hardening (headers apply sitewide):
 * - HSTS forces HTTPS for two years, including subdomains, preload-ready.
 * - nosniff stops MIME confusion; DENY stops clickjacking framing.
 * - Referrer/Permissions policies keep client capabilities and leak surface
 *   minimal. X-Powered-By is disabled so the stack stays undisclosed.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
