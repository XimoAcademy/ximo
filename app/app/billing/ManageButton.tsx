"use client";

import { useState } from "react";
import { createPortalSession } from "./actions";

export default function ManageButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    setError(null);
    setLoading(true);
    const res = await createPortalSession();
    if (res.url) {
      window.location.href = res.url;
      return;
    }
    setLoading(false);
    setError(res.error ?? "No disponible.");
  }

  return (
    <>
      <button type="button" onClick={go} disabled={loading} className="ximo-glass-btn teal text-xs disabled:opacity-50">
        {loading ? "Abriendo…" : "Gestionar suscripción"}
      </button>
      {error && <p className="mt-2 text-xs font-semibold" style={{ color: "var(--error)" }}>{error}</p>}
    </>
  );
}
