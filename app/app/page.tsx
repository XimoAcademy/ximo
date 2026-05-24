import Link from "next/link";
import { Badge, Card, ProgressBar, SectionHeader } from "./components/ui";

const statCards = [
  {
    label: "Universidades guardadas",
    value: "12",
    sub: "3 en seguimiento activo",
    color: "text-[#1D4ED8]",
    href: "/app/universidades",
  },
  {
    label: "Coaches por contactar",
    value: "7",
    sub: "2 con interés alto",
    color: "text-[#C9A84C]",
    href: "/app/coaches",
  },
  {
    label: "Respuestas recibidas",
    value: "4",
    sub: "1 llamada pendiente",
    color: "text-emerald-600",
    href: "/app/correos",
  },
  {
    label: "Documentos pendientes",
    value: "5",
    sub: "6 de 10 listos",
    color: "text-[#0B1F33]",
    href: "/app/documentos",
  },
];

const pipelineStages = [
  {
    label: "Identificadas",
    count: 12,
    color: "#9AB0BC",
    note: "Opciones en tu radar",
  },
  {
    label: "Contactadas",
    count: 7,
    color: "#1D4ED8",
    note: "Primer correo enviado",
  },
  {
    label: "Respondieron",
    count: 4,
    color: "#C9A84C",
    note: "Conversación activa",
  },
  {
    label: "Interesadas",
    count: 2,
    color: "#059669",
    note: "Interés real del coach",
  },
  {
    label: "Oferta / siguiente paso",
    count: 1,
    color: "#0B1F33",
    note: "Visita o siguiente fase",
  },
];

const universities = [
  {
    name: "Niagara University",
    division: "NCAA D1",
    location: "Niagara, NY",
    status: "Contactada",
    statusColor: "bg-[#1D4ED8]/12 text-[#1D4ED8]",
    scholarship: "Media — falta aclarar beca oficial",
    nextAction: "Preguntar beca oficial a Coach Dylan",
  },
  {
    name: "LIU",
    division: "NCAA D1",
    location: "Brooklyn, NY",
    status: "Respondió",
    statusColor: "bg-[#C9A84C]/15 text-[#0B1F33]",
    scholarship: "Alta claridad",
    nextAction: "Enviar actualizaciones de verano",
  },
  {
    name: "Towson University",
    division: "NCAA D1",
    location: "Towson, MD",
    status: "Interesada",
    statusColor: "bg-emerald-500/12 text-emerald-700",
    scholarship: "Alta claridad",
    nextAction: "Seguimiento de llamada con Coach Boyle",
  },
];

const coaches = [
  {
    name: "Coach Dylan",
    university: "Niagara University",
    note: "Pendiente aclarar beca oficial",
  },
  {
    name: "Coach Lucy",
    university: "LIU",
    note: "Enviar actualizaciones de verano",
  },
  {
    name: "Coach Boyle",
    university: "Towson University",
    note: "Seguimiento de llamada",
  },
];

const swimEvents = [
  {
    event: "50 libre",
    current: "26.0",
    target: "25.2",
    progress: 72,
    note: "Mejor marca en competencia reciente",
  },
  {
    event: "100 libre",
    current: "58.0",
    target: "56.5",
    progress: 58,
    note: "Consistencia mejorando en salida",
  },
  {
    event: "100 mariposa",
    current: "63.0",
    target: "61.0",
    progress: 45,
    note: "Evento secundario para relays",
  },
];

const nextActions = [
  {
    title: "Actualizar tiempos después de competencia",
    date: "Esta semana",
  },
  {
    title: "Preparar correo para coaches",
    date: "Mar 25",
  },
  {
    title: "Revisar universidades realistas",
    date: "Mar 28",
  },
  {
    title: "Subir documentos clave",
    date: "Abr 1",
  },
  {
    title: "Registrar avances en el perfil",
    date: "Abr 2",
  },
];

