// app/app/page.tsx — ximo Academy Dashboard
// Later: protect route with auth; check subscription status
import Link from "next/link";
import { Badge, Card, ProgressBar, SectionHeader } from "./components/ui";

const statCards = [
  { label: "Universidades", value: "12", sub: "3 en seguimiento activo",   icon: "◫", href: "/app/universidades" },
  { label: "Coaches",       value: "7",  sub: "2 con interés alto",         icon: "⬘", href: "/app/coaches" },
  { label: "Respuestas",    value: "4",  sub: "1 llamada pendiente",         icon: "✉", href: "/app/correos" },
  { label: "Documentos",    value: "6/10", sub: "4 pendientes",             icon: "▣", href: "/app/documentos" },
];

const pipelineStages = [
  { label: "Identificadas", count: 12, note: "En radar" },
  { label: "Contactadas",   count: 7,  note: "1er correo" },
  { label: "Respondieron",  count: 4,  note: "Activas" },
  { label: "Interesadas",   count: 2,  note: "Interés real" },
  { label: "Oferta",        count: 1,  note: "Siguiente paso" },
];

const universities = [
  { name: "Niagara University", div: "D1 · NY", status: "Interés real",  statusC: "bg-emerald-500/10 text-emerald-700", next: "Preguntar beca oficial" },
  { name: "LIU Brooklyn",       div: "D1 · NY", status: "Respondió",     statusC: "bg-[#C9A84C]/12 text-[#7a5f1f]",   next: "Enviar updates de verano" },
  { name: "Towson University",  div: "D1 · MD", status: "Llamada",       statusC: "bg-[#2F7F86]/12 text-[#1F5F66]",   next: "Confirmar llamada" },
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
  { user: "Carlos Nado", initials: "CN", tag: "Duda",  tagC: "bg-[#2F7F86]/10 text-[#1F5F66]",  text: "¿26.8 en 50 libre es realista para D1?",  likes: 8,  replies: 5 },
  { user: "Fer Swim",    initials: "FS", tag: "Logro", tagC: "bg-emerald-500/10 text-emerald-700", text: "¡Nuevo PB en 50 libre: 25.1! El trabajo da resultados 🔥", likes: 22, replies: 9 },
];

const nextActions = [
  { title: "Actualizar tiempos post-competencia", date: "Esta semana", p: true  },
  { title: "Preparar correo de seguimiento",      date: "Mar 25",      p: true  },
  { title: "Revisar universidades realistas",     date: "Mar 28",      p: false },
  { title: "Subir documentos clave",              date: "Abr 1",       p: false },
];

const STREAK = { current: 7, goal: 30 };

