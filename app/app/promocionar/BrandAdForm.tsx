"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { submitBrandAdAction, type BrandResult } from "./actions";

const CATS = ["Equipo deportivo", "Suplementos y nutrición", "Recuperación", "Tecnología deportiva", "Educación y becas", "Salud y bienestar", "Otro"];
const FMTS = ["Foto", "Video", "Texto", "Oferta", "Producto"];
const OPP = ["Descuento exclusivo", "Patrocinio de atleta", "Prueba de producto", "Equipo gratuito", "Beca o apoyo", "Colaboración de contenido"];

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>{children}</label>
);

const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

export default function BrandAdForm() {
  const [state, formAction, pending] = useActionState<BrandResult | null, FormData>(submitBrandAdAction, null);

  const [mediaUrl, setMediaUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadErr("");
    if (file.size > MAX_SIZE) { setUploadErr("El archivo supera 20 MB."); return; }

    const supabase = createClient();
    if (!supabase) { setUploadErr("Servicio no disponible."); return; }

    setUploading(true);
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from("brand-ads").upload(path, file, { upsert: false });
    if (upErr) {
      setUploading(false);
      setUploadErr("No se pudo subir el archivo. Verifica tu conexión.");
      return;
    }
    const { data: pub } = supabase.storage.from("brand-ads").getPublicUrl(path);
    setMediaUrl(pub.publicUrl);
    setIsVideo(file.type.startsWith("video/"));
    setPreviewUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
    setUploading(false);
  }

  function clearMedia() {
    setMediaUrl("");
    setPreviewUrl(null);
    setIsVideo(false);
    setUploadErr("");
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Nombre de la marca</Label><input name="brand_name" required placeholder="Tu marca…" className="ximo-input" /></div>
        <div><Label>Contacto</Label><input name="contact_email" type="email" placeholder="email@marca.com" className="ximo-input" /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Categoría</Label>
          <select name="category" className="ximo-input" defaultValue={CATS[0]}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
        </div>
        <div><Label>Formato</Label>
          <select name="format" className="ximo-input" defaultValue="Texto">{FMTS.map((c) => <option key={c}>{c}</option>)}</select>
        </div>
      </div>
      <div><Label>Tipo de oportunidad</Label>
        <select name="opportunity" className="ximo-input" defaultValue={OPP[0]}>{OPP.map((c) => <option key={c}>{c}</option>)}</select>
      </div>
      <div><Label>Producto o servicio</Label><input name="product" placeholder="Nombre del producto…" className="ximo-input" /></div>
      <div><Label>Descripción del anuncio</Label><textarea name="description" rows={4} required placeholder="¿Cómo beneficia tu producto a los atletas?" className="ximo-input resize-none" /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Link de referencia</Label><input name="website" type="url" placeholder="https://tumarca.com" className="ximo-input" /></div>
        <div><Label>Público objetivo</Label><input name="audience" placeholder="Nadadores 16–22 años…" className="ximo-input" /></div>
      </div>

      {/* Media upload section */}
      <div>
        <Label>Imagen o video del anuncio (opcional)</Label>
        <div className="rounded-xl border-2 border-dashed p-4 transition-colors" style={{ borderColor: mediaUrl ? "var(--teal-border)" : "var(--border)", background: mediaUrl ? "var(--teal-bg)" : "var(--surface-hover)" }}>
          {!mediaUrl ? (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl" style={{ background: "var(--border-subtle)" }}>
                🖼
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  {uploading ? "Subiendo archivo…" : "Arrastra o selecciona imagen/video"}
                </p>
                <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-label)" }}>
                  JPG, PNG, GIF · MP4, MOV · hasta 20 MB
                </p>
              </div>
              <label className={`ximo-glass-btn dark cursor-pointer text-xs ${uploading ? "pointer-events-none opacity-50" : ""}`}>
                {uploading ? "Subiendo…" : "Seleccionar archivo"}
                <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} disabled={uploading} />
              </label>
              {uploadErr && <p className="text-xs font-semibold" style={{ color: "var(--error)" }}>{uploadErr}</p>}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                  <Image src={previewUrl} alt="Previsualización" fill className="object-cover" />
                </div>
              ) : isVideo ? (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl text-3xl" style={{ background: "var(--border-subtle)" }}>
                  🎬
                </div>
              ) : null}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: "var(--teal)" }}>Archivo listo ✓</p>
                <p className="mt-0.5 truncate text-[11px]" style={{ color: "var(--text-label)" }}>{mediaUrl}</p>
              </div>
              <button type="button" onClick={clearMedia} className="ximo-text-btn shrink-0 text-xs">Quitar</button>
            </div>
          )}
        </div>
        <input type="hidden" name="ad_media_url" value={mediaUrl} />
      </div>

      <div className="flex items-start gap-2.5 rounded-xl px-4 py-3" style={{ border: "1px solid var(--gold-border)", background: "var(--gold-bg)" }}>
        <span className="mt-0.5 shrink-0 text-base">🔒</span>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
          <strong style={{ color: "var(--gold)" }}>Revisión garantizada.</strong> Todas las promociones pasan por revisión manual antes de aparecer en la comunidad.
        </p>
      </div>

      {state?.error && <p className="text-xs font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>}

      <button type="submit" disabled={pending || uploading} className="ximo-glass-btn teal block w-full text-center text-sm disabled:opacity-50">
        {pending ? "Enviando…" : "Enviar a revisión →"}
      </button>
    </form>
  );
}
