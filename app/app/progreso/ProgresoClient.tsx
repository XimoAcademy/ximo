"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import PageHeader from "../components/PageHeader";
import ScrollReveal from "../../components/ScrollReveal";
import { addProgressEntryAction, deleteProgressEntryAction } from "./actions";
import { parseTime, fmtTime } from "@/lib/util/swim-time";
import {
  buildStrokeStats,
  distanceOf,
  EVENTS_BY_COURSE,
  STROKE_AXES,
  TARGETS,
  type Course,
  type Stroke,
} from "@/lib/util/swim-stats";

type Swim = {
  id: string;
  event: string;
  course: Course;
  sec: number;
  date: string;
  meet: string;
};

const CARD = { background: "var(--surface)", border: "1px solid var(--border)" } as const;
const INNER = { background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" } as const;
const COURSES: Course[] = ["SCY", "LCM", "SCM"];

function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "2-digit" });
}

function ThemedSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="ximo-glass-chip flex w-full items-center justify-between gap-2 rounded-2xl px-3.5 py-2.5 text-sm outline-none"
        style={{ color: "var(--text)" }}>
        <span className="truncate">{value}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--text-label)" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>
          <path d="M2.5 4.5L6 8l3.5-3.5" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <ul className="absolute left-0 right-0 z-50 mt-2 max-h-64 overflow-y-auto overflow-hidden rounded-2xl p-1.5"
            style={{ background: "var(--bg-surf)", border: "1px solid var(--border)", boxShadow: "0 16px 40px rgba(0,0,0,0.35)" }}>
            {options.map((o) => {
              const sel = o === value;
              return (
                <li key={o}>
                  <button type="button" onClick={() => { onChange(o); setOpen(false); }}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--surface-hover)]"
                    style={sel ? { background: "var(--teal-bg)", color: "var(--teal)", fontWeight: 600 } : { color: "var(--text-2)" }}>
                    {o}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

function ProgressionChart({ swims, target }: { swims: Swim[]; target?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640, H = 260, padL = 52, padR = 18, padT = 20, padB = 36;
  const plotW = W - padL - padR, plotH = H - padT - padB;

  const pts = [...swims].sort((a, b) => a.date.localeCompare(b.date));
  if (pts.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-xl" style={INNER}>
        <p className="text-sm" style={{ color: "var(--text-label)" }}>
          Aún no hay tiempos para este evento. Agrega tu primer registro arriba.
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

  const x = (iso: string) => padL + ((new Date(iso).getTime() - t0) / span) * plotW;
  const yy = (sec: number) => padT + ((sec - lo) / (hi - lo)) * plotH;

  const linePts = pts.map(p => `${x(p.date).toFixed(1)},${yy(p.sec).toFixed(1)}`).join(" ");
  const areaPts = `${padL},${padT + plotH} ${linePts} ${(padL + plotW).toFixed(1)},${padT + plotH}`;
  const bestSec = Math.min(...secs);

  const gridY = [0, 0.25, 0.5, 0.75, 1].map(f => {
    const sec = hi - f * (hi - lo);
    return { yPos: padT + f * plotH, label: fmtTime(sec) };
  });

  const hp = hover !== null ? pts[hover] : null;
  const hx = hp ? x(hp.date) : 0;
  const hyy = hp ? yy(hp.sec) : 0;
  const tipW = 132, tipH = 48;
  const tipX = hp ? Math.min(Math.max(hx - tipW / 2, padL), padL + plotW - tipW) : 0;
  const tipAbove = hyy - tipH - 14 > 0;
  const tipY = tipAbove ? hyy - tipH - 12 : hyy + 12;
  const prevDrop = hp && hover! > 0 ? pts[hover! - 1].sec - hp.sec : null;

  return (
    <div className="overflow-hidden rounded-xl" style={INNER}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ display: "block" }} role="img" aria-label="Progresión de tiempos">
        <defs>
          <linearGradient id="prog-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {gridY.map((g, i) => (
          <g key={i}>
            <line x1={padL} y1={g.yPos} x2={padL + plotW} y2={g.yPos} stroke="var(--border-subtle)" strokeWidth="1" />
            <text x={padL - 8} y={g.yPos + 3} textAnchor="end" fontSize="9" fill="var(--text-label)" fontFamily="var(--font-geist-mono, monospace)">{g.label}</text>
          </g>
        ))}
        {target && target >= lo && target <= hi && (
          <g>
            <line x1={padL} y1={yy(target)} x2={padL + plotW} y2={yy(target)} stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.8" />
            <text x={padL + plotW} y={yy(target) - 5} textAnchor="end" fontSize="9" fontWeight="600" fill="var(--gold)">Meta {fmtTime(target)}</text>
          </g>
        )}
        <polygon points={areaPts} fill="url(#prog-fill)" />
        <polyline points={linePts} fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {hp && <line x1={hx} y1={padT} x2={hx} y2={padT + plotH} stroke="var(--teal)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />}
        {pts.map((p, i) => {
          const isBest = p.sec === bestSec;
          const isHover = hover === i;
          return <circle key={p.id} cx={x(p.date)} cy={yy(p.sec)} r={isHover ? 6 : isBest ? 5.5 : 3.5}
            fill={isBest ? "var(--gold)" : "var(--bg)"} stroke={isBest ? "var(--gold)" : "var(--teal)"} strokeWidth="2"
            style={{ transition: "r 0.12s ease" }} />;
        })}
        {pts.map((p) => p.sec === bestSec && hover === null ? (
          <text key={`pb${p.id}`} x={x(p.date)} y={yy(p.sec) - 12} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--gold)">
            PB {fmtTime(p.sec)}
          </text>
        ) : null)}
        {pts.map((p, i) => (
          <circle key={`hit${p.id}`} cx={x(p.date)} cy={yy(p.sec)} r={16} fill="transparent" style={{ cursor: "pointer" }}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
        ))}
        {hp && (
          <g pointerEvents="none">
            <rect x={tipX} y={tipY} width={tipW} height={tipH} rx={8} fill="var(--surface-2)" stroke="var(--teal-border)" strokeWidth="1" />
            <text x={tipX + 10} y={tipY + 17} fontSize="13" fontWeight="700" fill="var(--gold)" fontFamily="var(--font-geist-mono, monospace)">
              {fmtTime(hp.sec)}
              {prevDrop !== null && prevDrop > 0 && (
                <tspan fontSize="9" fontWeight="600" fill="var(--teal)" dx="6">▼ {prevDrop.toFixed(2)}s</tspan>
              )}
            </text>
            <text x={tipX + 10} y={tipY + 31} fontSize="9.5" fill="var(--text)">{hp.meet.length > 22 ? hp.meet.slice(0, 21) + "…" : hp.meet}</text>
            <text x={tipX + 10} y={tipY + 43} fontSize="9" fill="var(--text-label)">{fmtDate(hp.date)}</text>
          </g>
        )}
        <text x={padL} y={H - 12} textAnchor="start" fontSize="9" fill="var(--text-label)">{fmtDate(pts[0].date)}</text>
        {pts.length > 1 && (
          <text x={padL + plotW} y={H - 12} textAnchor="end" fontSize="9" fill="var(--text-label)">{fmtDate(pts[pts.length - 1].date)}</text>
        )}
      </svg>
    </div>
  );
}

