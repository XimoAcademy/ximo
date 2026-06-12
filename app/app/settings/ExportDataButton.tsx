"use client";

import { useState } from "react";
import { exportMyDataAction } from "@/lib/settings/actions";

export default function ExportDataButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onExport() {
    setError(null);
    setBusy(true);
    const res = await exportMyDataAction();
    setBusy(false);
    if (!res.ok || !res.data) {
      setError(res.error ?? "No se pudo exportar.");
      return;
    }
    const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ximo-mis-datos-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <button type="button" onClick={onExport} disabled={busy} className="ximo-glass-btn dark text-xs disabled:opacity-50">
        {busy ? "Preparando…" : "Descargar mis datos"}
      </button>
      {error && <p className="mt-2 text-xs font-semibold" style={{ color: "var(--error)" }}>{error}</p>}
    </div>
  );
}
