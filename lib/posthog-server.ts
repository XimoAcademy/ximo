import { PostHog } from "posthog-node";

/**
 * Server-side PostHog client (posthog-node), null-safe like the app's other
 * integrations: when NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN isn't configured, this
 * returns a no-op stub so server actions (onboarding, billing, …) never crash
 * because analytics is missing. `capture`/`flush`/`shutdown` are the only
 * methods the app calls.
 */
type ServerAnalytics = Pick<PostHog, "capture" | "identify" | "flush" | "shutdown">;

const noop: ServerAnalytics = {
  capture: () => {},
  identify: () => {},
  flush: async () => {},
  shutdown: async () => {},
};

let posthogClient: PostHog | null = null;
let wrapped: ServerAnalytics | null = null;

// Deployment environment (production / preview / development) — stamped on
// every server event so staging traffic can be filtered in dashboards,
// mirroring the client-side posthog.register() in instrumentation-client.ts.
const ENVIRONMENT = process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown";

export function getPostHogClient(): ServerAnalytics {
  // Public write-only token (env override + fallback, mirrors the client).
  const token =
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? "phc_yJ9JqM5BiQoCCyEYLbehBoUf6bkyfLx8RrtkQEpQeJxf";
  if (!token) return noop;

  if (!posthogClient) {
    posthogClient = new PostHog(token, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    });
  }
  if (!wrapped) {
    const client = posthogClient;
    wrapped = {
      capture: (message) =>
        client.capture({
          ...message,
          properties: { environment: ENVIRONMENT, ...message.properties },
        }),
      identify: (message) =>
        client.identify({
          ...message,
          properties: { environment: ENVIRONMENT, ...message.properties },
        }),
      flush: () => client.flush(),
      shutdown: () => client.shutdown(),
    };
  }
  return wrapped;
}
