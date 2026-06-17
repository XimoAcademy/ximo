"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassPanel, InnerTile, BackLink, StatusBadge } from "../../components/ui";
import { payCampaignAction } from "./actions";

const MIN_DAILY = 30;
const MAX_DAILY = 500;
const MAX_DAYS = 30;

/** Daily budget → estimated daily reach (people/day). Mild economy of scale. */
function dailyReach(daily: number): { low: number; high: number } {
  const rate = 3 + (daily / MAX_DAILY) * 3; // 3x..6x per MXN
  return { low: Math.round(daily * rate * 0.8), high: Math.round(daily * rate * 1.2) };
}

function fmtNum(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
}

export default function CampanaClient({
  adId,
  adTitle,
  stripeOn,
  approved,
}: {
  adId: string;
  adTitle: string;
  stripeOn: boolean;
  approved: boolean;
}) {
  const [daily, setDaily] = useState(100); // MXN/día (controla el alcance)
  const [days, setDays] = useState(7); // duración
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dr = dailyReach(daily);
  const total = daily * days;
  const totalReach = { low: dr.low * days, high: dr.high * days };

  async function pay() {
    setError(null);
    setLoading(true);
    const res = await payCampaignAction({ adId, dailyBudget: daily, days, reachMin: totalReach.low, reachMax: totalReach.high });
    if (res.url) {
      window.location.href = res.url;
      return;
    }
    setLoading(false);
    setError(res.error ?? "No se pudo iniciar el pago.");
  }

  const summary = [
    { l: "Presupuesto diario", v: `$${daily.toLocaleString("es-MX")} MXN` },
    { l: "Duración", v: `${days} ${days === 1 ? "día" : "días"}` },
    { l: "Alcance total", v: `${fmtNum(totalReach.low)}–${fmtNum(totalReach.high)}` },
    { l: "Total a pagar", v: `$${total.toLocaleString("es-MX")} MXN` },
  ];

  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <BackLink href="/app/promocionar/revision">Estado de revisión</BackLink>

      <div className="ximo-fade-up">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>
            Configurar campaña
          </h1>
          <StatusBadge tone={approved ? "success" : "warning"}>{approved ? "Anuncio aprobado" : "En revisión"}</StatusBadge>
        </div>
        <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
          Anuncio: <span className="font-semibold" style={{ color: "var(--text-2)" }}>{adTitle}</span>. El presupuesto define a cuánta gente llega; los días, cuánto tiempo se publica.
        </p>
      </div>

      <GlassPanel className="p-5">
        {/* ── Presupuesto diario → alcance ── */}
        <div className="mb-2 flex items-end justify-between">
          <div>
            <h2 className="text-base font-black" style={{ color: "var(--text)" }}>Presupuesto diario</h2>
            <p className="text-[11px]" style={{ color: "var(--text-3)" }}>Define a cuánta gente llega tu anuncio por día</p>
          </div>
          <p className="font-mono text-xl font-black" style={{ color: "var(--teal)" }}>${daily.toLocaleString("es-MX")}<span className="text-[10px] font-semibold" style={{ color: "var(--text-label)" }}> MXN/día</span></p>
        </div>
        <input type="range" min={MIN_DAILY} max={MAX_DAILY} step={10} value={daily}
          onChange={(e) => setDaily(Number(e.target.value))} className="w-full accent-[var(--teal)]" style={{ height: 4 }} />
        <div className="mt-1.5 flex justify-between text-[10px] font-semibold" style={{ color: "var(--text-3)" }}>
          <span>$30</span><span>$150</span><span>$300</span><span>$500</span>
        </div>

        {/* Reach bar (driven by daily budget) */}
        <div className="mt-4 rounded-xl p-4" style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-bold" style={{ color: "var(--text)" }}>Alcance por día</p>
            <p className="font-mono text-base font-black" style={{ color: "var(--gold)" }}>
              {fmtNum(dr.low)}–{fmtNum(dr.high)} <span className="text-[10px] font-semibold" style={{ color: "var(--text-label)" }}>atletas/día</span>
            </p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--border-subtle)" }}>
            <div className="h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (daily / MAX_DAILY) * 100)}%`, background: "linear-gradient(90deg, var(--teal), var(--gold))" }} />
          </div>
          <div className="mt-1.5 flex justify-between text-[9px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
            <span>Audiencia estrecha</span><span>Audiencia amplia</span>
          </div>
        </div>

        {/* ── Duración → días ── */}
        <div className="mt-6 mb-2 flex items-end justify-between">
          <div>
            <h2 className="text-base font-black" style={{ color: "var(--text)" }}>Duración</h2>
            <p className="text-[11px]" style={{ color: "var(--text-3)" }}>Cuántos días se publica tu anuncio</p>
          </div>
          <p className="font-mono text-xl font-black" style={{ color: "var(--teal)" }}>{days}<span className="text-[10px] font-semibold" style={{ color: "var(--text-label)" }}> {days === 1 ? "día" : "días"}</span></p>
        </div>
        <input type="range" min={1} max={MAX_DAYS} step={1} value={days}
          onChange={(e) => setDays(Number(e.target.value))} className="w-full accent-[var(--teal)]" style={{ height: 4 }} />
        <div className="mt-1.5 flex justify-between text-[10px] font-semibold" style={{ color: "var(--text-3)" }}>
          <span>1 día</span><span>7 días</span><span>14 días</span><span>30 días</span>
        </div>

        {/* Total */}
        <div className="mt-6 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--teal-bg)", border: "1px solid var(--teal-border)" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Total a pagar</p>
            <p className="text-[10px]" style={{ color: "var(--text-3)" }}>${daily.toLocaleString("es-MX")}/día × {days} {days === 1 ? "día" : "días"} · alcance {fmtNum(totalReach.low)}–{fmtNum(totalReach.high)}</p>
          </div>
          <p className="font-mono text-2xl font-black" style={{ color: "var(--teal)" }}>${total.toLocaleString("es-MX")}<span className="text-xs font-semibold" style={{ color: "var(--text-label)" }}> MXN</span></p>
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
      </GlassPanel>

      {/* Pay + publish */}
      <div className="space-y-2">
        {stripeOn ? (
          <button type="button" onClick={pay} disabled={loading}
            className="ximo-glass-btn teal block w-full text-center text-sm disabled:opacity-50">
            {loading ? "Redirigiendo al pago…" : `Pagar $${total.toLocaleString("es-MX")} MXN y publicar →`}
          </button>
        ) : (
          <p className="rounded-xl px-4 py-3 text-center text-xs" style={{ background: "var(--surface-hover)", color: "var(--text-label)" }}>
            El pago no está configurado todavía.
          </p>
        )}
        {error && <p className="text-center text-xs font-semibold" style={{ color: "var(--error)" }}>{error}</p>}
        <p className="text-center text-[11px]" style={{ color: "var(--text-3)" }}>
          Pago único y seguro con Stripe. Tu anuncio se publica en el feed de Comunidad al confirmarse el pago.
        </p>
        <Link href="/app/promocionar/preview" className="ximo-glass-btn dark block w-full text-center text-sm">Ver vista previa</Link>
      </div>
    </div>
  );
}
