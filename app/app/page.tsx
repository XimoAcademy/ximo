// Later: protect route with auth
// Later: check subscription status
import Link from "next/link";
import { Badge, Card, ProgressBar, SectionHeader } from "./components/ui";

const statCards = [
  {
    label: "Universidades",
    value: "12",
    sub: "3 en seguimiento activo",
    color: "text-[#1D4ED8]",
    href: "/app/universidades",
    icon: "◫",
  },
  {
    label: "Coaches",
    value: "7",
    sub: "2 con interés alto",
    color: "text-[#C9A84C]",
    href: "/app/coaches",
    icon: "⬘",
  },
  {
    label: "Respuestas",
    value: "4",
    sub: "1 llamada pendiente",
    color: "text-emerald-600",
    href: "/app/correos",
    icon: "✉",
  },
  {
    label: "Documentos",
    value: "5/10",
    sub: "6 listos · 4 pendientes",
    color: "text-[#0B1F33]",
    href: "/app/documentos",
    icon: "▣",
  },
];

const pipelineStages = [
  { label: "Identificadas", count: 12, color: "#9AB0BC", note: "En radar" },
  { label: "Contactadas", count: 7, color: "#1D4ED8", note: "1er correo" },
  { label: "Respondieron", count: 4, color: "#C9A84C", note: "Activas" },
  { label: "Interesadas", count: 2, color: "#059669", note: "Interés real" },
  { label: "Oferta", count: 1, color: "#0B1F33", note: "Siguiente paso" },
];

const universities = [
  {
    name: "Niagara University",
    division: "NCAA D1",
    location: "NY",
    status: "Contactada",
    statusColor: "bg-[#1D4ED8]/12 text-[#1D4ED8]",
    nextAction: "Preguntar beca oficial a Coach Dylan",
  },
  {
    name: "LIU Brooklyn",
    division: "NCAA D1",
    location: "NY",
    status: "Respondió",
    statusColor: "bg-[#C9A84C]/15 text-[#0B1F33]",
    nextAction: "Enviar actualizaciones de verano",
  },
  {
    name: "Towson University",
    division: "NCAA D1",
    location: "MD",
    status: "Interesada",
    statusColor: "bg-emerald-500/12 text-emerald-700",
    nextAction: "Seguimiento con Coach Boyle",
  },
];

const swimEvents = [
  { event: "50 libre", current: "26.0", target: "25.2", progress: 72 },
  { event: "100 libre", current: "58.0", target: "56.5", progress: 58 },
  { event: "100 mariposa", current: "63.0", target: "61.0", progress: 45 },
];

const rankings = [
  { rank: 1, name: "Manny", badge: "🔥", metric: "12 días racha", you: true },
  { rank: 2, name: "Fer Swim", badge: "⭐", metric: "10 días racha", you: false },
  { rank: 3, name: "Carlos Nado", badge: "💪", metric: "9 días racha", you: false },
  { rank: 4, name: "Valeria", badge: "📈", metric: "7 días racha", you: false },
];

const communityPreview = [
  {
    user: "Carlos Nado",
    initials: "CN",
    tag: "Duda",
    tagColor: "bg-[#1D4ED8]/10 text-[#1D4ED8]",
    text: "¿Mi tiempo de 50 libre (26.8) es realista para D1?",
    likes: 8,
    replies: 5,
  },
  {
    user: "Fer Swim",
    initials: "FS",
    tag: "Logro",
    tagColor: "bg-emerald-500/10 text-emerald-700",
    text: "¡Nuevo PB en 50 libre: 25.1! El trabajo diario da resultados 🔥",
    likes: 22,
    replies: 9,
  },
];

const nextActions = [
  { title: "Actualizar tiempos post-competencia", date: "Esta semana", priority: true },
  { title: "Preparar correo de seguimiento", date: "Mar 25", priority: true },
  { title: "Revisar universidades realistas", date: "Mar 28", priority: false },
  { title: "Subir documentos clave", date: "Abr 1", priority: false },
];

const STREAK = { current: 7, goal: 30 };

