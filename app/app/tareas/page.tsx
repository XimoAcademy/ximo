"use client";

// app/app/tareas/page.tsx
// ximo Academy — Tareas: Centro diario de acción para atletas

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  cta: string;
}

interface ModuleGroup {
  id: string;
  name: string;
  icon: string;
  count: number;
  nextAction: string;
  color: string;
}

interface CompletedTask {
  id: number;
  title: string;
  completedDay: string;
}

interface Decision {
  id: number;
  title: string;
  deadline: string;
  impact: string;
  icon: string;
}

// ─── Static mock data ─────────────────────────────────────────────────────────

const todayTasks: Task[] = [
  {
    id: 1,
    title: "Actualizar tiempos después de competencia",
    category: "Progreso atlético",
    priority: "alta",
    status: "pendiente",
    estimatedTime: "10 min",
    relatedModule: "Progreso",
    cta: "Ir a Progreso",
  },
  {
    id: 2,
    title: "Enviar follow-up a Coach Boyle",
    category: "Recruiting",
    priority: "alta",
    status: "en progreso",
    estimatedTime: "15 min",
    relatedModule: "Coaches",
    cta: "Abrir Correo",
  },
  {
    id: 3,
    title: "Revisar universidades realistas",
    category: "Universidades",
    priority: "media",
    status: "pendiente",
    estimatedTime: "20 min",
    relatedModule: "Universidades",
    cta: "Ver Lista",
  },
  {
    id: 4,
    title: "Subir transcript académico",
    category: "Documentos",
    priority: "alta",
    status: "pendiente",
    estimatedTime: "5 min",
    relatedModule: "Documentos",
    cta: "Subir Ahora",
  },
  {
    id: 5,
    title: "Preparar correo para LIU",
    category: "Recruiting",
    priority: "media",
    status: "pendiente",
    estimatedTime: "25 min",
    relatedModule: "Correos",
    cta: "Redactar",
  },
];

const urgentTasks = [
  {
    id: 1,
    title: "Confirmar llamada pendiente",
    detail: "Coach Davis – Northwestern",
    deadline: "Hoy, 3:00 PM",
    icon: "📞",
  },
  {
    id: 2,
    title: "Preguntar claridad de beca",
    detail: "Athletic scholarship – Tier 1",
    deadline: "Mañana",
    icon: "💰",
  },
  {
    id: 3,
    title: "Revisar deadline real",
    detail: "Common App – Early Action",
    deadline: "Nov 1",
    icon: "📅",
  },
];

const moduleGroups: ModuleGroup[] = [
  { id: "coaches",        name: "Coaches",       icon: "🏊",  count: 4, nextAction: "Follow-up con Coach Boyle",      color: "#1D4ED8" },
  { id: "universidades",  name: "Universidades",  icon: "🎓",  count: 3, nextAction: "Comparar rankings D1 vs D3",     color: "#C9A84C" },
  { id: "documentos",     name: "Documentos",     icon: "📄",  count: 2, nextAction: "Subir transcript actualizado",   color: "#0B1F33" },
  { id: "progreso",       name: "Progreso",       icon: "⏱",  count: 1, nextAction: "Registrar marcas de ayer",       color: "#059669" },
  { id: "correos",        name: "Correos",        icon: "✉️",  count: 3, nextAction: "Redactar email para LIU",        color: "#7C3AED" },
];

const completedTasks: CompletedTask[] = [
  { id: 1, title: "Landing publicada",      completedDay: "Lunes" },
  { id: 2, title: "Waitlist conectada",     completedDay: "Martes" },
  { id: 3, title: "Comunidad creada",       completedDay: "Miércoles" },
  { id: 4, title: "Perfil actualizado",     completedDay: "Jueves" },
];

