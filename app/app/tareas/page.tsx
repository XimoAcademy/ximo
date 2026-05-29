"use client";

import { useState } from "react";
import Link from "next/link";
import ScrollReveal from "../../components/ScrollReveal";

type Priority = "alta" | "media" | "baja";
type Status   = "pendiente" | "en progreso" | "completada";

interface Task {
  id: number;
  title: string;
  category: string;
  priority: Priority;
  status: Status;
  estimatedTime: string;
  relatedModule: string;
  href: string;
}

const CARD  = "var(--surface)";
const BORDER = "var(--border)";

// Priority & status → dark-safe tokens
const P: Record<Priority, { bg: string; color: string; label: string }> = {
  alta:  { bg:"rgba(248,113,113,0.12)", color:"#f87171", label:"Alta" },
  media: { bg:"rgba(251,191,36,0.12)",  color:"#fbbf24", label:"Media" },
  baja:  { bg:"rgba(30,206,206,0.10)",  color:"var(--teal)", label:"Baja" },
};
const S: Record<Status, { bg: string; color: string; label: string }> = {
  pendiente:     { bg:"rgba(127,175,178,0.10)", color:"rgba(127,175,178,0.7)", label:"Pendiente" },
  "en progreso": { bg:"rgba(30,206,206,0.12)",  color:"var(--teal)",               label:"En progreso" },
  completada:    { bg:"rgba(5,150,105,0.12)",   color:"#6ee7b7",               label:"Completada" },
};

const todayTasks: Task[] = [
  { id:1, title:"Actualizar tiempos después de competencia",  category:"Progreso",     priority:"alta",  status:"pendiente",    estimatedTime:"10 min", relatedModule:"Progreso",     href:"/app/progreso" },
  { id:2, title:"Enviar follow-up a Coach Boyle",             category:"Recruiting",   priority:"alta",  status:"en progreso",  estimatedTime:"15 min", relatedModule:"Coaches",      href:"/app/coaches" },
  { id:3, title:"Revisar universidades realistas",            category:"Universidades",priority:"media", status:"pendiente",    estimatedTime:"20 min", relatedModule:"Universidades",href:"/app/universidades" },
  { id:4, title:"Subir transcript académico",                 category:"Documentos",   priority:"alta",  status:"pendiente",    estimatedTime:"5 min",  relatedModule:"Documentos",   href:"/app/documentos" },
  { id:5, title:"Preparar correo para LIU",                   category:"Recruiting",   priority:"media", status:"pendiente",    estimatedTime:"25 min", relatedModule:"Correos",      href:"/app/correos" },
];

const urgentTasks = [
  { id:1, title:"Confirmar llamada pendiente",    detail:"Coach Davis — Northwestern",         deadline:"Hoy, 3:00 PM" },
  { id:2, title:"Preguntar claridad de beca",     detail:"Athletic scholarship — Tier 1",       deadline:"Mañana" },
  { id:3, title:"Revisar deadline real",          detail:"Common App — Early Action",           deadline:"Nov 1" },
];

const moduleGroups = [
  { id:"coaches",       name:"Coaches",       count:4, nextAction:"Follow-up con Coach Boyle",    href:"/app/coaches" },
  { id:"universidades", name:"Universidades", count:3, nextAction:"Comparar rankings D1 vs D3",   href:"/app/universidades" },
  { id:"documentos",    name:"Documentos",    count:2, nextAction:"Subir transcript actualizado", href:"/app/documentos" },
  { id:"progreso",      name:"Progreso",      count:1, nextAction:"Registrar marcas de ayer",     href:"/app/progreso" },
  { id:"correos",       name:"Correos",       count:3, nextAction:"Redactar email para LIU",      href:"/app/correos" },
];

const completedTasks = [
  { id:1, title:"Landing publicada",    completedDay:"Lunes" },
  { id:2, title:"Waitlist conectada",   completedDay:"Martes" },
  { id:3, title:"Comunidad creada",     completedDay:"Miércoles" },
  { id:4, title:"Perfil actualizado",   completedDay:"Jueves" },
];

const upcomingDecisions = [
  { id:1, title:"Definir top 3 universidades",   deadline:"Esta semana", impact:"Alta" },
  { id:2, title:"Preparar updates de verano",    deadline:"Jun 1",       impact:"Media" },
  { id:3, title:"Revisar costo real anual",      deadline:"Jun 15",      impact:"Alta" },
  { id:4, title:"Comparar becas y roster spot",  deadline:"Julio",       impact:"Alta" },
];

