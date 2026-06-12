"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Dashboard-segment error boundary. Renders INSIDE the app shell (sidebar stays
 * put), so a transient data-fetch failure in any /app/* route only affects the
 * content area and the athlete can retry without losing their place.
 */
export default function AppSegmentError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    // In production this would report to an error service (Sentry, etc.).
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div className="flex min-h-[55vh] items-center justify-center">
      <div
        className="ximo-fade-up w-full max-w-md rounded-2xl px-6 py-12 text-center ximo-card-3d"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-xl"
          style={{ background: "var(--warning-bg)", color: "var(--warning)", border: "1px solid var(--gold-border)" }}
          aria-hidden
        >
          !
        </div>
        <h1 className="mt-4 text-lg font-black" style={{ color: "var(--text)" }}>
          No pudimos cargar esta sección
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed" style={{ color: "var(--text-label)" }}>
          Tuvimos un problema temporal. Suele resolverse al intentar de nuevo. Tu información está a salvo.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => retry?.()} className="ximo-glass-btn teal text-sm">
            Intentar de nuevo
          </button>
          <Link href="/app" className="ximo-glass-btn dark text-sm">
            Ir al inicio
          </Link>
        </div>

        {error?.digest && (
          <p className="mt-6 font-mono text-[10px]" style={{ color: "var(--text-3)" }}>
            Ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
