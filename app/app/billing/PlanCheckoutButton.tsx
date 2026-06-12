"use client";

import { useState } from "react";
import { createCheckoutSession } from "./actions";

export default function PlanCheckoutButton({
  plan,
  label,
  className = "ximo-glass-btn teal w-full text-sm",
}: {
  plan: "monthly" | "annual";
  label: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setError(null);
    setLoading(true);
    const res = await createCheckoutSession(plan);
    if (res.url) {
      window.location.href = res.url;
      return;
    }
    setLoading(false);
    setError(res.error ?? "No se pudo iniciar el pago.");
  }

  return (
    <div className="mt-8">
      <button type="button" onClick={go} disabled={loading} className={`${className} disabled:opacity-50`}>
        {loading ? "Redirigiendo…" : label}
      </button>
      {error && <p className="mt-2 text-xs font-semibold" style={{ color: "var(--error)" }}>{error}</p>}
    </div>
  );
}
