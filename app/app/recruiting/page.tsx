// app/app/recruiting/page.tsx — dark/teal premium recruiting pipeline
import Link from "next/link";
import { Badge, SectionHeader } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";

type Stage = "Investigando"|"Contactado"|"Respondió"|"Llamada agendada"|"Interés real"|"Beca pendiente"|"Decisión final";
type Priority = "Alta"|"Media"|"Baja";
type Scholar = "Sin claridad"|"En conversación"|"Costo estimado"|"Oferta pendiente"|"Opción segura";

interface Uni { name:string; div:string; loc:string; coach:string; stage:Stage; priority:Priority; scholarship:Scholar; next:string; last:string; }

const unis: Uni[] = [
  { name:"Niagara University", div:"D1", loc:"NY", coach:"Coach Dylan",    stage:"Interés real",      priority:"Alta",  scholarship:"En conversación", next:"Preguntar beca oficial",     last:"Hace 3 días" },
  { name:"LIU Brooklyn",       div:"D1", loc:"NY", coach:"Coach Lucy",     stage:"Respondió",         priority:"Alta",  scholarship:"Sin claridad",    next:"Enviar updates de verano",   last:"Hace 5 días" },
  { name:"Towson University",  div:"D1", loc:"MD", coach:"Coach Boyle",    stage:"Llamada agendada",  priority:"Alta",  scholarship:"Costo estimado",  next:"Confirmar llamada",          last:"Ayer" },
  { name:"Husson University",  div:"D2", loc:"ME", coach:"Coach Adams",    stage:"Contactado",        priority:"Media", scholarship:"Sin claridad",    next:"Preparar documentos",        last:"Hace 8 días" },
  { name:"Princeton",          div:"D1", loc:"NJ", coach:"Coach Crispino", stage:"Investigando",      priority:"Baja",  scholarship:"Sin claridad",    next:"Contactar en otoño",         last:"Hace 2 sem" },
  { name:"UNCW",               div:"D1", loc:"NC", coach:"—",              stage:"Investigando",      priority:"Media", scholarship:"Sin claridad",    next:"Enviar primer correo",       last:"Sin contacto" },
  { name:"Le Moyne",           div:"D2", loc:"NY", coach:"Coach Adam",     stage:"Contactado",        priority:"Media", scholarship:"Sin claridad",    next:"Hacer seguimiento",          last:"Hace 10 días" },
];

const STAGE_C: Record<Stage,{bg:string;color:string}> = {
  "Investigando":     { bg:"rgba(94,112,128,0.15)",    color:"var(--text-label)" },
  "Contactado":       { bg:"var(--border)",    color:"var(--teal)" },
  "Respondió":        { bg:"rgba(201,168,76,0.12)",    color:"var(--gold)" },
  "Llamada agendada": { bg:"rgba(31,95,102,0.2)",      color:"var(--teal)" },
  "Interés real":     { bg:"rgba(5,150,105,0.15)",     color:"#6ee7b7" },
  "Beca pendiente":   { bg:"rgba(139,92,246,0.15)",    color:"#c4b5fd" },
  "Decisión final":   { bg:"rgba(245,245,240,0.1)",    color:"var(--text)" },
};

const SCHOLAR_C: Record<Scholar,{bg:string;color:string}> = {
  "Sin claridad":    { bg:"rgba(94,112,128,0.12)",  color:"var(--text-label)" },
  "En conversación": { bg:"rgba(201,168,76,0.12)",  color:"var(--gold)" },
  "Costo estimado":  { bg:"var(--border)",  color:"var(--teal)" },
  "Oferta pendiente":{ bg:"rgba(139,92,246,0.12)",  color:"#c4b5fd" },
  "Opción segura":   { bg:"rgba(5,150,105,0.12)",   color:"#6ee7b7" },
};

const PRIORITY_C: Record<Priority,string> = { Alta:"#f87171", Media:"#fbbf24", Baja:"var(--text-label)" };

