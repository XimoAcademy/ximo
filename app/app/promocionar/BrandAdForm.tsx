"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AD_MEDIA_RULE, safeStorageName, validateUpload } from "@/lib/uploads/validate";
import { submitBrandAdAction, type BrandResult } from "./actions";

/**
 * Advertiser submission wizard (5 steps):
 *   1. Datos del anunciante  2. Archivo del anuncio  3. Detalles de campaña
 *   4. Revisión              5. Enviar solicitud
 * No payment happens here: the request is saved as `pending` and reviewed
 * manually. If approved, the advertiser gets an email to continue with payment.
 */

const CATS = ["Equipo deportivo", "Suplementos y nutrición", "Recuperación", "Tecnología deportiva", "Educación y becas", "Salud y bienestar", "Otro"];
const BUDGET_RANGES = [
  "Menos de $1,000 MXN",
  "$1,000 – $3,000 MXN",
  "$3,000 – $10,000 MXN",
  "Más de $10,000 MXN",
  "Aún no lo decido",
];
const AUDIENCES = [
  "Nadadores",
  "Atletas estudiantes (general)",
  "Padres y madres de atletas",
  "Coaches y entrenadores",
  "Atletas en México",
  "Atletas buscando recruiting en EE. UU.",
];

const STEPS = ["Anunciante", "Archivo", "Campaña", "Revisión", "Enviar"];

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>{children}</label>
);

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-[10px]" style={{ color: "var(--text-3)" }}>{children}</p>;
}

interface WizardData {
  brand_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  category: string;
  title: string;
  description: string;
  destination_url: string;
  budget_range: string;
  audiences: string[];
  preferred_dates: string;
}

const EMPTY: WizardData = {
  brand_name: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  website: "",
  category: CATS[0],
  title: "",
  description: "",
  destination_url: "",
  budget_range: BUDGET_RANGES[0],
  audiences: [],
  preferred_dates: "",
};

