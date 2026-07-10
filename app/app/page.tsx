// app/app/page.tsx — Ximo Dashboard (real data)
import Link from "next/link";
import { GlassPanel, InnerTile, StatusBadge } from "./components/ui";
import ScrollReveal from "../components/ScrollReveal";
import { getDashboardData } from "@/lib/data/dashboard";
import { getBillingInfo } from "@/lib/data/billing";

const PRIORITY_TONE: Record<string, "error" | "warning" | "info"> = {
  alta: "error",
  media: "warning",
  baja: "info",
};

export default async function DashboardPage() {
  const [data, billing] = await Promise.all([getDashboardData(), getBillingInfo()]);
  const planLabel =
    billing?.planType === "annual"
      ? "Plan anual"
      : billing?.planType === "monthly"
      ? "Plan mensual"
      : "Suscripción activa";
  const name = data?.identity?.name ?? "Atleta";
  const firstName = name.split(" ")[0];
  const sport = data?.identity?.sport ?? "Natación";
  const gradYear = data?.identity?.gradYear ?? null;
  const counts = data?.counts ?? {
    universities: 0,
    coaches: 0,
    documents: 0,
    documentsReady: 0,
    tasks: 0,
    progress: 0,
  };
  const upcoming = data?.upcomingTasks ?? [];
  const isEmpty = data?.isEmpty ?? true;

  const statCards = [
    { label: "Universidades", value: String(counts.universities), hint: counts.universities ? "en seguimiento" : "sin agregar", href: "/app/universidades", accent: "var(--teal)" },
    { label: "Coaches", value: String(counts.coaches), hint: counts.coaches ? "en tu CRM de coaches" : "sin agregar", href: "/app/coaches", accent: "var(--gold)" },
    { label: "Documentos", value: `${counts.documentsReady}/${counts.documents || 0}`, hint: "listos", href: "/app/documentos", accent: "var(--text)" },
    { label: "Tareas", value: String(counts.tasks), hint: counts.tasks ? "activas" : "sin tareas", href: "/app/tareas", accent: "var(--teal)" },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative mb-5 overflow-hidden rounded-2xl p-6 sm:p-8 ximo-fade-up"
        style={{ background: "var(--hero-bg)", border: "1px solid var(--border-strong)", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
      >
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl pointer-events-none ximo-glow-pulse"
          style={{ background: "radial-gradient(circle, rgba(47,127,134,0.25) 0%, transparent 70%)" }} />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <StatusBadge tone="gold">{planLabel}</StatusBadge>
              <StatusBadge tone="neutral">{[sport, gradYear ? `Clase ${gradYear}` : null].filter(Boolean).join(" · ")}</StatusBadge>
            </div>
            <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>
              Hola, {firstName}.
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
              Tu centro de mando deportivo: convierte correos, dudas, tiempos y oportunidades en un camino claro.
            </p>
            <p className="mt-2 text-xs italic" style={{ color: "var(--gold)" }}>
              Un día vas a ser quien soñaste. Empieza hoy.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/app/recruiting" className="ximo-glass-btn teal text-xs">Ver Recruiting →</Link>
              <Link href="/app/tareas" className="ximo-glass-btn gold text-xs">Tareas del día →</Link>
            </div>
          </div>

          {/* Real profile mini-card */}
          <div className="shrink-0 rounded-2xl p-4 ximo-glow-teal"
            style={{ background: "var(--hero-panel)", border: "1px solid var(--hero-panel-bd)", minWidth: 168 }}>
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Tu perfil</p>
            <p className="mt-1 text-lg font-black" style={{ color: "var(--text)" }}>{sport}</p>
            <p className="text-[11px]" style={{ color: "var(--text-label)" }}>
              {gradYear ? `Clase ${gradYear}` : "Año por definir"}
            </p>
            <Link href="/app/perfil" className="mt-3 inline-block text-[11px] font-semibold" style={{ color: "var(--teal)" }}>
              Ver perfil →
            </Link>
          </div>
        </div>
      </section>

      {/* ── First-run onboarding nudge ── */}
      {isEmpty && (
        <ScrollReveal>
          <GlassPanel tone="teal" className="mb-5 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black" style={{ color: "var(--text)" }}>
                  Configura tu camino en Ximo
                </p>
                <p className="mt-1 max-w-xl text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                  Tu cuenta está lista. Agrega tu perfil deportivo, tus primeras universidades y documentos para
                  que tu dashboard empiece a trabajar para ti.
                </p>
              </div>
              <Link href="/app/onboarding" className="ximo-glass-btn teal text-xs">
                Empezar configuración →
              </Link>
            </div>
          </GlassPanel>
        </ScrollReveal>
      )}

      {/* ── Stats (real counts) ── */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <ScrollReveal key={s.label} delay={i * 60}>
            <Link href={s.href} className="block h-full">
              <GlassPanel className="h-full p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-label)" }}>{s.label}</p>
                <p className="mt-1 text-2xl font-black" style={{ color: s.accent }}>{s.value}</p>
                <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-label)" }}>{s.hint}</p>
              </GlassPanel>
            </Link>
          </ScrollReveal>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
        {/* Left: modules */}
        <div className="space-y-5">
          <ScrollReveal delay={60}>
            <GlassPanel className="p-5">
              <h2 className="mb-1 text-base font-black" style={{ color: "var(--text)" }}>Tus módulos</h2>
              <p className="mb-4 text-xs" style={{ color: "var(--text-label)" }}>Todo tu proceso, en un solo lugar.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Recruiting", desc: "Tu pipeline de universidades por etapas.", href: "/app/recruiting" },
                  { label: "Coaches", desc: "CRM de entrenadores y seguimiento.", href: "/app/coaches" },
                  { label: "Progreso", desc: "Tiempos, marcas y metas por estilo.", href: "/app/progreso" },
                  { label: "Cursos", desc: "Aprende el proceso paso a paso.", href: "/app/cursos" },
                  { label: "Documentos", desc: "Ten listo todo lo que te pidan.", href: "/app/documentos" },
                  { label: "Comunidad", desc: "Únete al Discord de atletas Ximo.", href: "/app/comunidad" },
                ].map((m) => (
                  <Link key={m.href} href={m.href}>
                    <InnerTile className="h-full px-4 py-3">
                      <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{m.label}</p>
                      <p className="mt-0.5 text-[11px] leading-snug" style={{ color: "var(--text-label)" }}>{m.desc}</p>
                    </InnerTile>
                  </Link>
                ))}
              </div>
            </GlassPanel>
          </ScrollReveal>

          {/* Community CTA */}
          <ScrollReveal delay={100}>
            <GlassPanel tone="gold" className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black" style={{ color: "var(--text)" }}>Comunidad Ximo en Discord</p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--text-label)" }}>
                    Comparte dudas, avances y experiencias con otros atletas en nuestro Discord.
                  </p>
                </div>
                <Link href="/app/comunidad" className="ximo-glass-btn dark text-xs">Unirme →</Link>
              </div>
            </GlassPanel>
          </ScrollReveal>
        </div>

        {/* Right: upcoming tasks */}
        <div className="space-y-5">
          <ScrollReveal delay={80}>
            <GlassPanel className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-black" style={{ color: "var(--text)" }}>Próximas acciones</h2>
                <Link href="/app/tareas" className="text-xs font-semibold" style={{ color: "var(--teal)" }}>Ver todas →</Link>
              </div>
              {upcoming.length === 0 ? (
                <InnerTile className="px-4 py-6 text-center">
                  <p className="text-sm font-bold" style={{ color: "var(--text-label)" }}>Sin tareas pendientes</p>
                  <p className="mt-1 text-[11px]" style={{ color: "var(--text-3)" }}>
                    Crea tu primer plan de acción desde Tareas.
                  </p>
                </InnerTile>
              ) : (
                <ul className="space-y-2">
                  {upcoming.map((t) => (
                    <li key={t.id}>
                      <Link href={`/app/tareas`}>
                        <InnerTile className="flex items-center gap-3 px-3.5 py-3">
                          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--teal)" }} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold" style={{ color: "var(--text)" }}>{t.title}</p>
                            {t.due_date && (
                              <p className="text-[11px]" style={{ color: "var(--text-label)" }}>{t.due_date}</p>
                            )}
                          </div>
                          {t.priority && (
                            <StatusBadge tone={PRIORITY_TONE[t.priority] ?? "neutral"}>{t.priority}</StatusBadge>
                          )}
                        </InnerTile>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </GlassPanel>
          </ScrollReveal>

          {/* Quick access */}
          <ScrollReveal delay={120}>
            <GlassPanel className="p-5">
              <h2 className="mb-3 text-base font-black" style={{ color: "var(--text)" }}>Accesos rápidos</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Recruiting", href: "/app/recruiting" },
                  { label: "Correos", href: "/app/correos" },
                  { label: "SAT/TOEFL", href: "/app/sat-toefl" },
                  { label: "Configuración", href: "/app/settings" },
                ].map((l) => (
                  <Link key={l.href} href={l.href} className="ximo-glass-btn dark text-center text-[11px]">
                    {l.label}
                  </Link>
                ))}
              </div>
            </GlassPanel>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
