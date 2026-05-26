// app/app/recruiting/page.tsx — ximo Academy Recruiting Pipeline
import Link from "next/link";
import { Badge, Card, ProgressBar, SectionHeader } from "../components/ui";

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { label: "Universidades", value: "12", sub: "En radar total" },
  { label: "Contactadas",   value: "7",  sub: "1er correo enviado" },
  { label: "Respuestas",    value: "4",  sub: "Coaches activos" },
  { label: "Interés real",  value: "2",  sub: "Conversación avanzada" },
  { label: "Beca pendiente",value: "3",  sub: "Claridad requerida" },
];

type Stage = "Investigando"|"Contactado"|"Respondió"|"Llamada agendada"|"Interés real"|"Beca pendiente"|"Decisión final";
type Priority = "Alta"|"Media"|"Baja";
type ScholarClarity = "Sin claridad"|"En conversación"|"Costo estimado"|"Oferta pendiente"|"Opción segura";

interface University {
  name: string;
  division: string;
  location: string;
  coach: string;
  stage: Stage;
  priority: Priority;
  scholarship: ScholarClarity;
  nextAction: string;
  lastUpdate: string;
}

const universities: University[] = [
  { name: "Niagara University", division: "D1", location: "NY",  coach: "Coach Dylan",    stage: "Interés real",      priority: "Alta",  scholarship: "En conversación", nextAction: "Preguntar beca oficial", lastUpdate: "Hace 3 días" },
  { name: "LIU Brooklyn",       division: "D1", location: "NY",  coach: "Coach Lucy",     stage: "Respondió",         priority: "Alta",  scholarship: "Sin claridad",    nextAction: "Enviar updates de verano", lastUpdate: "Hace 5 días" },
  { name: "Towson University",  division: "D1", location: "MD",  coach: "Coach Boyle",    stage: "Llamada agendada",  priority: "Alta",  scholarship: "Costo estimado",  nextAction: "Confirmar llamada", lastUpdate: "Hace 1 día" },
  { name: "Husson University",  division: "D2", location: "ME",  coach: "Coach Adams",    stage: "Contactado",        priority: "Media", scholarship: "Sin claridad",    nextAction: "Preparar documentos", lastUpdate: "Hace 8 días" },
  { name: "Princeton",          division: "D1", location: "NJ",  coach: "Coach Crispino", stage: "Investigando",      priority: "Baja",  scholarship: "Sin claridad",    nextAction: "Contactar en otoño", lastUpdate: "Hace 2 sem" },
  { name: "UNCW",               division: "D1", location: "NC",  coach: "—",              stage: "Investigando",      priority: "Media", scholarship: "Sin claridad",    nextAction: "Enviar primer correo", lastUpdate: "Sin contacto" },
  { name: "Le Moyne",           division: "D2", location: "NY",  coach: "Coach Adam",     stage: "Contactado",        priority: "Media", scholarship: "Sin claridad",    nextAction: "Hacer seguimiento", lastUpdate: "Hace 10 días" },
];

const stageOrder: Stage[] = [
  "Investigando","Contactado","Respondió","Llamada agendada","Interés real","Beca pendiente","Decisión final"
];

const STAGE_COLOR: Record<Stage, string> = {
  "Investigando":     "bg-[#9AB0BC]/15 text-[#5E7080]",
  "Contactado":       "bg-[#1D4ED8]/10 text-[#1D4ED8]",
  "Respondió":        "bg-[#C9A84C]/12 text-[#7a5f1f]",
  "Llamada agendada": "bg-[#2F7F86]/12 text-[#1F5F66]",
  "Interés real":     "bg-emerald-500/12 text-emerald-700",
  "Beca pendiente":   "bg-purple-500/10 text-purple-700",
  "Decisión final":   "bg-[#0B1F33]/10 text-[#0B1F33]",
};