const upcomingDecisions: Decision[] = [
  { id: 1, title: "Definir top 3 universidades",    deadline: "Esta semana",  impact: "Alta",   icon: "🎯" },
  { id: 2, title: "Preparar updates de verano",     deadline: "Junio 1",      impact: "Media",  icon: "☀️" },
  { id: 3, title: "Revisar costo real anual",       deadline: "Junio 15",     impact: "Alta",   icon: "💵" },
  { id: 4, title: "Comparar becas y roster spot",   deadline: "Julio",        impact: "Alta",   icon: "⚖️" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const priorityStyles: Record<Priority, { bg: string; text: string; label: string }> = {
  alta:  { bg: "#FEE2E2", text: "#B91C1C", label: "Alta" },
  media: { bg: "#FEF9C3", text: "#92400E", label: "Media" },
  baja:  { bg: "#DCFCE7", text: "#166534", label: "Baja" },
};

const statusStyles: Record<Status, { bg: string; text: string; label: string }> = {
  pendiente:    { bg: "#F1F5F9", text: "#475569", label: "Pendiente" },
  "en progreso":{ bg: "#DBEAFE", text: "#1E40AF", label: "En progreso" },
  completada:   { bg: "#DCFCE7", text: "#166534", label: "Completada" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ bg, text, label }: { bg: string; text: string; label: string }) {
  return (
    <span style={{
      background: bg, color: text,
      fontSize: 11, fontWeight: 700,
      padding: "2px 10px", borderRadius: 20,
      letterSpacing: "0.04em", textTransform: "uppercase" as const,
    }}>
      {label}
    </span>
  );
}

function TaskCard({ task }: { task: Task }) {
  const p = priorityStyles[task.priority];
  const s = statusStyles[task.status];
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 12px rgba(11,31,51,0.07)",
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column" as const,
      gap: 10,
      transition: "box-shadow .2s",
      border: "1px solid #EDEAE2",
      cursor: "default",
    }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 24px rgba(11,31,51,0.13)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(11,31,51,0.07)")}
    >
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
        <Badge {...p} />
        <Badge {...s} />
      </div>
      <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#0D1B2A", lineHeight: 1.35 }}>
        {task.title}
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
        <Micro icon="🏷" label={task.category} />
        <Micro icon="⏱" label={task.estimatedTime} />
        <Micro icon="📂" label={task.relatedModule} />
      </div>
      <div style={{ marginTop: 4 }}>
        <CtaBtn label={task.cta} />
      </div>
    </div>
  );
}

function Micro({ icon, label }: { icon: string; label: string }) {
  return (
    <span style={{ fontSize: 12, color: "#5E7080", display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: 13 }}>{icon}</span> {label}
    </span>
  );
}

function CtaBtn({ label }: { label: string }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "#0B1F33" : "#1D4ED8",
        color: "#fff", border: "none",
        borderRadius: 10, padding: "8px 18px",
        fontSize: 13, fontWeight: 700, cursor: "pointer",
        transition: "background .18s",
        letterSpacing: "0.02em",
      }}
    >
      {label} →
    </button>
  );
}

function UrgentCard({ task }: { task: typeof urgentTasks[0] }) {
  return (
    <div style={{
      background: "#fff",
      borderLeft: "4px solid #C9A84C",
      borderRadius: 14,
      padding: "18px 20px",
      boxShadow: "0 2px 10px rgba(11,31,51,0.08)",
      display: "flex", flexDirection: "column" as const, gap: 6,
    }}>
      <div style={{ fontSize: 26 }}>{task.icon}</div>
      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#0D1B2A" }}>{task.title}</p>
      <p style={{ margin: 0, fontSize: 12, color: "#5E7080" }}>{task.detail}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
        <span style={{ fontSize: 11, background: "#FEF9C3", color: "#92400E", padding: "2px 10px", borderRadius: 20, fontWeight: 700 }}>
          ⚡ {task.deadline}
        </span>
      </div>
    </div>
  );
}

