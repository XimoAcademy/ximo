"use client";

import { useState } from "react";
import { createCheckoutSession } from "./actions";

type Plan = "monthly" | "annual";

export default function CheckoutButtons({
  variant = "stacked",
  monthlyLabel = "Suscribirme · plan mensual",
  annualLabel = "Suscribirme · plan anual",
  annualEnabled = false,
}: {
  variant?: "stacked" | "inline";
  monthlyLabel?: string;
  annualLabel?: string;
  annualEnabled?: boolean;
}) {
  const [loading, setLoading] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function go(plan: Plan) {
    setError(null);
    setLoading(plan);
    const res = await createCheckoutSession(plan);
    if (res.url) {
      window.location.href = res.url;
      return;
    }
    setLoading(null);
    setError(res.error ?? "No se pudo iniciar el pago.");
  }

  return (
    <div>
      <div className={variant === "inline" ? "flex flex-wrap gap-3" : "flex flex-col gap-3"}>
        <button type="button" onClick={() => go("monthly")} disabled={loading !== null} className="ximo-glass-btn teal text-sm disabled:opacity-50">
          {loading === "monthly" ? "Redirigiendo…" : monthlyLabel}
        </button>
        {annualEnabled && (
          <button type="button" onClick={() => go("annual")} disabled={loading !== null} className="ximo-glass-btn gold text-sm disabled:opacity-50">
            {loading === "annual" ? "Redirigiendo…" : annualLabel}
          </button>
        )}
      </div>
      {error && <p className="mt-3 text-xs font-semibold" style={{ color: "var(--error)" }}>{error}</p>}
      <p className="mt-3 text-[11px]" style={{ color: "var(--text-3)" }}>
        Pago seguro con Stripe. Cancela cuando quieras.
      </p>
    </div>
  );
}
