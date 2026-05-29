"use client";
// app/app/page.tsx — Ximo Dashboard
import Link from "next/link";
import { Badge, Card, ProgressBar, SectionHeader } from "./components/ui";
import ScrollReveal from "../components/ScrollReveal";

const stats = [
  { label: "Universidades", value: "12", sub: "3 en seguimiento",  icon: "◫", href: "/app/universidades", color: "var(--teal-muted)" },
  { label: "Coaches",       value: "7",  sub: "2 con interés alto", icon: "⬘", href: "/app/coaches",       color: "var(--gold)" },
  { label: "Respuestas",    value: "4",  sub: "1 llamada pendiente", icon: "✉", href: "/app/correos",       color: "var(--teal)" },
  { label: "Documentos",    value: "6/10",sub: "4 pendientes",      icon: "▣", href: "/app/documentos",    color: "var(--text)" },
];

const pipeline = [
  { label: "Identificadas", count: 12, pct: 100 },
  { label: "Contactadas",   count: 7,  pct: 58 },
  { label: "Respondieron",  count: 4,  pct: 33 },
  { label: "Interesadas",   count: 2,  pct: 17 },
  { label: "Oferta",        count: 1,  pct: 8 },
];

const universities = [
  { name: "Niagara University", div: "D1 · NY", status: "Interés real",  sc: "rgba(5,150,105,0.12)", tc: "#6ee7b7", next: "Preguntar beca oficial" },
  { name: "LIU Brooklyn",       div: "D1 · NY", status: "Respondió",     sc: "rgba(201,168,76,0.1)", tc: "var(--gold)", next: "Enviar updates de verano" },
  { name: "Towson University",  div: "D1 · MD", status: "Llamada",       sc: "var(--border)",tc: "var(--teal)", next: "Confirmar llamada" },
];

const swimEvents = [
  { event: "50 libre",     current: "26.0", target: "25.2", progress: 72 },
  { event: "100 libre",    current: "58.0", target: "56.5", progress: 58 },
  { event: "100 mariposa", current: "63.0", target: "61.0", progress: 45 },
];

const rankings = [
  { rank: 1, name: "Manny",      metric: "12d racha", you: true  },
  { rank: 2, name: "Fer Swim",   metric: "10d racha", you: false },
  { rank: 3, name: "Carlos",     metric: "9d racha",  you: false },
  { rank: 4, name: "Valeria",    metric: "7d racha",  you: false },
];

const communityPreview = [
  { user: "Carlos Nado", initials: "CN", tag: "Duda",  tagC: "var(--border)", tagT: "var(--teal)",  text: "¿26.8 en 50 libre es realista para D1?",              likes: 8,  replies: 5 },
  { user: "Fer Swim",    initials: "FS", tag: "Logro", tagC: "rgba(5,150,105,0.12)",  tagT: "#6ee7b7",  text: "Nuevo PB en 50 libre: 25.1. El trabajo da resultados.", likes: 22, replies: 9 },
];

const nextActions = [
  { title: "Actualizar tiempos post-competencia", date: "Esta semana", p: true  },
  { title: "Preparar correo de seguimiento",      date: "Mar 25",      p: true  },
  { title: "Revisar universidades realistas",     date: "Mar 28",      p: false },
  { title: "Subir documentos clave",              date: "Abr 1",       p: false },
];

const STREAK = { current: 7, goal: 30 };