function ModuleCard({ m }: { m: ModuleGroup }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? m.color : "#fff",
        borderRadius: 16,
        padding: "20px 22px",
        boxShadow: "0 2px 12px rgba(11,31,51,0.08)",
        display: "flex", flexDirection: "column" as const, gap: 8,
        transition: "background .22s, color .22s",
        cursor: "pointer",
        border: `1.5px solid ${hover ? m.color : "#EDEAE2"}`,
      }}
    >
      <div style={{ fontSize: 30 }}>{m.icon}</div>
      <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: hover ? "#fff" : "#0D1B2A" }}>{m.name}</p>
      <span style={{
        fontSize: 12, fontWeight: 700,
        background: hover ? "rgba(255,255,255,0.2)" : "#F1F5F9",
        color: hover ? "#fff" : "#1D4ED8",
        padding: "2px 10px", borderRadius: 20, alignSelf: "flex-start" as const,
      }}>
        {m.count} tarea{m.count !== 1 ? "s" : ""}
      </span>
      <p style={{ margin: 0, fontSize: 12, color: hover ? "rgba(255,255,255,0.8)" : "#5E7080", lineHeight: 1.4 }}>
        {m.nextAction}
      </p>
    </div>
  );
}

function CompletedCard({ task }: { task: CompletedTask }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 14,
      padding: "16px 18px",
      boxShadow: "0 1px 8px rgba(11,31,51,0.06)",
      display: "flex", alignItems: "center", gap: 14,
      border: "1px solid #EDEAE2",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "linear-gradient(135deg,#059669,#10B981)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <span style={{ color: "#fff", fontSize: 18 }}>✓</span>
      </div>
      <div>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#0D1B2A" }}>{task.title}</p>
        <p style={{ margin: 0, fontSize: 11, color: "#5E7080" }}>Completada el {task.completedDay}</p>
      </div>
    </div>
  );
}

function DecisionCard({ d }: { d: Decision }) {
  const impactColor = d.impact === "Alta" ? "#B91C1C" : "#92400E";
  const impactBg    = d.impact === "Alta" ? "#FEE2E2"  : "#FEF9C3";
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "20px 22px",
      boxShadow: "0 2px 12px rgba(11,31,51,0.07)",
      display: "flex", flexDirection: "column" as const, gap: 8,
      border: "1px solid #EDEAE2",
    }}>
      <div style={{ fontSize: 28 }}>{d.icon}</div>
      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#0D1B2A", lineHeight: 1.4 }}>{d.title}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
        <span style={{ fontSize: 11, background: "#F1F5F9", color: "#475569", padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>
          📅 {d.deadline}
        </span>
        <span style={{ fontSize: 11, background: impactBg, color: impactColor, padding: "2px 10px", borderRadius: 20, fontWeight: 700 }}>
          Impacto {d.impact}
        </span>
      </div>
    </div>
  );
}

// ─── Progress Ring ─────────────────────────────────────────────────────────────