const PRIORITY_COLOR: Record<Priority, string> = {
  Alta:  "text-rose-600",
  Media: "text-amber-600",
  Baja:  "text-[#5E7080]",
};

const SCHOLAR_COLOR: Record<ScholarClarity, string> = {
  "Sin claridad":    "bg-[#9AB0BC]/15 text-[#5E7080]",
  "En conversación": "bg-[#C9A84C]/12 text-[#7a5f1f]",
  "Costo estimado":  "bg-[#2F7F86]/12 text-[#1F5F66]",
  "Oferta pendiente":"bg-purple-500/10 text-purple-700",
  "Opción segura":   "bg-emerald-500/12 text-emerald-700",
};

const priorities = [
  { school: "Niagara",  task: "Pedir beca oficial a Coach Dylan",        urgency: "Alta",  deadline: "Esta semana" },
  { school: "LIU",      task: "Mandar updates de verano a Coach Lucy",   urgency: "Alta",  deadline: "Esta semana" },
  { school: "Towson",   task: "Confirmar si Coach Boyle sigue interesado",urgency: "Alta",  deadline: "Mar 25" },
  { school: "Husson",   task: "Preparar documentos para primer envío",   urgency: "Media", deadline: "Mar 28" },
  { school: "Princeton",task: "Revisar si sigue siendo aspiracional",     urgency: "Baja",  deadline: "Abr 15" },
];

const coaches = [
  { name: "Coach Dylan",    school: "Niagara",  status: "Activo",      nextAction: "Preguntar beca oficial",     last: "Hace 3 días",  urgency: "Alta"  },
  { name: "Coach Lucy",     school: "LIU",      status: "Activo",      nextAction: "Enviar actualizaciones",     last: "Hace 5 días",  urgency: "Alta"  },
  { name: "Coach Boyle",    school: "Towson",   status: "Llamada",     nextAction: "Confirmar llamada",          last: "Ayer",         urgency: "Alta"  },
  { name: "Coach Crispino", school: "Princeton",status: "En radar",    nextAction: "Contactar en otoño 2025",   last: "—",            urgency: "Baja"  },
  { name: "Coach Adam",     school: "Le Moyne", status: "Sin respuesta",nextAction: "Seguimiento con nuevo correo",last: "Hace 10 días",urgency: "Media" },
];

const matrixSchools = ["Niagara","LIU","Towson","Husson","Le Moyne"];
const matrixCriteria = [
  { label: "Interés del coach",  scores: [5,4,5,3,3] },
  { label: "Nivel deportivo",    scores: [4,4,4,3,3] },
  { label: "Beca / costo",       scores: [3,2,3,4,4] },
  { label: "Fit académico",      scores: [4,4,3,3,3] },
  { label: "Instalaciones",      scores: [4,4,5,3,3] },
  { label: "Plan de desarrollo", scores: [4,3,4,3,3] },
];

