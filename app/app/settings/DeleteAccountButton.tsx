"use client";

import { useState, useTransition } from "react";
import { deleteAccountAction } from "@/lib/settings/actions";
import posthog from "posthog-js";

export default function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const canDelete = text.trim().toUpperCase() === "ELIMINAR";

  function onDelete() {
    if (!canDelete) return;
    setError(null);
    posthog.capture("account_deleted");
    start(async () => {
      const res = await deleteAccountAction();
      // On success the action redirects; we only reach here on failure.
      if (res && !res.ok) setError(res.error ?? "No se pudo eliminar la cuenta.");
    });
  }

  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--error)" }}>
      <p className="text-sm font-black" style={{ color: "var(--error)" }}>Zona de peligro</p>
      <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>
        Eliminar tu cuenta borra permanentemente tu perfil, universidades, coaches, documentos, progreso y todo tu
        contenido. Esta acción no se puede deshacer.
      </p>

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="ximo-glass-chip mt-4 rounded-full px-4 py-2 text-xs font-semibold"
          style={{ color: "var(--error)" }}
        >
          Eliminar mi cuenta
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>
            Escribe <span style={{ color: "var(--error)" }}>ELIMINAR</span> para confirmar:
          </p>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ELIMINAR"
            className="ximo-input max-w-xs"
            autoFocus
          />
          {error && <p className="text-xs font-semibold" style={{ color: "var(--error)" }}>{error}</p>}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onDelete}
              disabled={!canDelete || pending}
              className="ximo-glass-btn text-xs disabled:opacity-40"
              style={{ background: "var(--error)", color: "#fff", border: "1px solid var(--error)" }}
            >
              {pending ? "Eliminando…" : "Eliminar permanentemente"}
            </button>
            <button
              type="button"
              onClick={() => { setConfirming(false); setText(""); setError(null); }}
              className="ximo-text-btn"
              style={{ color: "var(--text-label)" }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