// Dark card helper
function DarkCard({ children, className = "", glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <div className={`rounded-2xl ximo-card-3d ${className}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: glow
          ? "0 0 30px var(--border), 0 4px 24px rgba(0,0,0,0.4)"
          : "0 4px 24px rgba(0,0,0,0.3)",
      }}>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const streakPct = Math.round((STREAK.current / STREAK.goal) * 100);
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative mb-5 overflow-hidden rounded-2xl p-6 sm:p-8 ximo-fade-up"
        style={{
          background: "linear-gradient(135deg, #07131F 0%, #112538 50%, #1F5F66 100%)",
          border: "1px solid var(--border-strong)",
          boxShadow: "0 0 60px var(--border), 0 8px 32px rgba(0,0,0,0.5)",
        }}>
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl pointer-events-none ximo-glow-pulse"
          style={{ background: "radial-gradient(circle, rgba(47,127,134,0.25) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full blur-2xl pointer-events-none ximo-glow-pulse delay-300"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)" }} />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="ximo-fade-up">
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge className="border" style={{ borderColor: "rgba(201,168,76,0.25)", background: "rgba(201,168,76,0.1)", color: "var(--gold)" }}>Suscripción activa</Badge>
              <Badge className="border" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }}>Atleta fundador</Badge>
            </div>
            <h1 className="text-2xl font-black text-on-dark sm:text-3xl" style={{ textShadow: "0 2px 20px rgba(47,127,134,0.4)" }}>
              Tu centro de mando deportivo.
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed" style={{ color: "rgba(127,175,178,0.7)" }}>
              Convierte correos, dudas, tiempos y oportunidades en un camino claro.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/app/recruiting"
                className="rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 hover:scale-105"
                style={{ background: "var(--teal-muted)", color: "white", boxShadow: "0 0 16px rgba(47,127,134,0.4)" }}>
                Ver Recruiting {'->'}
              </Link>
              <Link href="/app/tareas"
                className="rounded-xl border px-4 py-2 text-xs font-bold transition-all duration-200 hover:scale-105"
                style={{ borderColor: "rgba(201,168,76,0.25)", color: "var(--gold)", background: "rgba(201,168,76,0.06)" }}>
                Tareas del día {'->'}
              </Link>
            </div>
          </div>

          {/* Streak — lives on the always-dark hero, so text stays light */}
          <div className="shrink-0 rounded-2xl p-4 ximo-glow-teal ximo-fade-up delay-200"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(30,206,206,0.25)", minWidth: 164 }}>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Racha diaria</p>
            <p className="text-4xl font-black" style={{ color: "#E8CE4E" }}>{STREAK.current}</p>
            <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>días consecutivos</p>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="h-full rounded-full ximo-progress-bar"
                style={{ width: `${streakPct}%`, background: "linear-gradient(90deg,#1ECECE,#E8CE4E)", "--progress-width": `${streakPct}%` } as React.CSSProperties} />
            </div>
            <p className="mt-1 text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>Meta: {STREAK.goal} días</p>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 60}>
          <Link href={s.href}>
            <DarkCard className="p-4 ximo-lift h-full">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-label)" }}>{s.label}</p>
                <span className="text-[11px] opacity-30 text-brand">{s.icon}</span>
              </div>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-label)" }}>{s.sub}</p>
            </DarkCard>
          </Link>
          </ScrollReveal>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid gap-5 xl:grid-cols-[1fr_288px]">
        <div className="space-y-5">

          {/* Recruiting preview header */}
          <div
            className="ximo-fade-up delay-200 flex items-center justify-between rounded-2xl px-5 py-4"
            style={{ background: "var(--surface-hover)", border: "1px solid var(--border)" }}
          >
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Recruiting Dashboard</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-label)" }}>Tu centro de mando deportivo activo</p>
            </div>
            <Link href="/app/recruiting"
              className="rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 hover:opacity-80"
              style={{ background: "var(--border)", border: "1px solid rgba(47,127,134,0.3)", color: "var(--teal)" }}>
              Abrir →
            </Link>
          </div>

          {/* Pipeline */}
          <DarkCard className="p-4 sm:p-5 ximo-fade-up delay-200" glow>
            <SectionHeader dark title="Pipeline de recruiting" subtitle="Etapas del proceso" action="Ver recruiting →" actionHref="/app/recruiting" />
            <div className="grid grid-cols-5 gap-2">
              {pipeline.map((stage) => (
                <div key={stage.label} className="rounded-xl p-3 text-center transition-all duration-200 hover:scale-105"
                  style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
                  <p className="text-xl font-black text-brand">{stage.count}</p>
                  <p className="mt-0.5 text-[9px] font-bold leading-tight" style={{ color: "var(--teal)" }}>{stage.label}</p>
                  <div className="mt-2 h-0.5 w-full rounded-full" style={{ background: "var(--border)" }}>
                    <div className="h-full rounded-full ximo-progress-bar"
                      style={{ width: `${stage.pct}%`, background: "linear-gradient(90deg,var(--teal-muted),var(--teal))", "--progress-width": `${stage.pct}%` } as React.CSSProperties} />
                  </div>
                </div>
              ))}
            </div>
          </DarkCard>

          {/* Universities + Progress */}
          <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
            <DarkCard className="p-4 sm:p-5 ximo-fade-up delay-300">
              <SectionHeader dark title="Universidades activas" subtitle="Vista rápida" action="Ver todas →" actionHref="/app/universidades" />
              <div className="space-y-2">
                {universities.map((uni) => (
                  <div key={uni.name} className="flex items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:scale-[1.01]"
                    style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-brand truncate">{uni.name}</h3>
                        <span className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                          style={{ background: uni.sc, color: uni.tc }}>{uni.status}</span>
                      </div>
                      <p className="text-[10px]" style={{ color: "var(--text-label)" }}>{uni.div}</p>
                      <p className="mt-0.5 text-[11px] font-semibold" style={{ color: "var(--teal-muted)" }}>→ {uni.next}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DarkCard>

            <DarkCard className="p-4 ximo-fade-up delay-300">
              <SectionHeader dark title="Progreso" subtitle="Marcas vs metas" action="Ver →" actionHref="/app/progreso" />
              <div className="space-y-4">
                {swimEvents.map((ev) => (
                  <div key={ev.event}>
                    <div className="mb-1.5 flex justify-between">
                      <span className="text-xs font-bold text-brand">{ev.event}</span>
                      <span className="font-mono text-[10px]" style={{ color: "var(--text-label)" }}>{ev.current}→{ev.target}s</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--border-subtle)" }}>
                      <div className="h-full rounded-full ximo-progress-bar"
                        style={{ width: `${ev.progress}%`, background: "linear-gradient(90deg,var(--teal-muted),var(--gold))", "--progress-width": `${ev.progress}%` } as React.CSSProperties} />
                    </div>
                  </div>
                ))}
              </div>
            </DarkCard>
          </div>

          {/* Community preview */}
          <DarkCard className="p-4 sm:p-5 ximo-fade-up delay-400">
            <SectionHeader dark title="Comunidad" subtitle="Lo más reciente" action="Ver comunidad →" actionHref="/app/comunidad" />
            <div className="space-y-2">
              {communityPreview.map((post) => (
                <div key={post.user} className="flex gap-3 rounded-xl p-3 transition-all duration-200 hover:scale-[1.01]"
                  style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black"
                    style={{ background: "var(--border)", color: "var(--teal)" }}>
                    {post.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[11px] font-bold text-brand">{post.user}</p>
                      <span className="rounded-full px-2 py-0.5 text-[9px] font-bold"
                        style={{ background: post.tagC, color: post.tagT }}>{post.tag}</span>
                    </div>
                    <p className="text-xs leading-snug" style={{ color: "var(--text-2)" }}>{post.text}</p>
                    <div className="mt-1.5 flex gap-3">
                      <span className="text-[10px]" style={{ color: "var(--text-label)" }}>♥ {post.likes}</span>
                      <span className="text-[10px]" style={{ color: "var(--text-label)" }}>💬 {post.replies}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/app/comunidad"
                className="block w-full rounded-xl py-2.5 text-center text-xs font-bold transition-all duration-200 hover:bg-[var(--surface-hover)]"
                style={{ border: "1px dashed var(--border-strong)", color: "var(--teal)" }}>
                Ver toda la comunidad →
              </Link>
            </div>
          </DarkCard>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <DarkCard className="p-4 ximo-fade-up delay-100">
            <SectionHeader dark title="Próximas acciones" subtitle="Esta semana" />
            <ul className="space-y-2">
              {nextActions.map((task, i) => (
                <li key={task.title} className="flex gap-2.5 rounded-xl p-3"
                  style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-black"
                    style={task.p ? { background: "var(--teal-muted)", color: "white" } : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[11px] font-bold leading-snug text-brand">{task.title}</p>
                    <p className="mt-0.5 text-[10px] font-semibold" style={{ color: "var(--teal-muted)" }}>{task.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </DarkCard>

          <DarkCard className="p-4 ximo-fade-up delay-200">
            <SectionHeader dark title="Ranking comunidad" subtitle="Top racha" action="Comunidad →" actionHref="/app/comunidad" />
            <div className="space-y-1.5">
              {rankings.map((r) => (
                <div key={r.name} className="flex items-center gap-2.5 rounded-xl px-3 py-2"
                  style={r.you ? { background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" } : { border: "1px solid var(--border-subtle)" }}>
                  <span className="w-4 text-center text-[10px] font-black" style={{ color: "var(--text-label)" }}>#{r.rank}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-brand truncate">
                      {r.name} {r.you && <span style={{ color: "var(--gold)" }}>(tú)</span>}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-label)" }}>{r.metric}</p>
                  </div>
                </div>
              ))}
            </div>
          </DarkCard>

          {/* Brands */}
          <DarkCard className="overflow-hidden ximo-fade-up delay-300">
            <div className="p-4" style={{ background: "linear-gradient(135deg,var(--border),transparent)" }}>
              <p className="text-xs font-black text-brand">Marcas y oportunidades</p>
              <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-label)" }}>Curadas para atletas ximo</p>
            </div>
            <div className="p-4 space-y-1.5">
              {["Speedo","Arena","GNC","Aquasport"].map((brand) => (
                <div key={brand} className="flex items-center justify-between rounded-lg px-3 py-2"
                  style={{ border: "1px solid var(--border-subtle)" }}>
                  <p className="text-xs font-bold text-brand">{brand}</p>
                  <span className="text-[9px] rounded-full px-2 py-0.5 font-bold"
                    style={{ border: "1px solid var(--border-strong)", color: "var(--teal-muted)", background: "var(--border-subtle)" }}>Activa</span>
                </div>
              ))}
              <Link href="/app/marcas"
                className="mt-2 block w-full rounded-xl py-2.5 text-center text-xs font-bold transition-all duration-200 hover:bg-[rgba(47,127,134,0.25)]"
                style={{ background: "var(--border)", color: "var(--teal)", border: "1px solid var(--border-strong)" }}>
                Explorar marcas →
              </Link>
            </div>
          </DarkCard>

          <DarkCard className="p-4 ximo-fade-up delay-400">
            <SectionHeader dark title="Accesos rápidos" />
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Recruiting",  href: "/app/recruiting" },
                { label: "Correos",     href: "/app/correos" },
                { label: "Documentos",  href: "/app/documentos" },
                { label: "SAT/TOEFL",   href: "/app/sat-toefl" },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="rounded-xl px-3 py-2.5 text-center text-[11px] font-bold text-brand transition-all duration-200 hover:scale-105"
                  style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)", color: "var(--text-2)" }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </DarkCard>
        </div>
      </div>

      <footer className="mt-5 rounded-xl py-2.5 text-center text-[11px]"
        style={{ border: "1px dashed var(--border-subtle)", color: "var(--text-label)" }}>
        Ximo · Suscripción activa · Datos de muestra
      </footer>
    </>
  );
}