export default function DashboardPage() {
  const streakPct = Math.round((STREAK.current / STREAK.goal) * 100);

  return (
    <>
      {/* Hero */}
      <section className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1F33] via-[#112538] to-[#0A1C2E] p-5 shadow-[0_8px_32px_rgba(11,31,51,0.18)] sm:p-6">
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none"
          style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #C9A84C 0%, transparent 60%)" }}
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge className="border border-[#C9A84C]/30 bg-[#C9A84C]/15 text-[#C9A84C]">Beta privada</Badge>
              <Badge className="border border-white/12 bg-white/6 text-white/60">Atleta fundador</Badge>
              <Badge className="border border-white/12 bg-white/6 text-white/60">México</Badge>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
              Bienvenido, Manuel 👋
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-white/50">
              Tu centro de recruiting, progreso y oportunidades.
            </p>
          </div>

          {/* Streak hero */}
          <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 min-w-[180px]">
            <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-1">Racha diaria</p>
            <p className="text-3xl font-black text-[#C9A84C]">🔥 {STREAK.current}</p>
            <p className="text-[10px] text-white/30 mt-0.5">días consecutivos</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#e8c76a]"
                style={{ width: `${streakPct}%` }}
              />
            </div>
            <p className="mt-1 text-[9px] text-white/25">Meta: {STREAK.goal} días</p>
          </div>
        </div>

        {/* Daily task */}
        <div className="relative mt-4 rounded-xl border border-[#C9A84C]/20 bg-[#C9A84C]/8 px-4 py-2.5 flex items-center justify-between gap-3">
          <p className="text-xs text-[#C9A84C] font-medium">
            <span className="font-black">Tarea de hoy:</span> Actualiza un avance, revisa un coach o registra tu próximo paso.
          </p>
          <Link href="/app/progreso"
            className="shrink-0 rounded-lg bg-[#C9A84C] px-3 py-1.5 text-[10px] font-black text-[#0B1F33] hover:bg-[#C9A84C]/90 transition-colors">
            Ir ahora
          </Link>
        </div>
      </section>

      {/* Stat cards */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="p-4 transition-all hover:shadow-md hover:-translate-y-0.5 duration-150">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold tracking-wide text-[#5E7080] uppercase">{stat.label}</p>
                <span className="text-[11px] opacity-40">{stat.icon}</span>
              </div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="mt-0.5 text-[11px] text-[#5E7080]">{stat.sub}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <div className="space-y-5">

          {/* Pipeline */}
          <Card className="p-4 sm:p-5">
            <SectionHeader
              title="Pipeline de recruiting"
              subtitle="Etapas de tu proceso universitario"
              action="Ver coaches →"
              actionHref="/app/coaches"
            />
            <div className="grid grid-cols-5 gap-2">
              {pipelineStages.map((stage) => (
                <div key={stage.label} className="rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/70 p-3 text-center">
                  <div className="mx-auto mb-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: stage.color }} />
                  <p className="text-xl font-black text-[#0B1F33]">{stage.count}</p>
                  <p className="mt-0.5 text-[9px] font-bold text-[#0B1F33] leading-tight">{stage.label}</p>
                  <p className="mt-1 text-[9px] text-[#5E7080]">{stage.note}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Universities + Progress */}
          <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
            <Card className="p-4 sm:p-5">
              <SectionHeader
                title="Universidades activas"
                subtitle="Vista rápida"
                action="Ver todas →"
                actionHref="/app/universidades"
              />
              <div className="space-y-2">
                {universities.map((uni) => (
                  <div key={uni.name} className="flex items-center justify-between gap-3 rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/50 p-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-[#0B1F33] truncate">{uni.name}</h3>
                        <Badge className={uni.statusColor}>{uni.status}</Badge>
                      </div>
                      <p className="text-[11px] text-[#5E7080]">{uni.division} · {uni.location}</p>
                      <p className="mt-1 text-[11px] text-[#1D4ED8]">→ {uni.nextAction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <SectionHeader
                title="Progreso"
                subtitle="Marcas vs metas"
                action="Ver →"
                actionHref="/app/progreso"
              />
              <div className="space-y-4">
                {swimEvents.map((ev) => (
                  <div key={ev.event}>
                    <div className="mb-1 flex justify-between">
                      <span className="text-xs font-bold text-[#0B1F33]">{ev.event}</span>
                      <span className="font-mono text-[10px] text-[#5E7080]">{ev.current}→{ev.target}s</span>
                    </div>
                    <ProgressBar value={ev.progress} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Community preview */}
          <Card className="p-4 sm:p-5">
            <SectionHeader
              title="Comunidad"
              subtitle="Lo más reciente"
              action="Ver comunidad →"
              actionHref="/app/comunidad"
            />
            <div className="space-y-3">
              {communityPreview.map((post) => (
                <div key={post.user} className="flex gap-3 rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/50 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0B1F33]/8 text-[11px] font-black text-[#0B1F33]">
                    {post.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[11px] font-bold text-[#0B1F33]">{post.user}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${post.tagColor}`}>{post.tag}</span>
                    </div>
                    <p className="text-xs text-[#5E7080] leading-snug">{post.text}</p>
                    <div className="mt-1.5 flex gap-3">
                      <span className="text-[10px] text-[#5E7080]">♥ {post.likes}</span>
                      <span className="text-[10px] text-[#5E7080]">💬 {post.replies}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/app/comunidad"
                className="block w-full rounded-xl border border-dashed border-[#0B1F33]/15 py-2.5 text-center text-xs font-bold text-[#1D4ED8] hover:bg-[#F5F5F0] transition-colors">
                Ver toda la comunidad →
              </Link>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Next actions */}
          <Card className="p-4">
            <SectionHeader title="Próximas acciones" subtitle="Prioridades" />
            <ul className="space-y-2">
              {nextActions.map((task, i) => (
                <li key={task.title} className="flex gap-2.5 rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/50 p-3">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-black ${task.priority ? "bg-[#C9A84C] text-[#0B1F33]" : "bg-[#0B1F33]/8 text-[#0B1F33]"}`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-[#0B1F33] leading-snug">{task.title}</p>
                    <p className="mt-0.5 text-[10px] font-semibold text-[#1D4ED8]">{task.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Rankings */}
          <Card className="p-4">
            <SectionHeader title="Ranking comunidad" subtitle="Top racha" action="Ver comunidad →" actionHref="/app/comunidad" />
            <div className="space-y-2">
              {rankings.map((r) => (
                <div key={r.name} className={`flex items-center gap-2.5 rounded-xl px-3 py-2 ${r.you ? "bg-[#C9A84C]/10 border border-[#C9A84C]/25" : "border border-[#0B1F33]/6"}`}>
                  <span className="w-4 text-center text-[11px] font-black text-[#5E7080]">#{r.rank}</span>
                  <span className="text-sm">{r.badge}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-[#0B1F33] truncate">{r.name} {r.you && <span className="text-[#C9A84C]">(tú)</span>}</p>
                    <p className="text-[10px] text-[#5E7080]">{r.metric}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Brands preview */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-[#0B1F33] to-[#112538] p-4">
              <p className="text-xs font-black text-white">Marcas y oportunidades</p>
              <p className="mt-1 text-[10px] text-white/45">Curadas para atletas serios</p>
            </div>
            <div className="p-4 space-y-2">
              {["Speedo", "Arena", "GNC", "Aquasport"].map((brand) => (
                <div key={brand} className="flex items-center justify-between rounded-lg border border-[#0B1F33]/6 px-3 py-2">
                  <p className="text-xs font-bold text-[#0B1F33]">{brand}</p>
                  <span className="text-[9px] rounded-full border border-[#059669]/25 bg-[#059669]/8 px-2 py-0.5 font-bold text-[#059669]">Activa</span>
                </div>
              ))}
              <Link href="/app/marcas"
                className="mt-1 block w-full rounded-xl bg-[#0B1F33] py-2.5 text-center text-xs font-bold text-white hover:bg-[#112538] transition-colors">
                Explorar marcas →
              </Link>
            </div>
          </Card>

          {/* Quick links */}
          <Card className="p-4">
            <SectionHeader title="Accesos rápidos" />
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Correos", href: "/app/correos" },
                { label: "Documentos", href: "/app/documentos" },
                { label: "Cursos", href: "/app/cursos" },
                { label: "SAT / TOEFL", href: "/app/sat-toefl" },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="rounded-xl border border-[#0B1F33]/8 bg-[#F5F5F0]/70 px-3 py-2.5 text-center text-[11px] font-bold text-[#0B1F33] hover:bg-[#F5F5F0] transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <footer className="mt-5 rounded-xl border border-dashed border-[#0B1F33]/12 bg-white/40 px-4 py-2.5 text-center text-[11px] text-[#5E7080]">
        Vista interna · Beta privada · Datos de muestra
      </footer>
    </>
  );
}