const coaches = [
  { name:"Coach Dylan",    school:"Niagara",  status:"Activo",       next:"Preguntar beca oficial",      last:"Hace 3 días",  urgency:"Alta"  },
  { name:"Coach Lucy",     school:"LIU",      status:"Activo",       next:"Enviar actualizaciones",      last:"Hace 5 días",  urgency:"Alta"  },
  { name:"Coach Boyle",    school:"Towson",   status:"Llamada",      next:"Confirmar llamada",           last:"Ayer",         urgency:"Alta"  },
  { name:"Coach Crispino", school:"Princeton",status:"En radar",     next:"Contactar en otoño 2025",    last:"—",            urgency:"Baja"  },
  { name:"Coach Adam",     school:"Le Moyne", status:"Sin respuesta",next:"Follow-up con correo nuevo", last:"Hace 10 días", urgency:"Media" },
];

const priorities = [
  { school:"Niagara",  task:"Pedir beca oficial a Coach Dylan",         urgency:"Alta",  deadline:"Esta semana" },
  { school:"LIU",      task:"Mandar updates de verano a Coach Lucy",    urgency:"Alta",  deadline:"Esta semana" },
  { school:"Towson",   task:"Confirmar si Coach Boyle sigue interesado",urgency:"Alta",  deadline:"Mar 25" },
  { school:"Husson",   task:"Preparar documentos para primer envío",    urgency:"Media", deadline:"Mar 28" },
  { school:"Princeton",task:"Revisar si sigue siendo aspiracional",      urgency:"Baja",  deadline:"Abr 15" },
];

const matrixSchools = ["Niagara","LIU","Towson","Husson","Le Moyne"];
const matrixRows = [
  { label:"Interés del coach",  scores:[5,4,5,3,3] },
  { label:"Nivel deportivo",    scores:[4,4,4,3,3] },
  { label:"Beca / costo",       scores:[3,2,3,4,4] },
  { label:"Fit académico",      scores:[4,4,3,3,3] },
  { label:"Instalaciones",      scores:[4,4,5,3,3] },
  { label:"Plan desarrollo",    scores:[4,3,4,3,3] },
];

const nextSteps = [
  { task:"Actualizar tiempos de competencia",  by:"Esta semana", p:true  },
  { task:"Preparar correo de seguimiento LIU", by:"Mar 25",      p:true  },
  { task:"Pedir costo total anual a Niagara",  by:"Mar 26",      p:true  },
  { task:"Confirmar deadline real de Towson",  by:"Mar 28",      p:false },
  { task:"Comparar top 3 universidades",       by:"Abr 1",       p:false },
];

const stats = [
  { label:"Universidades",  value:"12" },
  { label:"Contactadas",    value:"7"  },
  { label:"Respuestas",     value:"4"  },
  { label:"Interés real",   value:"2"  },
  { label:"Beca pendiente", value:"3"  },
];

function DarkCard({ children, className="", glow=false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <div className={`rounded-2xl ximo-card-3d ${className}`}
      style={{ background:"var(--surface)", border:"1px solid var(--border)", boxShadow: glow ? "0 0 30px var(--border),0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.3)" }}>
      {children}
    </div>
  );
}

function Pill({ label, bg, color }: { label:string; bg:string; color:string }) {
  return <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background:bg, color }}>{label}</span>;
}

function ScoreDots({ score }: { score:number }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: i<=score ? "var(--teal-muted)" : "var(--border)" }} />
      ))}
    </div>
  );
}