export default function DashboardPage() {
  return (
    <>
      <section className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1F33] via-[#0A1C2E] to-[#0B1F33] p-5 shadow-[0_8px_32px_rgba(11,31,51,0.18)] sm:p-6">
        <div className="relative">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge className="border border-[#C9A84C]/30 bg-[#C9A84C]/15 text-[#C9A84C]">
              Beta privada
            </Badge>
            <Badge className="border border-white/15 bg-white/8 text-white/70">
              México primero
            </Badge>
            <Badge className="border border-white/15 bg-white/8 text-white/70">
              Atletas fundadores
            </Badge>
          </div>
          <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
            Panel privado ximo
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
            Tu espacio para organizar tu camino deportivo, académico y de
            recruiting en un solo lugar.
          </p>
          <p className="mt-3 max-w-xl text-sm font-medium text-[#C9A84C]">
            Convierte dudas, correos, documentos y oportunidades en un camino
            claro.
          </p>
        </div>
      </section>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="p-4 transition-shadow hover:shadow-md">
              <p className="text-[10px] font-bold tracking-wide text-[#5E7080] uppercase">
                {stat.label}
              </p>
              <p className={`mt-1.5 text-2xl font-black ${stat.color}`}>
                {stat.value}
              </p>
              <p className="mt-0.5 text-[11px] text-[#5E7080]">{stat.sub}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          <Card className="p-4 sm:p-5">
            <SectionHeader
              title="Pipeline de recruiting"
              subtitle="Etapas de tu proceso universitario"
              action="Ver coaches →"
              actionHref="/app/coaches"
            />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {pipelineStages.map((stage) => (
                <div
                  key={stage.label}
                  className="rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/70 p-3 text-center"
                >
                  <div
                    className="mx-auto mb-1.5 h-2 w-2 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <p className="text-xl font-black text-[#0B1F33]">
                    {stage.count}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold text-[#0B1F33]">
                    {stage.label}
                  </p>
                  <p className="mt-1 text-[9px] leading-tight text-[#5E7080]">
                    {stage.note}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <SectionHeader
              title="Universidades"
              subtitle="Vista previa de opciones activas"
              action="Ver todas →"
              actionHref="/app/universidades"
            />
            <div className="space-y-3">
              {universities.map((uni) => (
                <div
                  key={uni.name}
                  className="rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-[#0B1F33]">
                          {uni.name}
                        </h3>
                        <Badge className={uni.statusColor}>{uni.status}</Badge>
                      </div>
                      <p className="mt-1 text-[11px] text-[#5E7080]">
                        {uni.division} · {uni.location}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-[#5E7080]">
                    Beca:{" "}
                    <span className="font-semibold text-[#0B1F33]">
                      {uni.scholarship}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-[#0B1F33]">
                    → {uni.nextAction}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="p-4 sm:p-5">
              <SectionHeader
                title="Coaches"
                subtitle="Seguimiento activo"
                action="Ver todos →"
                actionHref="/app/coaches"
              />
              <div className="space-y-3">
                {coaches.map((coach) => (
                  <div
                    key={coach.name}
                    className="rounded-xl border border-[#0B1F33]/6 p-3"
                  >
                    <p className="text-sm font-bold text-[#0B1F33]">
                      {coach.name}
                    </p>
                    <p className="text-[11px] text-[#5E7080]">
                      {coach.university}
                    </p>
                    <p className="mt-2 text-xs text-[#1D4ED8]">
                      → {coach.note}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 sm:p-5">
              <SectionHeader
                title="Progreso deportivo"
                subtitle="Marcas y metas"
                action="Ver detalle →"
                actionHref="/app/progreso"
              />
              <div className="space-y-4">
                {swimEvents.map((ev) => (
                  <div key={ev.event}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-bold text-[#0B1F33]">
                        {ev.event}
                      </span>
                      <span className="font-mono text-xs text-[#5E7080]">
                        {ev.current}s → {ev.target}s
                      </span>
                    </div>
                    <ProgressBar value={ev.progress} />
                    <p className="mt-1 text-[10px] text-[#5E7080]">
                      {ev.note}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-5">
          <Card className="p-4">
            <SectionHeader
              title="Próximas acciones"
              subtitle="Prioridades de la semana"
            />
            <ul className="space-y-2.5">
              {nextActions.map((task, i) => (
                <li
                  key={task.title}
                  className="flex gap-3 rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/50 p-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0B1F33] text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#0B1F33]">
                      {task.title}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold text-[#1D4ED8]">
                      {task.date}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-[#0B1F33] to-[#0A1C2E] p-4">
              <p className="text-sm font-black text-white">Visión ximo</p>
            </div>
            <div className="p-4">
              <p className="text-sm leading-relaxed text-[#5E7080]">
                Este panel será el lugar donde un atleta pueda transformar
                dudas, correos, documentos y oportunidades en un camino claro.
              </p>
              <div className="mt-3 space-y-1">
                {[
                  { href: "/app/correos", label: "Bandeja de correos" },
                  { href: "/app/documentos", label: "Documentos" },
                  { href: "/app/cursos", label: "Cursos Academy" },
                  { href: "/app/sat-toefl", label: "SAT / TOEFL" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-lg px-2 py-1.5 text-xs font-semibold text-[#1D4ED8] hover:bg-[#F5F5F0]"
                  >
                    {link.label} →
                  </Link>
                ))}
              </div>
              <Link
                href="/app/perfil"
                className="mt-3 block w-full rounded-xl bg-[#0B1F33] py-2.5 text-center text-xs font-bold text-white hover:bg-[#0A1C2E]"
              >
                Ver perfil completo →
              </Link>
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
