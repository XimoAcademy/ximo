import type { ErrorEvent } from "@sentry/nextjs";

/**
 * Redact private/sensitive values before an event leaves the process (Sentry).
 * Defense in depth for LFPDPPP + minors: even though we never intentionally log
 * these, `includeLocalVariables` and request bodies could otherwise carry a date
 * of birth, password, or token into error reports.
 */
const SENSITIVE_KEY = /(date_of_birth|dob|birth|password|passwd|token|secret|authorization|cookie|ssn|curp)/i;
const REDACTED = "[redacted]";

function scrubValue(value: unknown, depth = 0): unknown {
  if (depth > 6 || value == null) return value;
  if (Array.isArray(value)) return value.map((v) => scrubValue(v, depth + 1));
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SENSITIVE_KEY.test(k) ? REDACTED : scrubValue(v, depth + 1);
    }
    return out;
  }
  return value;
}

/** Sentry `beforeSend` hook: scrub request data, extra, contexts, and the
 * local variables captured on stack frames. */
export function scrubSentryEvent(event: ErrorEvent): ErrorEvent {
  if (event.request?.data) event.request.data = scrubValue(event.request.data);
  if (event.extra) event.extra = scrubValue(event.extra) as Record<string, unknown>;
  if (event.contexts) event.contexts = scrubValue(event.contexts) as typeof event.contexts;
  for (const ex of event.exception?.values ?? []) {
    for (const frame of ex.stacktrace?.frames ?? []) {
      if (frame.vars) frame.vars = scrubValue(frame.vars) as Record<string, unknown>;
    }
  }
  return event;
}
