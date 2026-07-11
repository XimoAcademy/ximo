// Sentry — browser/client runtime. Runs before the app becomes interactive.
// The DSN is public (it ships in the client bundle by design); the env var lets
// ops override it without a code change, with the real project DSN as fallback.
import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
});

const DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ??
  "https://79e5a892d27f9bba6a997e07faff5781@o4511714448637952.ingest.us.sentry.io/4511714525511680";

Sentry.init({
  dsn: DSN,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,

  // Tracing: full in dev, sampled in prod to control volume.
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // PRIVACY (LFPDPPP / minors): do NOT record normal browsing sessions — only
  // buffer and send a replay when an error actually occurs, and mask all text
  // and media so no personal data or documents are ever captured.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
  ],
});

// App Router navigation instrumentation.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
