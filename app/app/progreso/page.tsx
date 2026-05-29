"use client";

import { useMemo, useState, type FormEvent } from "react";
import PageHeader from "../components/PageHeader";
import ScrollReveal from "../../components/ScrollReveal";

// ── Types ──────────────────────────────────────────────────────
type Course = "SCY" | "LCM" | "SCM";
interface Swim {
  id: number;
  event: string;
  course: Course;
  sec: number;      // parsed seconds
  date: string;     // ISO yyyy-mm-dd
  meet: string;
}

const CARD  = { background: "var(--surface)", border: "1px solid var(--border)" } as const;
const INNER = { background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" } as const;

const EVENTS = ["50 libre", "100 libre", "200 libre", "100 mariposa", "100 dorso", "100 pecho"];
const COURSES: Course[] = ["SCY", "LCM", "SCM"];

// Target times (goal cuts) per event+course — shown as a goal line
const TARGETS: Record<string, number> = {
  "50 libre|SCY": 25.2,
  "100 libre|SCY": 56.5,
  "200 libre|SCY": 120.0,
  "100 mariposa|SCY": 61.0,
  "100 dorso|SCY": 63.0,
  "100 pecho|SCY": 70.0,
};

// ── Seed data (mock progression) ──────────────────────────────
const SEED: Swim[] = [
  // 50 libre SCY
  { id: 1,  event: "50 libre",     course: "SCY", sec: 27.9,  date: "2023-11-04", meet: "Apertura GDL" },
  { id: 2,  event: "50 libre",     course: "SCY", sec: 27.4,  date: "2024-02-17", meet: "Invierno Estatal" },
  { id: 3,  event: "50 libre",     course: "SCY", sec: 26.9,  date: "2024-06-08", meet: "Nacional Juvenil" },
  { id: 4,  event: "50 libre",     course: "SCY", sec: 26.4,  date: "2024-11-23", meet: "Copa Jalisco" },
  { id: 5,  event: "50 libre",     course: "SCY", sec: 26.0,  date: "2025-03-15", meet: "GDL Invitational" },
  // 100 libre SCY
  { id: 6,  event: "100 libre",    course: "SCY", sec: 60.8,  date: "2023-11-04", meet: "Apertura GDL" },
  { id: 7,  event: "100 libre",    course: "SCY", sec: 59.6,  date: "2024-02-17", meet: "Invierno Estatal" },
  { id: 8,  event: "100 libre",    course: "SCY", sec: 58.9,  date: "2024-06-08", meet: "Nacional Juvenil" },
  { id: 9,  event: "100 libre",    course: "SCY", sec: 58.0,  date: "2025-03-15", meet: "GDL Invitational" },
  // 200 libre SCY
  { id: 10, event: "200 libre",    course: "SCY", sec: 132.0, date: "2024-02-17", meet: "Invierno Estatal" },
  { id: 11, event: "200 libre",    course: "SCY", sec: 128.4, date: "2024-06-08", meet: "Nacional Juvenil" },
  { id: 12, event: "200 libre",    course: "SCY", sec: 125.0, date: "2025-03-15", meet: "GDL Invitational" },
  // 100 mariposa SCY
  { id: 13, event: "100 mariposa", course: "SCY", sec: 66.0,  date: "2024-02-17", meet: "Invierno Estatal" },
  { id: 14, event: "100 mariposa", course: "SCY", sec: 64.2,  date: "2024-06-08", meet: "Nacional Juvenil" },
  { id: 15, event: "100 mariposa", course: "SCY", sec: 63.0,  date: "2025-03-15", meet: "GDL Invitational" },
  // 50 libre LCM
  { id: 16, event: "50 libre",     course: "LCM", sec: 30.8,  date: "2024-07-12", meet: "Nacional LCM" },
  { id: 17, event: "50 libre",     course: "LCM", sec: 30.1,  date: "2025-01-20", meet: "Selectivo LCM" },
];

// ── Time helpers ───────────────────────────────────────────────
function parseTime(s: string): number | null {
  const t = s.trim();
  const m = t.match(/^(?:(\d+):)?([0-5]?\d(?:\.\d{1,2})?)$/);
  if (!m) return null;
  const min = m[1] ? parseInt(m[1], 10) : 0;
  const sec = parseFloat(m[2]);
  return min * 60 + sec;
}
function fmtTime(sec: number): string {
  if (sec >= 60) {
    const m = Math.floor(sec / 60);
    const s = sec - m * 60;
    return `${m}:${s.toFixed(2).padStart(5, "0")}`;
  }
  return sec.toFixed(2);
}
function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "2-digit" });
}