const STROKE_COLOR: Record<Stroke, string> = {
  Libre: "var(--teal)", Mariposa: "var(--gold)", Dorso: "#c4b5fd", Pecho: "#6ee7b7", Combinado: "#fbbf24",
};

function sprintDistanceColor(t: number): string {
  const a = [239, 68, 68], b = [59, 130, 246];
  const c = a.map((x, i) => Math.round(x + (b[i] - x) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

function Specialties({ swims, course }: { swims: Swim[]; course: Course }) {
  const stats = buildStrokeStats(swims, course);
  const scored = stats.filter((d) => d.score !== null);

  // Sprint/distance bar uses ALL swims regardless of course
  let sprintN = 0, distN = 0;
  for (const s of swims) {
    const d = distanceOf(s.event);
    if (d > 0 && d <= 100) sprintN += 1;
    else if (d >= 200) distN += 1;
  }
  const sdTotal = sprintN + distN;
  const distFrac = sdTotal ? distN / sdTotal : 0.5;
  const sdColor = sprintDistanceColor(distFrac);
  const sdProfile = sdTotal === 0 ? null : distFrac < 0.4 ? "Velocista" : distFrac > 0.6 ? "Fondista" : "Equilibrado";

  if (scored.length === 0 && sdTotal === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-label)" }}>
        Registra marcas para ver tu perfil de especialidades.
      </p>
    );
  }

  const overall = scored.length > 0
    ? Math.round(scored.reduce((a, d) => a + (d.score as number), 0) / scored.length)
    : 0;
  const N = STROKE_AXES.length;
  const cx = 126, cy = 120, maxR = 80;
  const ang = (i: number) => (-90 + i * (360 / N)) * (Math.PI / 180);
  const pt = (i: number, level: number): [number, number] => [cx + Math.cos(ang(i)) * maxR * level, cy + Math.sin(ang(i)) * maxR * level];
  const ring = (level: number) => STROKE_AXES.map((_, i) => pt(i, level).map((n) => n.toFixed(1)).join(",")).join(" ");
  const dataPoly = stats.map((d, i) => pt(i, (d.score ?? 0) / 100).map((n) => n.toFixed(1)).join(",")).join(" ");
  const ranked = [...scored].sort((a, b) => (b.score as number) - (a.score as number));
  const missing = stats.filter((d) => d.score === null).map((d) => d.stroke);

  return (
    <div>
      {scored.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
          <div className="relative shrink-0" style={{ width: 252, height: 244 }}>
            <svg viewBox="0 0 252 244" className="h-[244px] w-[252px]" role="img" aria-label={`Índice de fortaleza por estilo: ${overall} de 100`}>
              <defs>
                <linearGradient id="radar-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.34" />
                  <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.10" />
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75, 1].map((lvl) => (
                <polygon key={lvl} points={ring(lvl)} fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
              ))}
              {STROKE_AXES.map((_, i) => {
                const [x, y] = pt(i, 1);
                return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border-subtle)" strokeWidth="1" />;
              })}
              <polygon points={dataPoly} fill="url(#radar-fill)" stroke="var(--teal)" strokeWidth="2.5" strokeLinejoin="round" />
              {stats.map((d, i) => {
                if (d.score === null) return null;
                const [x, y] = pt(i, d.score / 100);
                return <circle key={d.stroke} cx={x} cy={y} r={4} fill="var(--gold)" stroke="var(--bg)" strokeWidth="1.5" />;
              })}
              {stats.map((d, i) => {
                const [lx, ly] = pt(i, 1.18);
                const anchor = lx > cx + 6 ? "start" : lx < cx - 6 ? "end" : "middle";
                return (
                  <text key={d.stroke} x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle" fontSize="11" fontWeight="700"
                    fill={d.score === null ? "var(--text-3)" : "var(--text)"}>
                    {d.stroke}
                  </text>
                );
              })}
              <text x={cx} y={cy - 3} textAnchor="middle" fontSize="26" fontWeight="800" fill="var(--teal)">{overall}</text>
              <text x={cx} y={cy + 13} textAnchor="middle" fontSize="8" fontWeight="700" letterSpacing="0.12em" fill="var(--text-label)">ÍNDICE · {course}</text>
            </svg>
          </div>
          <div className="flex-1 min-w-[200px] space-y-2.5">
            {ranked.map((d) => (
              <div key={d.stroke}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: STROKE_COLOR[d.stroke] }} />
                    <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>{d.stroke}</span>
                  </div>
                  <span className="text-[11px] font-bold" style={{ color: "var(--text-label)" }}>
                    {d.score} · {d.events} {d.events === 1 ? "prueba" : "pruebas"}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--border-subtle)" }}>
                  <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: STROKE_COLOR[d.stroke] }} />
                </div>
              </div>
            ))}
            {missing.length > 0 && (
              <p className="pt-1 text-[10px]" style={{ color: "var(--text-3)" }}>Sin marcas en {course}: {missing.join(", ")}</p>
            )}
          </div>
        </div>
      )}

      {/* Sprint ↔ Distance indicator */}
      {sdTotal > 0 && (
        <div className={`border-t pt-4 ${scored.length > 0 ? "mt-5" : ""}`} style={{ borderColor: "var(--border)" }}>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-bold" style={{ color: "var(--text)" }}>Perfil: Velocista vs. Fondista</p>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-black" style={{ background: "var(--surface-hover)", color: sdColor, border: `1px solid ${sdColor}` }}>
              {sdProfile}
            </span>
          </div>
          <div className="relative h-3 w-full rounded-full" style={{ background: "linear-gradient(90deg, #ef4444 0%, #a855f7 50%, #3b82f6 100%)" }}>
            <div className="absolute top-1/2 rounded-full" style={{
              left: `calc(${(distFrac * 100).toFixed(1)}% - 10px)`, width: 20, height: 20, transform: "translateY(-50%)",
              background: sdColor, border: "3px solid var(--bg)", boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
            }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-bold">
            <span style={{ color: "#ef4444" }}>Velocidad · ≤100</span>
            <span style={{ color: "var(--text-label)" }}>{sprintN} veloc. · {distN} fondo (todos los cursos)</span>
            <span style={{ color: "#3b82f6" }}>200+ · Fondo</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProgresoClient({ initialSwims }: { initialSwims: Swim[] }) {
  const [swims, setSwims] = useState<Swim[]>(initialSwims);
  const [course, setCourse] = useState<Course>("SCY");
  const [selEvent, setSelEvent] = useState<string>(EVENTS_BY_COURSE.SCY[0]);
  const [showForm, setShowForm] = useState(false);
  const [customTargets, setCustomTargets] = useState<Record<string, string>>({});

  const [fEvent, setFEvent] = useState(EVENTS_BY_COURSE.SCY[0]);
  const [fCourse, setFCourse] = useState<Course>("SCY");
  const [fTime, setFTime] = useState("");
  const [fDate, setFDate] = useState("");
  const [fMeet, setFMeet] = useState("");
  const [fErr, setFErr] = useState("");
  const [pending, startTransition] = useTransition();

  const events = EVENTS_BY_COURSE[course];

  const bests = useMemo(() => {
    const map = new Map<string, Swim>();
    for (const s of swims) {
      if (s.course !== course) continue;
      const cur = map.get(s.event);
      if (!cur || s.sec < cur.sec) map.set(s.event, s);
    }
    return map;
  }, [swims, course]);

  const eventSwims = useMemo(() => swims.filter(s => s.event === selEvent && s.course === course), [swims, selEvent, course]);

  const summary = useMemo(() => {
    if (eventSwims.length === 0) return null;
    const sorted = [...eventSwims].sort((a, b) => a.date.localeCompare(b.date));
    const first = sorted[0], best = sorted.reduce((m, s) => (s.sec < m.sec ? s : m), sorted[0]);
    const drop = first.sec - best.sec;
    const pct = (drop / first.sec) * 100;
    return { first, best, drop, pct, count: sorted.length };
  }, [eventSwims]);

  const history = useMemo(() => [...swims].filter(s => s.course === course).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10), [swims, course]);

  const totalDrop = useMemo(() => {
    let total = 0;
    for (const ev of events) {
      const list = swims.filter(s => s.event === ev && s.course === course).sort((a, b) => a.date.localeCompare(b.date));
      if (list.length > 1) total += list[0].sec - Math.min(...list.map(s => s.sec));
    }
    return total;
  }, [swims, course, events]);

  const addSwim = (e: FormEvent) => {
    e.preventDefault();
    const sec = parseTime(fTime);
    if (!sec) { setFErr("Formato inválido. Ej: 26.04  o  1:02.45  o  4:15.89"); return; }
    if (!fDate) { setFErr("Selecciona la fecha de la competencia."); return; }
    setFErr("");
    const fd = new FormData();
    fd.set("event", fEvent);
    fd.set("course", fCourse);
    fd.set("time", fTime);
    fd.set("date", fDate);
    fd.set("meet", fMeet.trim());
    startTransition(async () => {
      const res = await addProgressEntryAction(null, fd);
      if (!res.ok || !res.swim) { setFErr(res.error ?? "No se pudo guardar."); return; }
      setSwims(prev => [...prev, res.swim!]);
      setFTime(""); setFMeet("");
      setSelEvent(fEvent); setCourse(fCourse); setShowForm(false);
    });
  };

  const removeSwim = (id: string) => {
    if (!confirm("¿Eliminar esta marca?")) return;
    setSwims(prev => prev.filter(s => s.id !== id));
    startTransition(async () => { await deleteProgressEntryAction(id); });
  };

  // Ensure selEvent stays valid when course changes
  const handleCourseChange = (c: Course) => {
    setCourse(c);
    const evs = EVENTS_BY_COURSE[c];
    if (!evs.includes(selEvent)) setSelEvent(evs[0]);
  };

  const getTarget = (ev: string): number | undefined => {
    const custom = customTargets[`${ev}|${course}`];
    if (custom) { const s = parseTime(custom); if (s) return s; }
    return TARGETS[`${ev}|${course}`];
  };

  return (
    <>
      <PageHeader
        title="Progreso deportivo"
        subtitle="Registra tus marcas, visualiza tu progresión y sigue cada mejora hacia tus metas. Los récords se rompen en silencio, un entrenamiento a la vez."
      />

      <ScrollReveal>
        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Eventos seguidos", value: String(bests.size) },
            { label: "Marcas registradas", value: String(swims.filter(s => s.course === course).length) },
            { label: "Tiempo total bajado", value: `${totalDrop.toFixed(1)}s` },
            { label: "Evento seleccionado", value: summary ? selEvent : "—" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4 ximo-card-3d" style={CARD}>
              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-label)" }}>{s.label}</p>
              <p className="mt-1 text-2xl font-black truncate" style={{ color: "var(--teal)" }}>{s.value}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5 rounded-xl p-1" style={INNER}>
          {COURSES.map((c) => (
            <button key={c} type="button" onClick={() => handleCourseChange(c)}
              className={`ximo-glass-chip rounded-lg px-3.5 py-1.5 text-xs font-bold ${course === c ? "active" : ""}`}>
              {c}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setShowForm(v => !v)} className="ximo-glass-btn teal text-xs">
          {showForm ? "Cerrar" : "+ Agregar marca"}
        </button>
      </div>

      {showForm && (
        <ScrollReveal>
          <form onSubmit={addSwim} className="mb-5 rounded-2xl p-5" style={CARD}>
            <p className="mb-4 text-sm font-black" style={{ color: "var(--text)" }}>Registrar nueva marca</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Evento</label>
                <ThemedSelect value={fEvent} options={EVENTS_BY_COURSE[fCourse]} onChange={setFEvent} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Curso</label>
                <ThemedSelect value={fCourse} options={COURSES} onChange={(v) => {
                  const c = v as Course;
                  setFCourse(c);
                  if (!EVENTS_BY_COURSE[c].includes(fEvent)) setFEvent(EVENTS_BY_COURSE[c][0]);
                }} />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Tiempo</label>
                <input value={fTime} onChange={e => setFTime(e.target.value)}
                  placeholder="Ej: 26.04 / 1:02.45" className="ximo-input font-mono" />
                <p className="mt-1 text-[9px]" style={{ color: "var(--text-3)" }}>Min:Seg.Cent · o solo Seg.Cent</p>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Fecha</label>
                <input type="date" value={fDate} onChange={e => setFDate(e.target.value)} className="ximo-input" />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Competencia</label>
                <input value={fMeet} onChange={e => setFMeet(e.target.value)} placeholder="Nombre del meet" className="ximo-input" />
              </div>
            </div>
            {fErr && <p className="mt-3 text-xs font-semibold" style={{ color: "var(--error)" }}>{fErr}</p>}
            <button type="submit" disabled={pending} className="ximo-glass-btn teal mt-4 text-xs disabled:opacity-50">
              {pending ? "Guardando…" : "Guardar marca"}
            </button>
          </form>
        </ScrollReveal>
      )}

      <ScrollReveal delay={60}>
        <div className="mb-5 grid gap-5 lg:grid-cols-[1fr_280px]">
          <div className="rounded-2xl p-5" style={CARD}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-black" style={{ color: "var(--text)" }}>Progresión de tiempos</p>
                <p className="text-[11px]" style={{ color: "var(--text-label)" }}>Más abajo = más rápido · {course}</p>
              </div>
            </div>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {events.map((ev) => {
                const has = swims.some(s => s.event === ev && s.course === course);
                const active = selEvent === ev;
                return (
                  <button key={ev} type="button" onClick={() => setSelEvent(ev)} disabled={!has}
                    className={`ximo-glass-chip rounded-lg px-2.5 py-1 text-[11px] font-bold ${active ? "active" : ""} ${!has ? "opacity-40" : ""}`}>
                    {ev}
                  </button>
                );
              })}
            </div>
            <ProgressionChart swims={eventSwims} target={getTarget(selEvent)} />
          </div>

          <div className="rounded-2xl p-5" style={CARD}>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>{selEvent} · {course}</p>
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
                  <p className="mt-0.5 font-mono text-xl font-black" style={{ color: "var(--teal)" }}>−{summary.drop.toFixed(2)}s</p>
                  <p className="text-[10px]" style={{ color: "var(--text-label)" }}>{summary.pct.toFixed(1)}% de mejora</p>
                </div>
              </div>
            ) : (
              <p className="text-sm" style={{ color: "var(--text-label)" }}>Sin datos para este evento en {course}.</p>
            )}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={70}>
        <div className="mb-5 rounded-2xl p-5" style={CARD}>
          <div className="mb-4">
            <p className="text-sm font-black" style={{ color: "var(--text)" }}>Especialidades · {course}</p>
            <p className="text-[11px]" style={{ color: "var(--text-label)" }}>
              Índice de fortaleza por estilo · 100 = nivel meta · Perfil velocista/fondista basado en todos tus eventos
            </p>
          </div>
          <Specialties swims={swims} course={course} />
        </div>
      </ScrollReveal>

      {/* Best Times table with editable target */}
      <ScrollReveal delay={80}>
        <div className="mb-5 rounded-2xl p-5" style={CARD}>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <p className="text-sm font-black" style={{ color: "var(--text)" }}>Mejores tiempos · {course}</p>
            <span className="text-[10px]" style={{ color: "var(--text-label)" }}>— Haz clic en la columna «Meta» para editar tu objetivo</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Evento", "Mejor tiempo", "Meta (editable)", "Competencia", "Fecha"].map((h) => (
                    <th key={h} className="pb-2 text-left text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => {
                  const b = bests.get(ev);
                  const defaultTarget = TARGETS[`${ev}|${course}`];
                  const customKey = `${ev}|${course}`;
                  const customVal = customTargets[customKey] ?? "";
                  return (
                    <tr key={ev} className="transition-colors hover:bg-[var(--surface-hover)]" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td className="py-2.5 text-sm font-semibold" style={{ color: "var(--text)" }}>{ev}</td>
                      <td className="py-2.5 font-mono text-sm font-bold" style={{ color: b ? "var(--gold)" : "var(--text-3)" }}>{b ? fmtTime(b.sec) : "—"}</td>
                      <td className="py-2 pr-2">
                        <input
                          value={customVal}
                          onChange={(e) => setCustomTargets(prev => ({ ...prev, [customKey]: e.target.value }))}
                          placeholder={defaultTarget ? fmtTime(defaultTarget) : "—"}
                          className="w-28 rounded-lg px-2 py-1 font-mono text-xs outline-none transition-colors"
                          style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)", color: "var(--text)" }}
                          title="Ingresa tu tiempo meta: 26.04 o 1:02.45"
                        />
                      </td>
                      <td className="py-2.5 text-xs" style={{ color: "var(--text-label)" }}>{b ? b.meet : "—"}</td>
                      <td className="py-2.5 text-xs" style={{ color: "var(--text-label)" }}>{b ? fmtDate(b.date) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[10px]" style={{ color: "var(--text-3)" }}>
            Los tiempos meta se aplican al gráfico de progresión. Formato: 26.04 o 1:02.45
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="rounded-2xl p-5" style={CARD}>
          <p className="mb-4 text-sm font-black" style={{ color: "var(--text)" }}>Historial de competencias · {course}</p>
          <div className="space-y-2">
            {history.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-label)" }}>Sin registros en {course}.</p>
            ) : history.map((s) => {
              const isPB = bests.get(s.event)?.id === s.id;
              return (
                <div key={s.id} className="group flex items-center gap-3 rounded-xl px-3.5 py-2.5" style={INNER}>
                  <div className="font-mono text-base font-bold w-20" style={{ color: isPB ? "var(--gold)" : "var(--text)" }}>{fmtTime(s.sec)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{s.event}</p>
                    <p className="text-[11px]" style={{ color: "var(--text-label)" }}>{s.meet}</p>
                  </div>
                  {isPB && (
                    <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: "var(--gold-bg)", color: "var(--gold)", border: "1px solid var(--gold-border)" }}>PB</span>
                  )}
                  <span className="text-[11px]" style={{ color: "var(--text-label)" }}>{fmtDate(s.date)}</span>
                  <button type="button" onClick={() => removeSwim(s.id)} aria-label={`Eliminar marca de ${s.event}`}
                    className="ximo-text-btn opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100">✕</button>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </>
  );
}