export default function BrandAdForm() {
  const [state, formAction, pending] = useActionState<BrandResult | null, FormData>(submitBrandAdAction, null);

  const [step, setStep] = useState(0);
  const [d, setD] = useState<WizardData>(EMPTY);
  const [stepErr, setStepErr] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaName, setMediaName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  const set = <K extends keyof WizardData>(k: K, v: WizardData[K]) => setD((p) => ({ ...p, [k]: v }));

  function toggleAudience(a: string) {
    setD((p) => ({
      ...p,
      audiences: p.audiences.includes(a) ? p.audiences.filter((x) => x !== a) : [...p.audiences, a],
    }));
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset so re-selecting the same file after an error re-triggers onChange.
    e.target.value = "";
    if (!file) return;
    setUploadErr("");

    // Friendly rejection of empty / oversized / unsupported files — never crash.
    const invalid = validateUpload(file, AD_MEDIA_RULE);
    if (invalid) { setUploadErr(invalid); return; }

    const supabase = createClient();
    if (!supabase) {
      // TODO: file storage unavailable in this environment — the request
      // can still be sent with a reference link instead of an upload.
      setUploadErr("La subida de archivos no está disponible ahora. Puedes continuar sin archivo.");
      return;
    }

    setUploading(true);
    try {
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeStorageName(file.name)}`;
      const { error: upErr } = await supabase.storage.from("brand-ads").upload(path, file, { upsert: false });
      if (upErr) {
        setUploadErr("No se pudo subir el archivo. Verifica tu conexión e intenta de nuevo.");
        return;
      }
      const { data: pub } = supabase.storage.from("brand-ads").getPublicUrl(path);
      setMediaUrl(pub.publicUrl);
      setMediaName(file.name);
      setIsVideo(file.type.startsWith("video/"));
      setPreviewUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
    } catch {
      setUploadErr("Se perdió la conexión durante la subida. Verifica tu red e intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  function clearMedia() {
    setMediaUrl("");
    setMediaName("");
    setPreviewUrl(null);
    setIsVideo(false);
    setUploadErr("");
  }

  function validateStep(s: number): string {
    if (s === 0) {
      if (!d.brand_name.trim()) return "Escribe el nombre de tu marca.";
      if (!d.contact_name.trim()) return "Escribe el nombre de la persona de contacto.";
      if (!d.contact_email.trim() || !d.contact_email.includes("@")) return "Escribe un correo de contacto válido.";
    }
    if (s === 2) {
      if (!d.title.trim()) return "Escribe el título de tu campaña.";
      if (!d.description.trim()) return "Describe tu anuncio.";
    }
    return "";
  }

  function next() {
    const err = validateStep(step);
    if (err) { setStepErr(err); return; }
    setStepErr("");
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }
  function back() {
    setStepErr("");
    setStep((s) => Math.max(0, s - 1));
  }

  const summary: Array<[string, string]> = [
    ["Marca", d.brand_name || "—"],
    ["Contacto", `${d.contact_name || "—"} · ${d.contact_email || "—"}${d.contact_phone ? ` · ${d.contact_phone}` : ""}`],
    ["Sitio / red social", d.website || "—"],
    ["Categoría", d.category],
    ["Campaña", d.title || "—"],
    ["Descripción", d.description || "—"],
    ["Link de destino", d.destination_url || "—"],
    ["Presupuesto (rango)", d.budget_range],
    ["Audiencia", d.audiences.length ? d.audiences.join(", ") : "—"],
    ["Fechas preferidas", d.preferred_dates || "Sin preferencia"],
    ["Archivo", mediaName || "Sin archivo"],
  ];

  return (
    <form action={formAction} className="space-y-5">
      {/* Hidden fields carry the wizard state into the server action. */}
      {Object.entries({
        brand_name: d.brand_name,
        contact_name: d.contact_name,
        contact_email: d.contact_email,
        contact_phone: d.contact_phone,
        website: d.website,
        category: d.category,
        title: d.title,
        description: d.description,
        destination_url: d.destination_url,
        budget_range: d.budget_range,
        audience: d.audiences.join(", "),
        preferred_dates: d.preferred_dates,
        ad_media_url: mediaUrl,
        format: isVideo ? "Video" : previewUrl ? "Foto" : "Texto",
      }).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}

      {/* Step indicator */}
      <ol className="flex flex-wrap items-center gap-1.5">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-1.5">
            <span
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={
                i === step
                  ? { background: "var(--teal-bg)", border: "1px solid var(--teal-border)", color: "var(--teal)" }
                  : i < step
                    ? { background: "var(--surface-hover)", border: "1px solid var(--border-subtle)", color: "var(--teal)" }
                    : { background: "var(--surface-hover)", border: "1px solid var(--border-subtle)", color: "var(--text-3)" }
              }
            >
              {i < step ? "✓" : i + 1} {s}
            </span>
            {i < STEPS.length - 1 && <span className="text-[9px]" style={{ color: "var(--text-3)" }}>›</span>}
          </li>
        ))}
      </ol>

      {/* ── Step 1: Advertiser info ── */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Nombre de la marca *</Label><input value={d.brand_name} onChange={(e) => set("brand_name", e.target.value)} placeholder="Tu marca…" className="ximo-input" /></div>
            <div><Label>Persona de contacto *</Label><input value={d.contact_name} onChange={(e) => set("contact_name", e.target.value)} placeholder="Nombre y apellido" className="ximo-input" /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Correo de contacto *</Label><input type="email" value={d.contact_email} onChange={(e) => set("contact_email", e.target.value)} placeholder="email@marca.com" className="ximo-input" /><Hint>A este correo te avisaremos el resultado de la revisión.</Hint></div>
            <div><Label>Teléfono (opcional)</Label><input type="tel" value={d.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} placeholder="+52 …" className="ximo-input" /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Sitio web o red social</Label><input type="url" value={d.website} onChange={(e) => set("website", e.target.value)} placeholder="https://tumarca.com" className="ximo-input" /></div>
            <div><Label>Categoría</Label>
              <select value={d.category} onChange={(e) => set("category", e.target.value)} className="ximo-input">{CATS.map((c) => <option key={c}>{c}</option>)}</select>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Ad file ── */}
      {step === 1 && (
        <div className="space-y-3">
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
                      Tipos aceptados: JPG, PNG, GIF · MP4, MOV · Tamaño máximo: 20 MB
                    </p>
                  </div>
                  <label className={`ximo-glass-btn dark cursor-pointer text-xs ${uploading ? "pointer-events-none opacity-50" : ""}`}>
                    {uploading ? "Subiendo…" : "Seleccionar archivo"}
                    <input type="file" accept="image/jpeg,image/png,image/gif,video/mp4,video/quicktime" className="hidden" onChange={handleFile} disabled={uploading} />
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
                    <p className="mt-0.5 truncate text-[11px]" style={{ color: "var(--text-label)" }}>{mediaName}</p>
                  </div>
                  <button type="button" onClick={clearMedia} className="ximo-text-btn shrink-0 text-xs">Quitar</button>
                </div>
              )}
            </div>
            <Hint>Puedes continuar sin archivo y enviarlo después por correo si lo prefieres.</Hint>
          </div>
        </div>
      )}

      {/* ── Step 3: Campaign details ── */}
      {step === 2 && (
        <div className="space-y-4">
          <div><Label>Título de la campaña *</Label><input value={d.title} onChange={(e) => set("title", e.target.value)} placeholder="Nombre del producto o campaña…" className="ximo-input" /></div>
          <div><Label>Descripción *</Label><textarea value={d.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="¿Qué ofreces y cómo beneficia a los atletas?" className="ximo-input resize-none" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Link de destino</Label><input type="url" value={d.destination_url} onChange={(e) => set("destination_url", e.target.value)} placeholder="https://tumarca.com/oferta" className="ximo-input" /><Hint>A dónde llega la persona que toca tu anuncio.</Hint></div>
            <div><Label>Rango de presupuesto</Label>
              <select value={d.budget_range} onChange={(e) => set("budget_range", e.target.value)} className="ximo-input">{BUDGET_RANGES.map((b) => <option key={b}>{b}</option>)}</select>
              <Hint>Solo orientativo. No se paga nada en este paso.</Hint>
            </div>
          </div>
          <div>
            <Label>Audiencia</Label>
            <div className="flex flex-wrap gap-2">
              {AUDIENCES.map((a) => {
                const on = d.audiences.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAudience(a)}
                    className="rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors"
                    style={on
                      ? { background: "var(--teal-bg)", border: "1px solid var(--teal-border)", color: "var(--teal)" }
                      : { background: "var(--surface-hover)", border: "1px solid var(--border-subtle)", color: "var(--text-2)" }}
                  >
                    {on ? "✓ " : ""}{a}
                  </button>
                );
              })}
            </div>
          </div>
          <div><Label>Fechas preferidas (opcional)</Label><input value={d.preferred_dates} onChange={(e) => set("preferred_dates", e.target.value)} placeholder="Ej. del 1 al 15 de agosto" className="ximo-input" /></div>
        </div>
      )}

      {/* ── Step 4: Review ── */}
      {step === 3 && (
        <div className="space-y-3">
          <div className="rounded-2xl p-4" style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Resumen de tu solicitud</p>
            <dl className="space-y-2">
              {summary.map(([k, v]) => (
                <div key={k} className="flex flex-wrap gap-x-3 gap-y-0.5">
                  <dt className="w-36 shrink-0 text-[11px] font-bold" style={{ color: "var(--text-label)" }}>{k}</dt>
                  <dd className="min-w-0 flex-1 break-words text-[12px]" style={{ color: "var(--text-2)" }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          {previewUrl && (
            <div className="relative h-40 w-full overflow-hidden rounded-2xl" style={{ border: "1px solid var(--border-subtle)" }}>
              <Image src={previewUrl} alt="Previsualización del anuncio" fill className="object-contain" />
            </div>
          )}
          <div className="rounded-xl px-4 py-3" style={{ border: "1px solid var(--gold-border)", background: "var(--gold-bg)" }}>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
              <strong style={{ color: "var(--gold)" }}>Importante:</strong> el alcance y los resultados que se muestren
              en cualquier parte del proceso son una estimación, no un resultado garantizado. En este paso no se realiza
              ningún pago.
            </p>
          </div>
        </div>
      )}

      {/* ── Step 5: Submit ── */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 rounded-xl px-4 py-3" style={{ border: "1px solid var(--border)", background: "var(--surface-hover)" }}>
            <input
              id="rights_confirmed"
              name="rights_confirmed"
              type="checkbox"
              required
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--teal)]"
            />
            <label htmlFor="rights_confirmed" className="cursor-pointer text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
              Confirmo que tengo derechos sobre este anuncio, que la información es verdadera y que entiendo que Ximo
              revisará manualmente la solicitud antes de cualquier pago o publicación.
            </label>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-label)" }}>
            Al enviar aceptas los{" "}
            <Link href="/terminos-anunciantes" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2" style={{ color: "var(--teal)" }}>
              Términos para anunciantes
            </Link>{" "}
            y la{" "}
            <Link href="/politica-de-anuncios" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2" style={{ color: "var(--teal)" }}>
              Política de anuncios
            </Link>{" "}
            de Ximo.
          </p>
          {state?.error && <p className="text-xs font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>}
          <button
            type="submit"
            disabled={pending || uploading || !confirmed}
            className="ximo-glass-btn teal block w-full text-center text-sm disabled:opacity-50"
          >
            {pending ? "Enviando…" : "Enviar solicitud a revisión"}
          </button>
          <p className="text-center text-[11px]" style={{ color: "var(--text-3)" }}>
            Ximo revisará tu anuncio manualmente. Si se aprueba, recibirás un correo para continuar con el pago.
          </p>
        </div>
      )}

      {stepErr && <p className="text-xs font-semibold" style={{ color: "var(--error)" }}>{stepErr}</p>}

      {/* Wizard nav */}
      {step < 4 && (
        <div className="flex items-center justify-between gap-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
          {step > 0 ? (
            <button type="button" onClick={back} className="ximo-glass-btn dark text-xs">← Anterior</button>
          ) : <span />}
          <button type="button" onClick={next} className="ximo-glass-btn teal text-xs">Siguiente →</button>
        </div>
      )}
      {step === 4 && (
        <div className="flex items-center justify-start border-t pt-4" style={{ borderColor: "var(--border)" }}>
          <button type="button" onClick={back} className="ximo-glass-btn dark text-xs">← Anterior</button>
        </div>
      )}
    </form>
  );
}
