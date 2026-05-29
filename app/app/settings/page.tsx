"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme, type AppTheme } from "../../providers/ThemeProvider";

const THEMES: { id: AppTheme; label: string; sub: string; preview: React.ReactNode }[] = [
  {
    id: "dark",
    label: "Oscuro",
    sub: "Modo por defecto — dark cinematic",
    preview: (
      <div className="h-20 w-full rounded-xl overflow-hidden" style={{ background:"#07131F" }}>
        <div className="flex gap-1.5 p-2.5">
          <div className="h-1.5 w-8 rounded-full" style={{ background:"rgba(30,206,206,0.5)" }} />
          <div className="h-1.5 w-12 rounded-full" style={{ background:"rgba(245,245,240,0.2)" }} />
        </div>
        <div className="mx-2.5 h-8 rounded-lg" style={{ background:"rgba(17,37,56,0.9)", border:"1px solid rgba(47,127,134,0.2)" }}>
          <div className="flex items-center gap-1.5 p-2">
            <div className="h-1.5 w-12 rounded-full" style={{ background:"rgba(30,206,206,0.5)" }} />
            <div className="h-1.5 w-8 rounded-full" style={{ background:"rgba(245,245,240,0.2)" }} />
          </div>
          <div className="flex gap-1 px-2">
            <div className="h-1 w-4 rounded-full" style={{ background:"rgba(201,168,76,0.5)" }} />
            <div className="h-1 w-6 rounded-full" style={{ background:"rgba(245,245,240,0.15)" }} />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "light",
    label: "Claro",
    sub: "Modo brillante — teal premium",
    preview: (
      <div className="h-20 w-full rounded-xl overflow-hidden" style={{ background:"#EFF9FA" }}>
        <div className="flex gap-1.5 p-2.5">
          <div className="h-1.5 w-8 rounded-full" style={{ background:"rgba(11,138,150,0.7)" }} />
          <div className="h-1.5 w-12 rounded-full" style={{ background:"rgba(7,26,31,0.2)" }} />
        </div>
        <div className="mx-2.5 h-8 rounded-lg" style={{ background:"rgba(255,255,255,0.9)", border:"1px solid rgba(11,138,150,0.2)" }}>
          <div className="flex items-center gap-1.5 p-2">
            <div className="h-1.5 w-12 rounded-full" style={{ background:"rgba(11,138,150,0.7)" }} />
            <div className="h-1.5 w-8 rounded-full" style={{ background:"rgba(7,26,31,0.2)" }} />
          </div>
          <div className="flex gap-1 px-2">
            <div className="h-1 w-4 rounded-full" style={{ background:"rgba(138,96,32,0.6)" }} />
            <div className="h-1 w-6 rounded-full" style={{ background:"rgba(7,26,31,0.15)" }} />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "system",
    label: "Sistema",
    sub: "Sigue la preferencia de tu dispositivo",
    preview: (
      <div className="h-20 w-full rounded-xl overflow-hidden flex">
        <div className="flex-1" style={{ background:"#07131F" }}>
          <div className="flex gap-1 p-2.5">
            <div className="h-1.5 w-5 rounded-full" style={{ background:"rgba(30,206,206,0.5)" }} />
            <div className="h-1.5 w-7 rounded-full" style={{ background:"rgba(245,245,240,0.2)" }} />
          </div>
          <div className="mx-2 h-7 rounded-lg" style={{ background:"rgba(17,37,56,0.9)", border:"1px solid rgba(47,127,134,0.2)" }} />
        </div>
        <div className="flex-1" style={{ background:"#EFF9FA" }}>
          <div className="flex gap-1 p-2.5">
            <div className="h-1.5 w-5 rounded-full" style={{ background:"rgba(11,138,150,0.6)" }} />
            <div className="h-1.5 w-7 rounded-full" style={{ background:"rgba(7,26,31,0.2)" }} />
          </div>
          <div className="mx-2 h-7 rounded-lg" style={{ background:"rgba(255,255,255,0.9)", border:"1px solid rgba(11,138,150,0.2)" }} />
        </div>
      </div>
    ),
  },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Theme is already applied live via setTheme + localStorage.
    // This confirms the choice for the user.
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="mx-auto max-w-[680px] space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/app/perfil"
          className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:opacity-70"
          style={{ background:"rgba(47,127,134,0.1)", border:"1px solid rgba(47,127,134,0.2)", color:"#7FAFB2" }}>
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-black" style={{ color:"var(--text)" }}>
            Configuración
          </h1>
          <p className="text-xs" style={{ color:"var(--text-label)" }}>
            Ajustes de la app
          </p>
        </div>
      </div>

      {/* Theme section */}
      <div className="rounded-2xl p-5 sm:p-6"
        style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>

        <div className="mb-5">
          <h2 className="text-base font-black" style={{ color:"var(--text)" }}>Tema visual</h2>
          <p className="mt-0.5 text-xs" style={{ color:"var(--text-label)" }}>
            Elige cómo se ve Ximo en tu pantalla.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {THEMES.map((t) => {
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className="ximo-btn-press flex flex-col gap-3 rounded-2xl p-3 text-left transition-all duration-200"
                style={{
                  background: active ? "var(--teal-bg)" : "rgba(47,127,134,0.04)",
                  border: active ? "2px solid var(--teal)" : "1.5px solid var(--border)",
                  outline: "none",
                }}
              >
                {t.preview}
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-black" style={{ color:"var(--text)" }}>{t.label}</p>
                    {active && (
                      <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                        style={{ background:"#1ECECE", color:"#07131F" }}>
                        Activo
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[10px] leading-snug" style={{ color:"var(--text-label)" }}>
                    {t.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Note + save */}
        <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor:"var(--border)" }}>
          <p className="text-[11px] leading-snug" style={{ color:"var(--text-3)" }}>
            El tema se aplica a toda la app al instante. Pronto podrás personalizar más
            detalles visuales desde aquí.
          </p>
          <button
            type="button"
            onClick={handleSave}
            className="ximo-glass-btn teal shrink-0 text-xs"
          >
            {saved ? "Cambios guardados" : "Guardar cambios"}
          </button>
        </div>
      </div>

      {/* Profile info section */}
      <div className="rounded-2xl p-5" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <h2 className="mb-4 text-base font-black" style={{ color:"var(--text)" }}>Cuenta</h2>
        <div className="space-y-3">
          {[
            { label:"Nombre", value:"Manuel Zúñiga" },
            { label:"Email", value:"manuel@ejemplo.com" },
            { label:"Plan", value:"Mensual activo" },
            { label:"Renovación", value:"15 de febrero" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between rounded-xl px-3.5 py-2.5"
              style={{ background:"var(--surface-hover)", border:"1px solid var(--border-subtle)" }}>
              <span className="text-xs font-semibold" style={{ color:"var(--text-label)" }}>{label}</span>
              <span className="text-xs font-bold" style={{ color:"var(--text)" }}>{value}</span>
            </div>
          ))}
        </div>
        <Link href="/subscribe"
          className="ximo-btn-press mt-4 block w-full rounded-xl py-2.5 text-center text-xs font-bold transition-opacity hover:opacity-80"
          style={{ background:"var(--teal-bg)", border:"1px solid var(--teal-border)", color:"var(--teal)" }}>
          Ver planes →
        </Link>
      </div>

      {/* Subscription */}
      <div className="rounded-2xl p-5" style={{ background:"var(--surface)", border:"1px solid var(--border-gold)" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 rounded-full ximo-glow-pulse" style={{ background:"var(--teal)" }} />
          <h2 className="text-sm font-black" style={{ color:"var(--text)" }}>Suscripción activa</h2>
        </div>
        <p className="text-xs" style={{ color:"var(--text-2)" }}>
          Tu acceso a Ximo está activo. Gestiona tu plan en cualquier momento.
        </p>
        <button type="button"
          className="ximo-btn-press mt-3 rounded-xl px-4 py-2 text-xs font-bold transition-opacity hover:opacity-80"
          style={{ background:"var(--gold-bg)", border:"1px solid var(--gold-border)", color:"var(--gold)" }}>
          Gestionar plan
        </button>
      </div>

      {/* App info */}
      <p className="pb-4 text-center text-[10px]" style={{ color:"var(--text-3)" }}>
        Ximo v0.1 — App en desarrollo · México primero
      </p>
    </div>
  );
}
