"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { AVATAR_RULE, validateUpload } from "@/lib/uploads/validate";
import { saveAvatarAction } from "./actions";

export default function AvatarUploader({
  userId,
  initials,
  initialUrl,
}: {
  userId: string;
  initials: string;
  initialUrl: string | null;
}) {
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);

    const invalid = validateUpload(file, AVATAR_RULE);
    if (invalid) { setError(invalid); return; }

    const supabase = createClient();
    if (!supabase) { setError("La subida de imágenes no está disponible por ahora."); return; }

    setBusy(true);
    try {
      const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
      const path = `${userId}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (upErr) { setError("No se pudo subir la imagen. Revisa tu conexión e intenta de nuevo."); return; }

      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = pub.publicUrl;
      const res = await saveAvatarAction(publicUrl);
      if (!res.ok) { setError(res.error ?? "No se pudo guardar."); return; }
      setUrl(publicUrl);
    } catch {
      setError("Se perdió la conexión durante la subida. Intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl"
        style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.08))", border: "1px solid rgba(201,168,76,0.2)" }}>
        {url ? (
          <Image src={url} alt="Avatar" fill sizes="64px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl font-black" style={{ color: "var(--gold)" }}>{initials}</div>
        )}
      </div>
      <div>
        <label className="ximo-glass-btn dark cursor-pointer text-xs">
          {busy ? "Subiendo…" : "Cambiar foto"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFile} disabled={busy} />
        </label>
        <p className="mt-3 text-[11px]" style={{ color: "var(--text-label)" }}>JPG, PNG o WEBP · hasta 4 MB</p>
        {error && <p className="mt-1 text-[11px] font-semibold" style={{ color: "var(--error)" }}>{error}</p>}
      </div>
    </div>
  );
}