export default function RecruitingPage() {
  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 ximo-fade-up"
        style={{ background:"var(--hero-bg)", border:"1px solid var(--border-strong)", boxShadow:"0 8px 32px rgba(0,0,0,0.18)" }}>
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full blur-3xl pointer-events-none ximo-glow-pulse"
          style={{ background:"radial-gradient(circle,rgba(47,127,134,0.3) 0%,transparent 70%)" }} />
        <div className="relative">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge className="border" style={{ borderColor:"var(--teal-border)", background:"var(--teal-bg)", color:"var(--teal)" }}>Recruiting</Badge>
            <Badge className="border" style={{ borderColor:"var(--border)", background:"var(--surface-hover)", color:"var(--text-label)" }}>Clase 2027 · MX</Badge>
          </div>
          <h1 className="text-2xl font-black sm:text-3xl" style={{ color:"var(--text)" }}>Recruiting</h1>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed" style={{ color:"var(--text-2)" }}>
            Visualiza tu proceso completo: universidades, coaches, respuestas, llamadas, becas, documentos y próximas decisiones.
          </p>
        </div>
        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {stats.map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background:"var(--hero-panel)", border:"1px solid var(--hero-panel-bd)" }}>
              <p className="text-xl font-black" style={{ color:"var(--text)" }}>{s.value}</p>
              <p className="text-[10px] font-bold" style={{ color:"var(--text-label)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline board */}
      <ScrollReveal delay={80}>
      <DarkCard className="p-4 sm:p-5" glow>
        <SectionHeader dark title="Pipeline de recruiting" subtitle="Estado de cada universidad" action="Ver coaches →" actionHref="/app/coaches" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {unis.map(uni => {
            const sc = STAGE_C[uni.stage];
            const ss = SCHOLAR_C[uni.scholarship];
            return (
              <div key={uni.name} className="rounded-xl p-3.5 ximo-lift cursor-default"
                style={{ background:"var(--surface-hover)", border:"1px solid var(--border-subtle)" }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-black text-brand leading-tight">{uni.name}</p>
                    <p className="text-[10px] mt-0.5" style={{ color:"var(--text-label)" }}>{uni.div} · {uni.loc} · {uni.coach}</p>
                  </div>
                  <Pill label={uni.stage} bg={sc.bg} color={sc.color} />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  <Pill label={uni.scholarship} bg={ss.bg} color={ss.color} />
                  <span className="text-[10px] font-bold" style={{ color:PRIORITY_C[uni.priority] }}>↑ {uni.priority}</span>
                </div>
                <p className="text-[11px] font-semibold" style={{ color:"var(--teal-muted)" }}>→ {uni.next}</p>
                <p className="text-[10px] mt-1" style={{ color:"var(--text-label)" }}>{uni.last}</p>
              </div>
            );
          })}
        </div>
      </DarkCard>
      </ScrollReveal>

      {/* Priorities + Scholarship clarity */}
      <ScrollReveal delay={60}>
      <div className="grid gap-5 lg:grid-cols-2">
        <DarkCard className="p-4 sm:p-5 ximo-fade-up delay-200">
          <SectionHeader dark title="Prioridades de esta semana" subtitle="No pueden esperar" />
          <div className="space-y-2">
            {priorities.map(p => (
              <div key={p.task} className="flex items-start gap-3 rounded-xl p-3"
                style={{ background:"var(--surface-hover)", border:"1px solid var(--border-subtle)" }}>
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ background:PRIORITY_C[p.urgency as Priority] }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-brand leading-snug">{p.task}</p>
                  <div className="mt-1 flex gap-2">
                    <span className="text-[9px] font-bold uppercase" style={{ color:"var(--text-label)" }}>{p.school}</span>
                    <span className="text-[9px] font-bold" style={{ color:"var(--teal-muted)" }}>{p.deadline}</span>
                  </div>
                </div>
                <span className="text-[9px] font-black shrink-0" style={{ color:PRIORITY_C[p.urgency as Priority] }}>{p.urgency}</span>
              </div>
            ))}
          </div>
        </DarkCard>

        <DarkCard className="p-4 sm:p-5 ximo-fade-up delay-200">
          <SectionHeader dark title="Claridad de beca y costo" subtitle="Estado por universidad" />
          <div className="space-y-2">
            {(["Sin claridad","En conversación","Costo estimado","Oferta pendiente","Opción segura"] as Scholar[]).map(s => {
              const c = SCHOLAR_C[s];
              const names = unis.filter(u => u.scholarship === s).map(u => u.name.split(" ")[0]);
              return (
                <div key={s} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                  style={{ border:"1px solid var(--border-subtle)" }}>
                  <Pill label={s} bg={c.bg} color={c.color} />
                  <p className="flex-1 text-[10px] truncate" style={{ color:"var(--text-label)" }}>{names.join(", ") || "—"}</p>
                  <span className="text-xs font-black text-brand">{names.length}</span>
                </div>
              );
            })}
          </div>
        </DarkCard>
      </div>
      </ScrollReveal>

      {/* Coach tracker */}
      <DarkCard className="p-4 sm:p-5 ximo-fade-up delay-300">
        <SectionHeader dark title="Comunicación con coaches" subtitle="Seguimiento por relación" action="Ver correos →" actionHref="/app/correos" />
        <div className="divide-y" style={{ borderColor:"var(--border-subtle)" }}>
          {coaches.map(c => (
            <div key={c.name} className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black"
                style={{ background:"var(--border)", color:"var(--teal)" }}>
                {c.name.split(" ").pop()![0]}{c.school[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-brand">{c.name}</p>
                  <span className="text-[10px]" style={{ color:"var(--text-label)" }}>{c.school}</span>
                  <Pill label={c.status}
                    bg={c.status==="Activo"?"rgba(5,150,105,0.12)":c.status==="Llamada"?"var(--border)":"rgba(94,112,128,0.1)"}
                    color={c.status==="Activo"?"#6ee7b7":c.status==="Llamada"?"var(--teal)":"var(--text-label)"} />
                </div>
                <p className="mt-0.5 text-[11px] font-semibold" style={{ color:"var(--teal-muted)" }}>→ {c.next}</p>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
                <p className="text-[10px]" style={{ color:"var(--text-label)" }}>{c.last}</p>
                <span className="text-[9px] font-black" style={{ color:PRIORITY_C[c.urgency as Priority] }}>{c.urgency}</span>
              </div>
            </div>
          ))}
        </div>
      </DarkCard>

      {/* Decision matrix */}
      <DarkCard className="p-4 sm:p-5 ximo-fade-up delay-400">
        <SectionHeader dark title="Matriz de decisión" subtitle="Comparación por criterio · escala 1–5" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr>
                <th className="pb-2 text-left text-[10px] font-bold uppercase tracking-wider w-36" style={{ color:"var(--text-label)" }}>Criterio</th>
                {matrixSchools.map(s => (
                  <th key={s} className="pb-2 text-center text-[10px] font-bold" style={{ color:"var(--teal)" }}>{s}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor:"var(--surface-hover)" }}>
              {matrixRows.map(row => (
                <tr key={row.label}>
                  <td className="py-2.5 pr-4 text-[11px] font-medium" style={{ color:"var(--text-label)" }}>{row.label}</td>
                  {row.scores.map((score, i) => (
                    <td key={i} className="py-2.5 text-center"><ScoreDots score={score} /></td>
                  ))}
                </tr>
              ))}
              <tr style={{ borderTop:"2px solid var(--border-strong)" }}>
                <td className="py-2.5 pr-4 text-[11px] font-black text-brand">Total</td>
                {matrixSchools.map((_, i) => {
                  const t = matrixRows.reduce((s, r) => s + r.scores[i], 0);
                  return <td key={i} className="py-2.5 text-center">
                    <span className="text-xs font-black" style={{ color: i===0?"var(--teal-muted)":"var(--teal)" }}>{t}/{matrixRows.length*5}</span>
                  </td>;
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </DarkCard>

      {/* Next steps */}
      <DarkCard className="p-4 sm:p-5 ximo-fade-up delay-400">
        <SectionHeader dark title="Próximos pasos" subtitle="Acciones concretas para esta semana" action="Ver tareas →" actionHref="/app/tareas" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {nextSteps.map((step, i) => (
            <div key={step.task} className="flex gap-3 rounded-xl p-3"
              style={{ background:"var(--surface-hover)", border:"1px solid var(--border-subtle)" }}>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-black"
                style={step.p ? { background:"var(--teal-muted)", color:"white" } : { background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.35)" }}>
                {i + 1}
              </span>
              <div>
                <p className="text-[11px] font-bold text-brand leading-snug">{step.task}</p>
                <p className="mt-0.5 text-[10px] font-semibold" style={{ color:"var(--teal-muted)" }}>{step.by}</p>
              </div>
            </div>
          ))}
        </div>
      </DarkCard>

      <footer className="rounded-xl py-2.5 text-center text-[11px]"
        style={{ border:"1px dashed var(--border-subtle)", color:"var(--text-label)" }}>
        Datos de muestra · App en desarrollo · Ximo
      </footer>
    </div>
  );
}