const nextSteps = [
  { task: "Actualizar tiempos de competencia",   by: "Esta semana", p: true  },
  { task: "Preparar correo de seguimiento LIU",  by: "Mar 25",      p: true  },
  { task: "Pedir costo total anual a Niagara",   by: "Mar 26",      p: true  },
  { task: "Confirmar deadline real de Towson",   by: "Mar 28",      p: false },
  { task: "Comparar top 3 universidades",        by: "Abr 1",       p: false },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Pill({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${className}`}>
      {label}
    </span>
  );
}

function ScoreDots({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <div key={i} className={`h-1.5 w-1.5 rounded-full ${i <= score ? "bg-[#2F7F86]" : "bg-[#0B1F33]/10"}`} />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RecruitingPage() {
  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-2xl bg-[#0B1F33] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge className="border border-[#2F7F86]/30 bg-[#2F7F86]/15 text-[#7FAFB2]">Recruiting</Badge>
              <Badge className="border border-white/10 bg-white/6 text-white/50">Clase 2027 · MX</Badge>
            </div>
            <h1 className="text-xl font-black text-white sm:text-2xl">Recruiting</h1>
            <p className="mt-1.5 max-w-lg text-sm text-white/45 leading-relaxed">
              Visualiza tu proceso completo: universidades, coaches, respuestas, llamadas, becas, documentos y próximas decisiones.
            </p>
          </div>
          <div className="shrink-0 rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/55 leading-relaxed max-w-xs">
            Tu proceso no tiene que vivir en correos sueltos. Aquí puedes ver qué sigue, qué falta y qué oportunidades están avanzando.
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-white/8 bg-white/5 px-3 py-2.5 text-center">
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-[10px] font-bold text-white/50">{s.label}</p>
              <p className="text-[9px] text-white/25 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline board */}
      <Card className="p-4 sm:p-5">
        <SectionHeader title="Pipeline de recruiting" subtitle="Estado de cada universidad" action="Ver coaches →" actionHref="/app/coaches" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {universities.map((uni) => (
            <div key={uni.name} className="rounded-xl border border-[#0B1F33]/8 bg-[#F5F5F0]/60 p-3.5 hover:border-[#0B1F33]/15 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-sm font-black text-[#0B1F33] leading-tight">{uni.name}</p>
                  <p className="text-[10px] text-[#5E7080] mt-0.5">{uni.division} · {uni.location} · {uni.coach}</p>
                </div>
                <Pill label={uni.stage} className={STAGE_COLOR[uni.stage]} />
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                <Pill label={uni.scholarship} className={SCHOLAR_COLOR[uni.scholarship]} />
                <span className={`text-[10px] font-bold ${PRIORITY_COLOR[uni.priority]}`}>↑ {uni.priority}</span>
              </div>
              <p className="text-[11px] text-[#2F7F86] font-semibold leading-snug">→ {uni.nextAction}</p>
              <p className="text-[10px] text-[#5E7080] mt-1">{uni.lastUpdate}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Two-col: Priorities + Scholarship clarity */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Priorities */}
        <Card className="p-4 sm:p-5">
          <SectionHeader title="Prioridades de esta semana" subtitle="Acciones que no pueden esperar" />
          <div className="space-y-2">
            {priorities.map((p) => (
              <div key={p.task} className="flex items-start gap-3 rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/50 p-3">
                <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${p.urgency === "Alta" ? "bg-rose-500" : p.urgency === "Media" ? "bg-amber-500" : "bg-[#9AB0BC]"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-[#0B1F33] leading-snug">{p.task}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[9px] font-bold text-[#5E7080] uppercase">{p.school}</span>
                    <span className="text-[9px] text-[#5E7080]">·</span>
                    <span className="text-[9px] font-bold text-[#2F7F86]">{p.deadline}</span>
                  </div>
                </div>
                <span className={`shrink-0 text-[9px] font-black ${p.urgency === "Alta" ? "text-rose-500" : p.urgency === "Media" ? "text-amber-500" : "text-[#9AB0BC]"}`}>{p.urgency}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Scholarship clarity */}
        <Card className="p-4 sm:p-5">
          <SectionHeader title="Claridad de beca y costo" subtitle="Estado por universidad" />
          <div className="space-y-2">
            {(["Sin claridad","En conversación","Costo estimado","Oferta pendiente","Opción segura"] as ScholarClarity[]).map((status) => {
              const count = universities.filter(u => u.scholarship === status).length;
              const names = universities.filter(u => u.scholarship === status).map(u => u.name.split(" ")[0]);
              return (
                <div key={status} className="flex items-center gap-3 rounded-xl border border-[#0B1F33]/6 px-3 py-2.5">
                  <Pill label={status} className={SCHOLAR_COLOR[status]} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#5E7080] truncate">{names.join(", ") || "—"}</p>
                  </div>
                  <span className="shrink-0 text-xs font-black text-[#0B1F33]">{count}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[10px] text-[#5E7080]">
            Prioridad: pedir claridad de beca a Niagara y LIU esta semana.
          </p>
        </Card>
      </div>

      {/* Coach communication tracker */}
      <Card className="p-4 sm:p-5">
        <SectionHeader title="Comunicación con coaches" subtitle="Seguimiento por relación" action="Ver correos →" actionHref="/app/correos" />
        <div className="divide-y divide-[#0B1F33]/5">
          {coaches.map((c) => (
            <div key={c.name} className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0B1F33]/8 text-[10px] font-black text-[#0B1F33]">
                {c.name.split(" ").pop()![0]}{c.school[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-[#0B1F33]">{c.name}</p>
                  <span className="text-[10px] text-[#5E7080]">{c.school}</span>
                  <Pill label={c.status} className={
                    c.status === "Activo" ? "bg-emerald-500/10 text-emerald-700" :
                    c.status === "Llamada" ? "bg-[#2F7F86]/12 text-[#1F5F66]" :
                    c.status === "Sin respuesta" ? "bg-[#9AB0BC]/15 text-[#5E7080]" :
                    "bg-[#0B1F33]/6 text-[#5E7080]"
                  } />
                </div>
                <p className="mt-0.5 text-[11px] text-[#2F7F86] font-semibold">→ {c.nextAction}</p>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
                <p className="text-[10px] text-[#5E7080]">{c.last}</p>
                <span className={`text-[9px] font-black ${c.urgency === "Alta" ? "text-rose-500" : c.urgency === "Media" ? "text-amber-500" : "text-[#9AB0BC]"}`}>
                  {c.urgency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Decision matrix */}
      <Card className="p-4 sm:p-5">
        <SectionHeader title="Matriz de decisión" subtitle="Comparación por criterio · escala 1–5" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr>
                <th className="pb-2 text-left text-[10px] font-bold text-[#5E7080] uppercase tracking-wider w-36">Criterio</th>
                {matrixSchools.map((s) => (
                  <th key={s} className="pb-2 text-center text-[10px] font-bold text-[#0B1F33]">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B1F33]/5">
              {matrixCriteria.map((row) => (
                <tr key={row.label}>
                  <td className="py-2.5 pr-4 text-[11px] text-[#5E7080] font-medium">{row.label}</td>
                  {row.scores.map((score, i) => (
                    <td key={i} className="py-2.5 text-center">
                      <div className="flex justify-center">
                        <ScoreDots score={score} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t-2 border-[#0B1F33]/10">
                <td className="py-2.5 pr-4 text-[11px] font-black text-[#0B1F33]">Total</td>
                {matrixSchools.map((_, i) => {
                  const total = matrixCriteria.reduce((sum, row) => sum + row.scores[i], 0);
                  const max = matrixCriteria.length * 5;
                  return (
                    <td key={i} className="py-2.5 text-center">
                      <span className={`text-xs font-black ${i === 0 ? "text-[#2F7F86]" : "text-[#0B1F33]"}`}>
                        {total}/{max}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Next steps */}
      <Card className="p-4 sm:p-5">
        <SectionHeader title="Próximos pasos" subtitle="Acciones concretas para esta semana" action="Ver tareas →" actionHref="/app/tareas" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {nextSteps.map((step, i) => (
            <div key={step.task} className="flex gap-3 rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/50 p-3">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black ${step.p ? "bg-[#2F7F86] text-white" : "bg-[#0B1F33]/8 text-[#0B1F33]"}`}>
                {i + 1}
              </span>
              <div>
                <p className="text-[11px] font-bold text-[#0B1F33] leading-snug">{step.task}</p>
                <p className="mt-0.5 text-[10px] font-semibold text-[#2F7F86]">{step.by}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <footer className="rounded-xl border border-dashed border-[#0B1F33]/10 bg-white/40 py-2.5 text-center text-[11px] text-[#5E7080]">
        Datos de muestra · Beta privada · ximo Academy
      </footer>
    </div>
  );
}
