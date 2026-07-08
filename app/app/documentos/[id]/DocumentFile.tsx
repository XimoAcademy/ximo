"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DOCUMENT_RULE, safeStorageName, validateUpload } from "@/lib/uploads/validate";
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
    // Reset the input so choosing the same file again re-triggers onChange.
    e.target.value = "";
    if (!file) return;
    setError(null);

    // Friendly rejection of empty / oversized / unsupported files — never crash.
    const invalid = validateUpload(file, DOCUMENT_RULE);
    if (invalid) {
      setError(invalid);
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      // TODO: storage not configured in this environment — the document row
      // still works without a file; uploads activate when Supabase is set.
      setError("La subida de archivos no está disponible por ahora. Intenta más tarde.");
      return;
    }

    setBusy(true);
    try {
      const path = `${userId}/${docId}/${Date.now()}-${safeStorageName(file.name)}`;
      const { error: upErr } = await supabase.storage
        .from("documents")
        .upload(path, file, { upsert: true, cacheControl: "3600" });

      if (upErr) {
        setError("No se pudo subir el archivo. Revisa tu conexión e intenta de nuevo.");
        return;
      }

      const res = await attachDocumentFileAction(docId, path);
      if (!res.ok) {
        setError(res.error ?? "El archivo subió, pero no se pudo guardar la referencia. Intenta de nuevo.");
        return;
      }
      setUploaded(true);
    } catch {
      // Network drop mid-upload (slow connections) lands here instead of crashing.
      setError("Se perdió la conexión durante la subida. Verifica tu red e intenta de nuevo.");
    } finally {
      setBusy(false);
    }
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
          <div className={busy ? "animate-pulse text-3xl" : "text-3xl"}>{busy ? "⏳" : "⤒"}</div>
          <p className={`mt-2 text-sm font-bold ${busy ? "animate-pulse" : ""}`} style={{ color: "var(--text-2)" }}>
            {busy ? "Subiendo tu archivo…" : "Selecciona tu archivo"}
          </p>
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-label)" }}>
            {busy ? "Esto puede tardar un poco con conexiones lentas." : "PDF, JPG, PNG, DOC o DOCX · hasta 15 MB · privado"}
          </p>
          <input type="file" className="hidden" onChange={onFile} disabled={busy} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
        </label>
      )}
      {error && <p className="mt-3 text-xs font-semibold" style={{ color: "var(--error)" }}>{error}</p>}
    </div>
  );
}