// ── Progression chart (SVG, no library) ────────────────────────
function ProgressionChart({ swims, target }: { swims: Swim[]; target?: number }) {
  const W = 640, H = 260, padL = 52, padR = 18, padT = 20, padB = 36;
  const plotW = W - padL - padR, plotH = H - padT - padB;

  const pts = [...swims].sort((a, b) => a.date.localeCompare(b.date));
  if (pts.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-xl" style={INNER}>
        <p className="text-sm" style={{ color: "var(--text-label)" }}>
          Aún no hay tiempos para este evento. Agrega tu primer registro abajo.
        </p>
      </div>
    );
  }

  const secs = pts.map(p => p.sec);
  const allVals = target ? [...secs, target] : secs;
  let lo = Math.min(...allVals), hi = Math.max(...allVals);
  const pad = (hi - lo) * 0.15 || 1;
  lo -= pad; hi += pad;

  const t0 = new Date(pts[0].date).getTime();
  const t1 = new Date(pts[pts.length - 1].date).getTime();
  const span = t1 - t0 || 1;

  // x by date; y inverted so slower(top) → faster(bottom): improvement trends DOWN
  const x = (iso: string) => padL + ((new Date(iso).getTime() - t0) / span) * plotW;
  const y = (sec: number) => padT + ((hi - sec) / (hi - lo)) * 0; // placeholder
  // Correct: top = slowest (hi), bottom = fastest (lo)
  const yy = (sec: number) => padT + ((sec - lo) / (hi - lo)) * plotH;

  const linePts = pts.map(p => `${x(p.date).toFixed(1)},${yy(p.sec).toFixed(1)}`).join(" ");
  const areaPts = `${padL},${padT + plotH} ${linePts} ${(padL + plotW).toFixed(1)},${padT + plotH}`;
  const bestSec = Math.min(...secs);

  // y gridlines (4)
  const gridY = [0, 0.25, 0.5, 0.75, 1].map(f => {
    const sec = hi - f * (hi - lo);
    return { yPos: padT + f * plotH, label: fmtTime(sec) };
  });

  return (
    <div className="overflow-hidden rounded-xl" style={INNER}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: "block" }} role="img" aria-label="Progresión de tiempos">
        <defs>
          <linearGradient id="prog-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* gridlines + y labels */}
        {gridY.map((g, i) => (
          <g key={i}>
            <line x1={padL} y1={g.yPos} x2={padL + plotW} y2={g.yPos}
              stroke="var(--border-subtle)" strokeWidth="1" />
            <text x={padL - 8} y={g.yPos + 3} textAnchor="end"
              fontSize="9" fill="var(--text-label)" fontFamily="var(--font-geist-mono, monospace)">
              {g.label}
            </text>
          </g>
        ))}

        {/* target / goal line */}
        {target && target >= lo && target <= hi && (
          <g>
            <line x1={padL} y1={yy(target)} x2={padL + plotW} y2={yy(target)}
              stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.8" />
            <text x={padL + plotW} y={yy(target) - 5} textAnchor="end"
              fontSize="9" fontWeight="600" fill="var(--gold)">
              Meta {fmtTime(target)}
            </text>
          </g>
        )}

        {/* area + line */}
        <polygon points={areaPts} fill="url(#prog-fill)" />
        <polyline points={linePts} fill="none" stroke="var(--teal)" strokeWidth="2.5"
          strokeLinejoin="round" strokeLinecap="round" />

        {/* points */}
        {pts.map((p) => {
          const isBest = p.sec === bestSec;
          return (
            <g key={p.id}>
              <circle cx={x(p.date)} cy={yy(p.sec)} r={isBest ? 5.5 : 3.5}
                fill={isBest ? "var(--gold)" : "var(--bg)"}
                stroke={isBest ? "var(--gold)" : "var(--teal)"} strokeWidth="2">
                <title>{fmtTime(p.sec)} · {fmtDate(p.date)} · {p.meet}</title>
              </circle>
              {isBest && (
                <text x={x(p.date)} y={yy(p.sec) - 12} textAnchor="middle"
                  fontSize="10" fontWeight="700" fill="var(--gold)">
                  PB {fmtTime(p.sec)}
                </text>
              )}
            </g>
          );
        })}

        {/* x labels: first & last */}
        <text x={padL} y={H - 12} textAnchor="start" fontSize="9" fill="var(--text-label)">
          {fmtDate(pts[0].date)}
        </text>
        {pts.length > 1 && (
          <text x={padL + plotW} y={H - 12} textAnchor="end" fontSize="9" fill="var(--text-label)">
            {fmtDate(pts[pts.length - 1].date)}
          </text>
        )}
      </svg>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────
