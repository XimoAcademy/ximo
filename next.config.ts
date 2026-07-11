import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Baseline security headers applied to every route. (CSP is intentionally left
// out here — a strict policy needs per-source testing against Stripe, Supabase,
// Tally and Vercel; tracked as a follow-up in docs/security-plan.md.)
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage public URLs (avatars bucket, etc.)
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/array/:path*", destination: "https://us-assets.i.posthog.com/array/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
    ];
  },
  skipTrailingSlashRedirect: true,
};

// Sentry build-time wrapper: uploads source maps (when SENTRY_AUTH_TOKEN is set)
// so production stack traces show original code, and proxies events through
// /monitoring to survive ad-blockers. NOTE: this project uses Turbopack, so the
// webpack-only tree-shaking options are intentionally omitted.
export default withSentryConfig(nextConfig, {
  org: "ximo",
  project: "javascript-nextjs",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  silent: !process.env.CI,
});
