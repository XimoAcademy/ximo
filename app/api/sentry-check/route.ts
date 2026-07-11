// TEMPORARY Sentry verification endpoint — DELETE after confirming the error
// lands in the Sentry dashboard. Throws a real server error through the actual
// request path so instrumentation.ts#onRequestError captures it.
export const dynamic = "force-dynamic";

export function GET() {
  throw new Error("Ximo Sentry verification — server route error (delete me)");
}