// ─── Progress Ring SVG ────────────────────────────────────────
function ProgressRing({ value, max, r = 38 }: { value: number; max: number; r?: number }) {
  const stroke = 5;
  const norm = r - stroke;
  const circ = 2 * Math.PI * norm;
  const offset = circ - (value / max) * circ;
  return (
    <svg height={r * 2} width={r * 2} style={{ transform: "rotate(-90deg)" }} aria-hidden>
      <circle stroke="var(--border)" strokeWidth={stroke} fill="none" r={norm} cx={r} cy={r} />
      <circle
        stroke="var(--gold)" strokeWidth={stroke} fill="none"
        strokeDasharray={`${circ} ${circ}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        r={norm} cx={r} cy={r}
        style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
}

// ─── Pill badge ───────────────────────────────────────────────
function Pill({ bg, color, label }: { bg: string; color: string; label: string }) {
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{ background: bg, color }}>
      {label}
    </span>
  );
}

// ─── Section heading ──────────────────────────────────────────
function SectionTitle({ title, subtitle, count }: { title: string; subtitle?: string; count?: number }) {
  return (
    <div className="mb-4">
      <div className="flex items-baseline gap-2">
        <h2 className="text-base font-black tracking-tight sm:text-lg" style={{ color:"var(--text)" }}>{title}</h2>
        {count !== undefined && (
          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ background:"var(--border)", color:"rgba(127,175,178,0.7)" }}>
            {count}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-0.5 text-xs" style={{ color:"var(--text-label)" }}>{subtitle}</p>}
    </div>
  );
}

// ─── Task card ────────────────────────────────────────────────
function TaskCard({ task }: { task: Task }) {
  const p = P[task.priority];
  const s = S[task.status];
  return (
    <div className="flex flex-col gap-3 rounded-2xl p-4 ximo-lift"
      style={{ background: CARD, border:`1px solid ${BORDER}` }}>
      <div className="flex flex-wrap gap-1.5">
        <Pill {...p} />
        <Pill {...s} />
      </div>
      <p className="text-sm font-bold leading-snug" style={{ color:"var(--text)" }}>
        {task.title}
      </p>
      <div className="flex flex-wrap gap-3 text-[11px]" style={{ color:"var(--text-label)" }}>
        <span>{task.category}</span>
        <span style={{ color:"rgba(47,127,134,0.4)" }}>·</span>
        <span>{task.estimatedTime}</span>
        <span style={{ color:"rgba(47,127,134,0.4)" }}>·</span>
        <span>{task.relatedModule}</span>
      </div>
      <Link href={task.href}
        className="ximo-btn-press mt-auto inline-flex w-fit items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-opacity hover:opacity-80"
        style={{ background:"rgba(30,206,206,0.14)", color:"var(--teal)", border:"1px solid rgba(30,206,206,0.22)" }}>
        {task.href.split("/app/")[1]?.charAt(0).toUpperCase() + task.href.split("/app/")[1]?.slice(1)} →
      </Link>
    </div>
  );
}

// ─── Urgent card ──────────────────────────────────────────────
function UrgentCard({ task }: { task: typeof urgentTasks[0] }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-2xl p-4 ximo-card-3d"
      style={{ background: CARD, border:"1px solid rgba(201,168,76,0.22)" }}>
      <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black"
        style={{ background:"rgba(201,168,76,0.12)", color:"var(--gold)" }}>
        !
      </div>
      <p className="text-sm font-bold leading-snug" style={{ color:"var(--text)" }}>{task.title}</p>
      <p className="text-xs" style={{ color:"var(--text-label)" }}>{task.detail}</p>
      <span className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
        style={{ background:"rgba(201,168,76,0.12)", color:"var(--gold)" }}>
        {task.deadline}
      </span>
    </div>
  );
}

// ─── Module card ──────────────────────────────────────────────
function ModuleCard({ m }: { m: typeof moduleGroups[0] }) {
  return (
    <Link href={m.href}
      className="flex flex-col gap-2.5 rounded-2xl p-4 transition-all duration-200 hover:bg-[var(--border)]"
      style={{ background: CARD, border:`1px solid ${BORDER}` }}>
      <p className="text-sm font-black" style={{ color:"var(--text)" }}>{m.name}</p>
      <span className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
        style={{ background:"rgba(30,206,206,0.10)", color:"var(--teal)" }}>
        {m.count} {m.count !== 1 ? "tareas" : "tarea"}
      </span>
      <p className="text-xs leading-snug" style={{ color:"var(--text-label)" }}>{m.nextAction}</p>
    </Link>
  );
}

// ─── Completed card ───────────────────────────────────────────
function CompletedCard({ task }: { task: typeof completedTasks[0] }) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl p-3.5"
      style={{ background: CARD, border:`1px solid ${BORDER}` }}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
        style={{ background:"rgba(5,150,105,0.15)", color:"#6ee7b7" }}>
        ✓
      </div>
      <div>
        <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{task.title}</p>
        <p className="text-[11px]" style={{ color:"var(--text-label)" }}>El {task.completedDay}</p>
      </div>
    </div>
  );
}

// ─── Decision card ────────────────────────────────────────────
function DecisionCard({ d }: { d: typeof upcomingDecisions[0] }) {
  const isHigh = d.impact === "Alta";
  return (
    <div className="flex flex-col gap-2.5 rounded-2xl p-4 ximo-card-3d"
      style={{ background: CARD, border:`1px solid ${BORDER}` }}>
      <p className="text-sm font-bold leading-snug" style={{ color:"var(--text)" }}>{d.title}</p>
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ background:"var(--border-subtle)", color:"var(--text-label)" }}>
          {d.deadline}
        </span>
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={isHigh
            ? { background:"rgba(248,113,113,0.12)", color:"#f87171" }
            : { background:"rgba(251,191,36,0.12)", color:"#fbbf24" }}>
          {d.impact}
        </span>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────
export default function TareasPage() {
  const racha = 7;
  const meta  = 30;

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="ximo-fade-up">
        <h1 className="text-xl font-black tracking-tight sm:text-2xl" style={{ color:"var(--text)" }}>Tareas</h1>
        <p className="mt-1 text-sm" style={{ color:"var(--text-label)" }}>
          Tu centro diario. Sabe qué hacer hoy y no dejes escapar oportunidades.
        </p>
      </div>

      {/* ── Enfoque del día ── */}
      <section className="ximo-fade-up delay-75">
        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
          style={{
            background:"linear-gradient(135deg, #0B1F33 0%, #1A5566 100%)",
            border:"1px solid rgba(30,206,206,0.2)",
            boxShadow:"0 0 48px rgba(30,206,206,0.1), 0 8px 32px rgba(0,0,0,0.4)",
          }}>
          {/* Glow */}
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full ximo-glow-pulse"
            style={{ background:"radial-gradient(circle, rgba(30,206,206,0.18) 0%, transparent 70%)", filter:"blur(32px)" }} />

          <div className="relative flex flex-wrap items-start justify-between gap-6">
            {/* Left */}
            <div className="flex-1 min-w-0">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-widest" style={{ color:"rgba(30,206,206,0.5)" }}>
                Hoy
              </p>
              <h2 className="text-lg font-black leading-snug sm:text-xl" style={{ color:"#F2F6F4", maxWidth:"38ch" }}>
                Pequeñas acciones diarias crean oportunidades reales.
              </h2>
              <div className="mt-5 flex gap-6">
                {[
                  { label:"Pendientes",   value: todayTasks.filter(t => t.status === "pendiente").length },
                  { label:"En progreso",  value: todayTasks.filter(t => t.status === "en progreso").length },
                  { label:"Urgentes",     value: urgentTasks.length },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-black" style={{ color:"#F2F6F4" }}>{s.value}</p>
                    <p className="text-[11px] font-semibold" style={{ color:"rgba(255,255,255,0.5)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Racha ring */}
            <div className="flex flex-col items-center gap-2.5 rounded-2xl px-5 py-4"
              style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(30,206,206,0.15)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color:"rgba(30,206,206,0.5)" }}>Racha</p>
              <div className="relative flex items-center justify-center">
                <ProgressRing value={racha} max={meta} r={44} />
                <div className="absolute text-center">
                  <p className="text-lg font-black leading-none" style={{ color:"#E8CE4E" }}>{racha}</p>
                  <p className="text-[9px]" style={{ color:"rgba(255,255,255,0.4)" }}>días</p>
                </div>
              </div>
              <p className="text-[11px] font-semibold" style={{ color:"rgba(201,168,76,0.7)" }}>{racha}/{meta} días</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tareas de hoy ── */}
      <ScrollReveal delay={80}>
      <section>
        <SectionTitle title="Tareas de hoy" count={todayTasks.length} />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {todayTasks.map((t) => <TaskCard key={t.id} task={t} />)}
        </div>
      </section>
      </ScrollReveal>

      {/* ── Prioridad alta ── */}
      <ScrollReveal delay={120}>
      <section>
        <SectionTitle title="Prioridad alta" subtitle="No pueden esperar." count={urgentTasks.length} />
        <div className="grid gap-3 sm:grid-cols-3">
          {urgentTasks.map((t) => <UrgentCard key={t.id} task={t} />)}
        </div>
      </section>
      </ScrollReveal>

      {/* ── Por módulo ── */}
      <ScrollReveal delay={60}>
      <section>
        <SectionTitle title="Por módulo" subtitle="Tareas organizadas por área." />
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {moduleGroups.map((m) => <ModuleCard key={m.id} m={m} />)}
        </div>
      </section>
      </ScrollReveal>

      {/* ── Completadas y decisiones ── */}
      <ScrollReveal>
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <SectionTitle title="Completadas esta semana" count={completedTasks.length} />
          <div className="space-y-2">
            {completedTasks.map((t) => <CompletedCard key={t.id} task={t} />)}
          </div>
        </section>
        <section>
          <SectionTitle title="Próximas decisiones" subtitle="Prepárate con tiempo." count={upcomingDecisions.length} />
          <div className="grid gap-2.5 sm:grid-cols-2">
            {upcomingDecisions.map((d) => <DecisionCard key={d.id} d={d} />)}
          </div>
        </section>
      </div>
      </ScrollReveal>

    </div>
  );
}