function ProgressRing({ value, max, radius = 38 }: { value: number; max: number; radius?: number }) {
  const stroke = 6;
  const normalizedRadius = radius - stroke;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = value / max;
  const strokeDashoffset = circumference - progress * circumference;
  return (
    <svg height={radius * 2} width={radius * 2} style={{ transform: "rotate(-90deg)" }}>
      <circle
        stroke="#EDEAE2" strokeWidth={stroke} fill="none"
        r={normalizedRadius} cx={radius} cy={radius}
      />
      <circle
        stroke="#C9A84C" strokeWidth={stroke} fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        r={normalizedRadius} cx={radius} cy={radius}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0B1F33", letterSpacing: "-0.02em" }}>{title}</h2>
        {subtitle && <p style={{ margin: "4px 0 0", fontSize: 13, color: "#5E7080" }}>{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TareasPage() {
  const rachaActual  = 7;
  const rachaObjetivo = 30;
  const rachaPercent  = rachaActual / rachaObjetivo;

  return (
    <div style={{
      background: "#F5F5F0",
      minHeight: "100vh",
      padding: "32px 24px 64px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#0D1B2A",
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 48 }}>

        {/* ── Page Header ─────────────────────────────────── */}
        <div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: "#0B1F33", letterSpacing: "-0.03em" }}>
            Tareas
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 15, color: "#5E7080", maxWidth: 520, lineHeight: 1.5 }}>
            Tu centro diario para saber qué hacer hoy y no dejar escapar oportunidades.
          </p>
        </div>

        {/* ── 1. Enfoque de hoy ───────────────────────────── */}
        <Section title="Enfoque de hoy">
          <div style={{
            background: "linear-gradient(135deg, #0B1F33 0%, #1D4ED8 100%)",
            borderRadius: 20,
            padding: "28px 32px",
            display: "flex",
            flexWrap: "wrap" as const,
            gap: 28,
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            {/* Left */}
            <div style={{ flex: "1 1 280px" }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
                Motivación del día
              </p>
              <h3 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
                "Pequeñas acciones diarias crean oportunidades reales."
              </h3>
              <div style={{ display: "flex", gap: 20 }}>
                <Stat label="Pendientes" value="5" light />
                <Stat label="En progreso" value="1" light />
                <Stat label="Urgentes" value="3" light />
              </div>
            </div>

            {/* Racha */}
            <div style={{
              background: "rgba(255,255,255,0.07)",
              borderRadius: 16,
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              gap: 10,
              flex: "0 0 auto",
            }}>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
                Racha actual
              </p>
              <div style={{ position: "relative" as const, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ProgressRing value={rachaActual} max={rachaObjetivo} radius={44} />
                <div style={{ position: "absolute" as const, textAlign: "center" as const }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#C9A84C", lineHeight: 1 }}>{rachaActual}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>días</div>
                </div>
              </div>
              <div style={{ textAlign: "center" as const }}>
                <p style={{ margin: 0, fontSize: 13, color: "#C9A84C", fontWeight: 700 }}>{rachaActual} / {rachaObjetivo} días</p>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Objetivo: racha de un mes</p>
              </div>
              <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
                <div style={{ width: `${rachaPercent * 100}%`, height: "100%", background: "#C9A84C", borderRadius: 3, transition: "width .6s ease" }} />
              </div>
            </div>
          </div>
        </Section>

        {/* ── 2. Tareas de hoy ────────────────────────────── */}
        <Section title="Tareas de hoy" subtitle={`${todayTasks.length} tareas activas`}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
            {todayTasks.map(t => <TaskCard key={t.id} task={t} />)}
          </div>
        </Section>

        {/* ── 3. Prioridad alta ───────────────────────────── */}
        <Section title="⚡ Prioridad alta" subtitle="No puedes dejar esto para mañana.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
            {urgentTasks.map(t => <UrgentCard key={t.id} task={t} />)}
          </div>
        </Section>

        {/* ── 4. Por módulo ───────────────────────────────── */}
        <Section title="Por módulo" subtitle="Tus tareas organizadas por área.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 14 }}>
            {moduleGroups.map(m => <ModuleCard key={m.id} m={m} />)}
          </div>
        </Section>

        {/* ── 5. Completadas esta semana ──────────────────── */}
        <Section title="✅ Completadas esta semana" subtitle="Buen trabajo. El progreso se acumula.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
            {completedTasks.map(t => <CompletedCard key={t.id} task={t} />)}
          </div>
        </Section>

        {/* ── 6. Próximas decisiones ──────────────────────── */}
        <Section title="🔮 Próximas decisiones" subtitle="Decisiones que formarán tu camino. Prepárate con tiempo.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
            {upcomingDecisions.map(d => <DecisionCard key={d.id} d={d} />)}
          </div>
        </Section>

      </div>
    </div>
  );
}

// ─── Mini stat ────────────────────────────────────────────────────────────────

function Stat({ label, value, light }: { label: string; value: string; light?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 900, color: light ? "#fff" : "#0B1F33" }}>{value}</div>
      <div style={{ fontSize: 11, color: light ? "rgba(255,255,255,0.55)" : "#5E7080", fontWeight: 600 }}>{label}</div>
    </div>
  );
}
