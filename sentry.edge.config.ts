// Sentry — Edge runtime (proxy.ts / edge routes; loaded from instrumentation.ts).
import * as Sentry from "@sentry/nextjs";

const DSN =
  process.env.SENTRY_DSN ??
  process.env.NEXT_PUBLIC_SENTRY_DSN ??
  "https://79e5a892d27f9bba6a997e07faff5781@o4511714448637952.ingest.us.sentry.io/4511714525511680";

Sentry.init({
  dsn: DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
});
