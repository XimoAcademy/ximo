"use client";

import { useEffect } from "react";
import Link from "next/link";
import Emblem from "./components/Emblem";

export default function Error({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    // In a real app this would report to an error service.
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16 text-center">
      <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-20" />

      <div className="ximo-fade-up relative z-10 flex flex-col items-center">
        <Emblem size={72} />

        <h1 className="mt-8 text-2xl font-black" style={{ color: "var(--text)" }}>
          Algo salió mal
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed" style={{ color: "var(--text-label)" }}>
          Tuvimos un problema inesperado al cargar esta sección. Puedes intentar de nuevo o volver al inicio.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => retry?.()} className="ximo-glass-btn teal text-sm">
            Intentar de nuevo
          </button>
          <Link href="/app" className="ximo-glass-btn dark text-sm">
            Ir al dashboard
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