export default function ProgresoPage() {
  const [swims, setSwims] = useState<Swim[]>(SEED);
  const [course, setCourse] = useState<Course>("SCY");
  const [selEvent, setSelEvent] = useState<string>("50 libre");
  const [showForm, setShowForm] = useState(false);

  // form state
  const [fEvent, setFEvent] = useState(EVENTS[0]);
  const [fCourse, setFCourse] = useState<Course>("SCY");
  const [fTime, setFTime] = useState("");
  const [fDate, setFDate] = useState("");
  const [fMeet, setFMeet] = useState("");
  const [fErr, setFErr] = useState("");

  // bests per event for the active course
  const bests = useMemo(() => {
    const map = new Map<string, Swim>();
    for (const s of swims) {
      if (s.course !== course) continue;
      const cur = map.get(s.event);
      if (!cur || s.sec < cur.sec) map.set(s.event, s);
    }
    return map;
  }, [swims, course]);

  // swims for the selected event+course (chart)
  const eventSwims = useMemo(
    () => swims.filter(s => s.event === selEvent && s.course === course),
    [swims, selEvent, course]
  );

  // improvement summary for selected event
  const summary = useMemo(() => {
    if (eventSwims.length === 0) return null;
    const sorted = [...eventSwims].sort((a, b) => a.date.localeCompare(b.date));
    const first = sorted[0], best = sorted.reduce((m, s) => (s.sec < m.sec ? s : m), sorted[0]);
    const drop = first.sec - best.sec;
    const pct = (drop / first.sec) * 100;
    return { first, best, drop, pct, count: sorted.length };
  }, [eventSwims]);

  // meet history (recent first)
  const history = useMemo(
    () => [...swims].filter(s => s.course === course).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8),
    [swims, course]
  );

  const totalDrop = useMemo(() => {
    let total = 0;
    for (const ev of EVENTS) {
      const list = swims.filter(s => s.event === ev && s.course === course).sort((a, b) => a.date.localeCompare(b.date));
      if (list.length > 1) total += list[0].sec - Math.min(...list.map(s => s.sec));
    }
    return total;
  }, [swims, course]);

  const addSwim = (e: FormEvent) => {
    e.preventDefault();
    const sec = parseTime(fTime);
    if (!sec) { setFErr("Formato inválido. Usa 26.04 o 1:02.45"); return; }
    if (!fDate) { setFErr("Selecciona la fecha de la competencia."); return; }
    setSwims(prev => [
      ...prev,
      { id: Date.now(), event: fEvent, course: fCourse, sec, date: fDate, meet: fMeet.trim() || "Competencia" },
    ]);
    setFTime(""); setFMeet(""); setFErr("");
    setSelEvent(fEvent); setCourse(fCourse); setShowForm(false);
  };

  return (
    <>
      <PageHeader
        title="Progreso deportivo"
        subtitle="Registra tus marcas, visualiza tu progresión y sigue cada mejora hacia tus metas."
      />

      {/* ── Top stats ── */}
      <ScrollReveal>
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Eventos seguidos", value: String(bests.size) },
          { label: "Marcas registradas", value: String(swims.filter(s => s.course === course).length) },
          { label: "Tiempo total bajado", value: `${totalDrop.toFixed(1)}s` },
          { label: "Mejor evento", value: summary ? selEvent : "—" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-4 ximo-card-3d" style={CARD}>
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-label)" }}>{s.label}</p>
            <p className="mt-1 text-2xl font-black" style={{ color: "var(--teal)" }}>{s.value}</p>
          </div>
        ))}
      </div>
      </ScrollReveal>

      {/* ── Course toggle + add button ── */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 rounded-xl p-1" style={INNER}>
          {COURSES.map((c) => (
            <button key={c} type="button" onClick={() => setCourse(c)}
              className="rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-150"
              style={course === c
                ? { background: "var(--teal-bg)", color: "var(--teal)", border: "1px solid var(--teal-border)" }
                : { background: "transparent", color: "var(--text-label)", border: "1px solid transparent" }}>
              {c}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setShowForm(v => !v)}
          className="ximo-btn-press rounded-xl px-4 py-2 text-xs font-bold transition-opacity hover:opacity-90"
          style={{ background: "#1ECECE", color: "#07131F" }}>
          {showForm ? "Cerrar" : "+ Agregar marca"}
        </button>
      </div>

      {/* ── Add PB form ── */}
      {showForm && (
        <ScrollReveal>
        <form onSubmit={addSwim} className="mb-5 rounded-2xl p-5" style={CARD}>
          <p className="mb-4 text-sm font-black" style={{ color: "var(--text)" }}>Registrar nueva marca</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Evento</label>
              <select value={fEvent} onChange={e => setFEvent(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "var(--surface-hover)", border: "1px solid var(--border)", color: "var(--text)" }}>
                {EVENTS.map(ev => <option key={ev} value={ev}>{ev}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Curso</label>
              <select value={fCourse} onChange={e => setFCourse(e.target.value as Course)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "var(--surface-hover)", border: "1px solid var(--border)", color: "var(--text)" }}>
                {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Tiempo</label>
              <input value={fTime} onChange={e => setFTime(e.target.value)} placeholder="26.04 o 1:02.45"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none font-mono"
                style={{ background: "var(--surface-hover)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Fecha</label>
              <input type="date" value={fDate} onChange={e => setFDate(e.target.value)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "var(--surface-hover)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Competencia</label>
              <input value={fMeet} onChange={e => setFMeet(e.target.value)} placeholder="Nombre del meet"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "var(--surface-hover)", border: "1px solid var(--border)", color: "var(--text)" }} />
            </div>
          </div>
          {fErr && <p className="mt-3 text-xs font-semibold" style={{ color: "var(--error)" }}>{fErr}</p>}
          <button type="submit"
            className="ximo-btn-press mt-4 rounded-xl px-5 py-2.5 text-xs font-bold transition-opacity hover:opacity-90"
            style={{ background: "#1ECECE", color: "#07131F" }}>
            Guardar marca
          </button>
        </form>
        </ScrollReveal>
      )}

      {/* ── Progression chart + summary ── */}
      <ScrollReveal delay={60}>
      <div className="mb-5 grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="rounded-2xl p-5" style={CARD}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-black" style={{ color: "var(--text)" }}>Progresión de tiempos</p>
              <p className="text-[11px]" style={{ color: "var(--text-label)" }}>Más abajo = más rápido · {course}</p>
            </div>
          </div>
          {/* Event chips */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {EVENTS.map((ev) => {
              const has = swims.some(s => s.event === ev && s.course === course);
              const active = selEvent === ev;
              return (
                <button key={ev} type="button" onClick={() => setSelEvent(ev)} disabled={!has}
                  className="rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={active
                    ? { background: "var(--teal-bg)", color: "var(--teal)", border: "1px solid var(--teal-border)" }
                    : { background: "var(--surface-hover)", color: "var(--text-label)", border: "1px solid var(--border-subtle)" }}>
                  {ev}
                </button>
              );
            })}
          </div>
          <ProgressionChart swims={eventSwims} target={TARGETS[`${selEvent}|${course}`]} />
        </div>

        {/* Summary */}
        <div className="rounded-2xl p-5" style={CARD}>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            {selEvent} · {course}
          </p>
          {summary ? (
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Mejor marca (PB)</p>
                <p className="mt-0.5 font-mono text-3xl font-black" style={{ color: "var(--gold)" }}>{fmtTime(summary.best.sec)}</p>
                <p className="text-[10px]" style={{ color: "var(--text-label)" }}>{summary.best.meet} · {fmtDate(summary.best.date)}</p>
              </div>
              <div className="h-px w-full" style={{ background: "var(--border)" }} />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={INNER}>
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Primera marca</p>
                  <p className="mt-0.5 font-mono text-sm font-bold" style={{ color: "var(--text)" }}>{fmtTime(summary.first.sec)}</p>
                </div>
                <div className="rounded-xl p-3" style={INNER}>
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Marcas</p>
                  <p className="mt-0.5 font-mono text-sm font-bold" style={{ color: "var(--text)" }}>{summary.count}</p>
                </div>
              </div>
              <div className="rounded-xl p-3" style={{ background: "var(--teal-bg)", border: "1px solid var(--teal-border)" }}>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Tiempo bajado</p>
                <p className="mt-0.5 font-mono text-xl font-black" style={{ color: "var(--teal)" }}>
                  −{summary.drop.toFixed(2)}s
                </p>
                <p className="text-[10px]" style={{ color: "var(--text-label)" }}>{summary.pct.toFixed(1)}% de mejora</p>
              </div>
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--text-label)" }}>Sin datos para este evento en {course}.</p>
          )}
        </div>
      </div>
      </ScrollReveal>

      {/* ── Best times table ── */}
      <ScrollReveal delay={80}>
      <div className="mb-5 rounded-2xl p-5" style={CARD}>
        <p className="mb-4 text-sm font-black" style={{ color: "var(--text)" }}>Mejores tiempos · {course}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Evento", "Mejor tiempo", "Meta", "Competencia", "Fecha"].map((h) => (
                  <th key={h} className="pb-2 text-left text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EVENTS.map((ev) => {
                const b = bests.get(ev);
                const target = TARGETS[`${ev}|${course}`];
                return (
                  <tr key={ev} className="transition-colors hover:bg-[var(--surface-hover)]"
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td className="py-2.5 text-sm font-semibold" style={{ color: "var(--text)" }}>{ev}</td>
                    <td className="py-2.5 font-mono text-sm font-bold" style={{ color: b ? "var(--gold)" : "var(--text-3)" }}>
                      {b ? fmtTime(b.sec) : "—"}
                    </td>
                    <td className="py-2.5 font-mono text-xs" style={{ color: "var(--text-label)" }}>
                      {target ? fmtTime(target) : "—"}
                    </td>
                    <td className="py-2.5 text-xs" style={{ color: "var(--text-label)" }}>{b ? b.meet : "—"}</td>
                    <td className="py-2.5 text-xs" style={{ color: "var(--text-label)" }}>{b ? fmtDate(b.date) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </ScrollReveal>

      {/* ── Meet history ── */}
      <ScrollReveal delay={100}>
      <div className="rounded-2xl p-5" style={CARD}>
        <p className="mb-4 text-sm font-black" style={{ color: "var(--text)" }}>Historial de competencias · {course}</p>
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-label)" }}>Sin registros en {course}.</p>
          ) : history.map((s) => {
            const isPB = bests.get(s.event)?.id === s.id;
            return (
              <div key={s.id} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5" style={INNER}>
                <div className="font-mono text-base font-bold w-20" style={{ color: isPB ? "var(--gold)" : "var(--text)" }}>
                  {fmtTime(s.sec)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{s.event}</p>
                  <p className="text-[11px]" style={{ color: "var(--text-label)" }}>{s.meet}</p>
                </div>
                {isPB && (
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                    style={{ background: "var(--gold-bg)", color: "var(--gold)", border: "1px solid var(--gold-border)" }}>
                    PB
                  </span>
                )}
                <span className="text-[11px]" style={{ color: "var(--text-label)" }}>{fmtDate(s.date)}</span>
              </div>
            );
          })}
        </div>
      </div>
      </ScrollReveal>
    </>
  );
}
