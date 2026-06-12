"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassPanel, InnerTile, BackLink, StatusBadge } from "../../components/ui";

const MIN = 50;
const MAX = 5000;
const DAILY_RATE = 71; // MXN/day — budget and duration move together at this rate
const MAX_DAYS = 30;

function calcReach(amount: number): { low: number; high: number } {
  // Slight economy of scale: higher spend → better CPM
  const rate = 2.0 + (amount / MAX) * 2.0;
  return {
    low: Math.round(amount * rate * 0.7),
    high: Math.round(amount * rate * 1.3),
  };
}

// Budget → duration. Proportional to spend, capped at 30 days.
function calcDays(amount: number): number {
  return Math.min(MAX_DAYS, Math.max(1, Math.round(amount / DAILY_RATE)));
}

// Duration → budget. The inverse: more days costs proportionally more.
function daysToAmount(days: number): number {
  return Math.min(MAX, Math.max(MIN, Math.round(days * DAILY_RATE)));
}

function fmtNum(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
}

export default function CampanaPage() {
  const [amount, setAmount] = useState(500);
  const [inputVal, setInputVal] = useState("500");
  const [saved, setSaved] = useState(false);

  const days = calcDays(amount);
  const reach = calcReach(amount);
  const perDay = Math.round(amount / days);

  const handleInput = (raw: string) => {
    setInputVal(raw);
    const n = parseInt(raw, 10);
    if (!isNaN(n)) setAmount(Math.min(MAX, Math.max(MIN, n)));
  };

  const handleSlider = (v: number) => {
    setAmount(v);
    setInputVal(String(v));
  };

  // Adjusting duration moves the budget proportionally (and vice-versa).
  const handleDays = (d: number) => {
    const a = daysToAmount(d);
    setAmount(a);
    setInputVal(String(a));
  };

  const summary = [
    { l: "Presupuesto", v: `$${amount.toLocaleString("es-MX")} MXN` },
    { l: "Duración", v: `${days} ${days === 1 ? "día" : "días"}` },
    { l: "Alcance est.", v: `${fmtNum(reach.low)}–${fmtNum(reach.high)}` },
    { l: "Ubicación", v: "Comunidad feed" },
  ];

  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <BackLink href="/app/promocionar/revision">Estado de revisión</BackLink>

      <div className="ximo-fade-up">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>
            Configurar campaña
          </h1>
          <StatusBadge tone="success">Anuncio aprobado</StatusBadge>
        </div>
        <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
          Ajusta tu presupuesto. Los alcances y duración son estimados de referencia.
        </p>
      </div>

      {/* Budget slider */}
      <GlassPanel className="p-5">
        <h2 className="mb-1 text-base font-black" style={{ color: "var(--text)" }}>Presupuesto</h2>
        <p className="mb-5 text-xs" style={{ color: "var(--text-label)" }}>
          Desliza o escribe el monto que quieres invertir. Mínimo $50 · Máximo $5,000 MXN.
        </p>

        {/* Amount display + input */}
        <div className="mb-5 flex items-end gap-3">
          <div className="flex-1">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Monto (MXN)</p>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: "var(--surface-hover)", border: "1px solid var(--border)" }}>
              <span className="font-mono text-lg font-black" style={{ color: "var(--teal)" }}>$</span>
              <input
                type="number"
                value={inputVal}
                min={MIN}
                max={MAX}
                onChange={(e) => handleInput(e.target.value)}
                onBlur={() => {
                  const clamped = Math.min(MAX, Math.max(MIN, amount));
                  setAmount(clamped);
                  setInputVal(String(clamped));
                }}
                className="flex-1 bg-transparent font-mono text-2xl font-black outline-none"
                style={{ color: "var(--text)" }}
              />
              <span className="text-xs font-bold" style={{ color: "var(--text-label)" }}>MXN</span>
            </div>
          </div>
          <div className="rounded-xl px-4 py-3 text-center" style={{ background: "var(--teal-bg)", border: "1px solid var(--teal-border)", minWidth: 90 }}>
            <p className="font-mono text-xl font-black" style={{ color: "var(--teal)" }}>{days}</p>
            <p className="text-[10px] font-bold" style={{ color: "var(--text-label)" }}>{days === 1 ? "día" : "días"}</p>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={50}
            value={amount}
            onChange={(e) => handleSlider(Number(e.target.value))}
            className="w-full accent-[var(--teal)]"
            style={{ height: 4 }}
          />
          <div className="mt-1.5 flex justify-between text-[10px] font-semibold" style={{ color: "var(--text-3)" }}>
            <span>$50</span>
            <span>$1,000</span>
            <span>$2,500</span>
            <span>$5,000</span>
          </div>
        </div>

        {/* Duration slider — moves the budget proportionally */}
        <div className="mt-6">
          <div className="mb-2 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Duración</p>
              <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-3)" }}>Cuántos días se muestra tu anuncio</p>
            </div>
            <p className="font-mono text-base font-black" style={{ color: "var(--teal)" }}>
              {days} <span className="text-[10px] font-semibold" style={{ color: "var(--text-label)" }}>{days === 1 ? "día" : "días"}</span>
            </p>
          </div>
          <input
            type="range"
            min={1}
            max={MAX_DAYS}
            step={1}
            value={days}
            onChange={(e) => handleDays(Number(e.target.value))}
            className="w-full accent-[var(--teal)]"
            style={{ height: 4 }}
          />
          <div className="mt-1.5 flex justify-between text-[10px] font-semibold" style={{ color: "var(--text-3)" }}>
            <span>1 día</span>
            <span>7 días</span>
            <span>14 días</span>
            <span>30 días</span>
          </div>
          <p className="mt-2 text-[10px]" style={{ color: "var(--text-label)" }}>
            ≈ <span className="font-bold" style={{ color: "var(--text-2)" }}>${perDay.toLocaleString("es-MX")} MXN</span> por día · presupuesto y duración se ajustan juntos
          </p>
        </div>

        {/* Quick presets */}
        <div className="mt-5 flex flex-wrap gap-2">
          <p className="w-full text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Montos rápidos</p>
          {[250, 500, 1000, 2500, 5000].map((v) => (
            <button key={v} type="button" onClick={() => handleSlider(v)}
              className={`ximo-glass-chip rounded-full px-3 py-1 text-xs font-bold ${amount === v ? "active" : ""}`}>
              ${v.toLocaleString("es-MX")}
            </button>
          ))}
        </div>

        {/* Reach bar */}
        <div className="mt-5 rounded-xl p-4" style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-bold" style={{ color: "var(--text)" }}>Alcance estimado</p>
            <p className="font-mono text-base font-black" style={{ color: "var(--gold)" }}>
              {fmtNum(reach.low)}–{fmtNum(reach.high)} <span className="text-[10px] font-semibold" style={{ color: "var(--text-label)" }}>atletas</span>
            </p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--border-subtle)" }}>
            <div className="h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (amount / MAX) * 100)}%`, background: "linear-gradient(90deg, var(--teal), var(--gold))" }} />
          </div>
          <div className="mt-1.5 flex justify-between text-[9px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
            <span>Audiencia estrecha</span>
            <span>Audiencia amplia</span>
          </div>
          <p className="mt-2 text-[10px]" style={{ color: "var(--text-3)" }}>
            Apareces en el feed de Comunidad por {days} {days === 1 ? "día" : "días"} · estimados de referencia, no garantizados
          </p>
        </div>
      </GlassPanel>

      {/* Summary */}
      <GlassPanel className="p-5">
        <h2 className="mb-4 text-base font-black" style={{ color: "var(--text)" }}>Resumen de campaña</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {summary.map((item) => (
            <InnerTile key={item.l} className="px-3 py-3 text-center">
              <p className="text-base font-black" style={{ color: "var(--text)" }}>{item.v}</p>
              <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-label)" }}>{item.l}</p>
            </InnerTile>
          ))}
        </div>
        <p className="mt-3 text-[11px]" style={{ color: "var(--text-label)" }}>
          Tu campaña aparecerá como promoción verificada en el feed de Comunidad. Sin pagos reales — plataforma en beta.
        </p>
      </GlassPanel>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setSaved(true)} className="ximo-glass-btn teal text-sm">
          {saved ? "Campaña guardada ✓" : "Guardar campaña"}
        </button>
        <Link href="/app/promocionar/preview" className="ximo-glass-btn dark text-sm">
          Ver vista previa
        </Link>
      </div>
    </div>
  );
}
