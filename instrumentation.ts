// Next.js server-side registration hook. Loads the right Sentry config per
// runtime and wires request-error capture (Sentry SDK >= 8.28; we run 10.x).
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Captures all unhandled server-side request errors (App Router).
export const onRequestError = Sentry.captureRequestError;