export default function DashboardPage() {
  const streakPct = Math.round((STREAK.current / STREAK.goal) * 100);

  return (
    <>
      {/* Hero */}
      <section className="relative mb-5 overflow-hidden rounded-2xl bg-[#0B1F33] p-5 sm:p-6">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge className="border border-[#C9A84C]/25 bg-[#C9A84C]/10 text-[#C9A84C]">Beta privada</Badge>
              <Badge className="border border-white/10 bg-white/5 text-white/45">Atleta fundador</Badge>
              <Badge className="border border-white/10 bg-white/5 text-white/45">México</Badge>
            </div>
            <h1 className="text-xl font-black text-white sm:text-2xl">Bienvenido, Manuel 👋</h1>
            <p className="mt-1.5 max-w-md text-sm text-white/40 leading-relaxed">
              Tu centro de recruiting, progreso y oportunidades.
            </p>
          </div>

          {/* Streak */}
          <div className="shrink-0 rounded-xl border border-white/8 bg-white/4 px-4 py-3 min-w-[164px]">
            <p className="text-[9px] font-bold tracking-widest text-white/35 uppercase mb-1">Racha diaria</p>
            <p className="text-3xl font-black text-[#C9A84C]">🔥 {STREAK.current}</p>
            <p className="text-[10px] text-white/25 mt-0.5">días consecutivos</p>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/8">
              <div className="h-full rounded-full bg-gradient-to-r from-[#C9A84C] to-[#e8c76a]" style={{ width: `${streakPct}%` }} />
            </div>
            <p className="mt-1 text-[9px] text-white/20">Meta: {STREAK.goal} días</p>
          </div>
        </div>

        {/* Daily nudge */}
        <div className="relative mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#2F7F86]/25 bg-[#2F7F86]/8 px-4 py-2.5">
          <p className="text-xs text-[#7FAFB2]">
            <span className="font-black">Tarea de hoy:</span> Actualiza un avance, revisa un coach o registra tu próximo paso.
          </p>
          <div className="flex shrink-0 gap-2">
            <Link href="/app/recruiting"
              className="rounded-lg border border-[#2F7F86]/40 px-3 py-1.5 text-[10px] font-black text-[#7FAFB2] hover:bg-[#2F7F86]/15 transition-colors">
              Recruiting
            </Link>
            <Link href="/app/tareas"
              className="rounded-lg bg-[#2F7F86] px-3 py-1.5 text-[10px] font-black text-white hover:bg-[#1F5F66] transition-colors">
              Ver tareas
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold tracking-wide text-[#5E7080] uppercase">{s.label}</p>
                <span className="text-[11px] text-[#0B1F33]/20">{s.icon}</span>
              </div>
              <p className="text-2xl font-black text-[#0B1F33]">{s.value}</p>
              <p className="mt-0.5 text-[11px] text-[#5E7080]">{s.sub}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-5 xl:grid-cols-[1fr_288px]">
        <div className="space-y-5">

          {/* Pipeline */}
          <Card className="p-4 sm:p-5">
            <SectionHeader title="Pipeline de recruiting" subtitle="Etapas del proceso" action="Ver recruiting →" actionHref="/app/recruiting" />
            <div className="grid grid-cols-5 gap-2">
              {pipelineStages.map((stage, i) => {
                const widths = [100, 58, 33, 17, 8];
                return (
                  <div key={stage.label} className="rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/70 p-3 text-center">
                    <p className="text-xl font-black text-[#0B1F33]">{stage.count}</p>
                    <p className="mt-0.5 text-[9px] font-bold text-[#0B1F33] leading-tight">{stage.label}</p>
                    <p className="mt-1.5 text-[9px] text-[#5E7080]">{stage.note}</p>
                    <div className="mt-2 h-0.5 w-full rounded-full bg-[#0B1F33]/6">
                      <div className="h-full rounded-full bg-[#2F7F86]" style={{ width: `${widths[i]}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Universities + Progress */}
          <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
            <Card className="p-4 sm:p-5">
              <SectionHeader title="Universidades activas" subtitle="Vista rápida" action="Ver todas →" actionHref="/app/universidades" />
              <div className="space-y-2">
                {universities.map((uni) => (
                  <div key={uni.name} className="flex items-center gap-3 rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/50 p-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-[#0B1F33] truncate">{uni.name}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${uni.statusC}`}>{uni.status}</span>
                      </div>
                      <p className="text-[10px] text-[#5E7080]">{uni.div}</p>
                      <p className="mt-1 text-[11px] text-[#2F7F86] font-semibold">→ {uni.next}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <SectionHeader title="Progreso" subtitle="Marcas vs metas" action="Ver →" actionHref="/app/progreso" />
              <div className="space-y-4">
                {swimEvents.map((ev) => (
                  <div key={ev.event}>
                    <div className="mb-1.5 flex justify-between">
                      <span className="text-xs font-bold text-[#0B1F33]">{ev.event}</span>
                      <span className="font-mono text-[10px] text-[#5E7080]">{ev.current}→{ev.target}s</span>
                    </div>
                    <ProgressBar value={ev.progress} color="from-[#2F7F86] to-[#7FAFB2]" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Community preview */}
          <Card className="p-4 sm:p-5">
            <SectionHeader title="Comunidad" subtitle="Lo más reciente" action="Ver comunidad →" actionHref="/app/comunidad" />
            <div className="space-y-2">
              {communityPreview.map((post) => (
                <div key={post.user} className="flex gap-3 rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/50 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0B1F33]/8 text-[10px] font-black text-[#0B1F33]">
                    {post.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[11px] font-bold text-[#0B1F33]">{post.user}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${post.tagC}`}>{post.tag}</span>
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
                className="block w-full rounded-xl border border-dashed border-[#0B1F33]/12 py-2.5 text-center text-xs font-bold text-[#2F7F86] hover:bg-[#F5F5F0] transition-colors">
                Ver toda la comunidad →
              </Link>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Next actions */}
          <Card className="p-4">
            <SectionHeader title="Próximas acciones" subtitle="Esta semana" />
            <ul className="space-y-2">
              {nextActions.map((task, i) => (
                <li key={task.title} className="flex gap-2.5 rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/50 p-3">
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-black ${task.p ? "bg-[#2F7F86] text-white" : "bg-[#0B1F33]/8 text-[#0B1F33]"}`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[11px] font-bold text-[#0B1F33] leading-snug">{task.title}</p>
                    <p className="mt-0.5 text-[10px] font-semibold text-[#2F7F86]">{task.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Rankings */}
          <Card className="p-4">
            <SectionHeader title="Ranking comunidad" subtitle="Top racha" action="Comunidad →" actionHref="/app/comunidad" />
            <div className="space-y-1.5">
              {rankings.map((r) => (
                <div key={r.name} className={`flex items-center gap-2.5 rounded-xl px-3 py-2 ${r.you ? "bg-[#C9A84C]/10 border border-[#C9A84C]/20" : "border border-[#0B1F33]/6"}`}>
                  <span className="w-4 text-center text-[10px] font-black text-[#5E7080]">#{r.rank}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-[#0B1F33] truncate">
                      {r.name} {r.you && <span className="text-[#C9A84C]">(tú)</span>}
                    </p>
                    <p className="text-[10px] text-[#5E7080]">{r.metric}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Brands */}
          <Card className="overflow-hidden">
            <div className="bg-[#0B1F33] px-4 py-3">
              <p className="text-xs font-black text-white">Marcas y oportunidades</p>
              <p className="mt-0.5 text-[10px] text-white/35">Curadas para atletas ximo</p>
            </div>
            <div className="p-4 space-y-1.5">
              {["Speedo", "Arena", "GNC", "Aquasport"].map((brand) => (
                <div key={brand} className="flex items-center justify-between rounded-lg border border-[#0B1F33]/6 px-3 py-2">
                  <p className="text-xs font-bold text-[#0B1F33]">{brand}</p>
                  <span className="text-[9px] rounded-full border border-[#2F7F86]/20 bg-[#2F7F86]/8 px-2 py-0.5 font-bold text-[#2F7F86]">Activa</span>
                </div>
              ))}
              <Link href="/app/marcas"
                className="mt-2 block w-full rounded-xl bg-[#0B1F33] py-2.5 text-center text-xs font-bold text-white hover:bg-[#07131F] transition-colors">
                Explorar marcas →
              </Link>
            </div>
          </Card>

          {/* Quick links */}
          <Card className="p-4">
            <SectionHeader title="Accesos rápidos" />
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Recruiting",  href: "/app/recruiting" },
                { label: "Correos",     href: "/app/correos" },
                { label: "Documentos",  href: "/app/documentos" },
                { label: "SAT/TOEFL",   href: "/app/sat-toefl" },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="rounded-xl border border-[#0B1F33]/8 bg-[#F5F5F0]/70 px-3 py-2.5 text-center text-[11px] font-bold text-[#0B1F33] hover:bg-[#ECEBE4] transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <footer className="mt-5 rounded-xl border border-dashed border-[#0B1F33]/10 bg-white/40 py-2.5 text-center text-[11px] text-[#5E7080]">
        Vista interna · Beta privada · Datos de muestra
      </footer>
    </>
  );
}
