"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { attachDocumentFileAction, getDocumentDownloadUrl } from "../actions";

export default function DocumentFile({
  docId,
  userId,
  hasFile,
  fileName,
}: {
  docId: string;
  userId: string;
  hasFile: boolean;
  fileName: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(hasFile);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (file.size > 15 * 1024 * 1024) {
      setError("El archivo supera el límite de 15 MB.");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError("Servicio no disponible.");
      return;
    }

    setBusy(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${userId}/${docId}/${Date.now()}-${safeName}`;
    const { error: upErr } = await supabase.storage
      .from("documents")
      .upload(path, file, { upsert: true, cacheControl: "3600" });

    if (upErr) {
      setBusy(false);
      setError("No se pudo subir el archivo. Intenta de nuevo.");
      return;
    }

    const res = await attachDocumentFileAction(docId, path);
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "No se pudo guardar.");
      return;
    }
    setUploaded(true);
  }

  async function onDownload() {
    setBusy(true);
    const url = await getDocumentDownloadUrl(docId);
    setBusy(false);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    else setError("No se encontró el archivo.");
  }

  return (
    <div>
      {uploaded ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-4"
          style={{ background: "var(--surface-hover)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Archivo cargado</p>
              {fileName && <p className="text-[11px]" style={{ color: "var(--text-label)" }}>{fileName}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onDownload} disabled={busy} className="ximo-glass-btn teal text-xs disabled:opacity-50">
              {busy ? "…" : "Ver / descargar"}
            </button>
            <label className="ximo-glass-btn dark cursor-pointer text-xs">
              Reemplazar
              <input type="file" className="hidden" onChange={onFile} disabled={busy} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
            </label>
          </div>
        </div>
      ) : (
        <label
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl px-6 py-10 text-center transition-colors hover:bg-[var(--surface-hover)]"
          style={{ background: "var(--surface-hover)", border: "1px dashed var(--border-strong)" }}
        >
          <div className="text-3xl">⤒</div>
          <p className="mt-2 text-sm font-bold" style={{ color: "var(--text-2)" }}>
            {busy ? "Subiendo…" : "Selecciona tu archivo"}
          </p>
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-label)" }}>PDF, JPG, PNG o DOC · hasta 15 MB · privado</p>
          <input type="file" className="hidden" onChange={onFile} disabled={busy} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
        </label>
      )}
      {error && <p className="mt-3 text-xs font-semibold" style={{ color: "var(--error)" }}>{error}</p>}
    </div>
  );
}
