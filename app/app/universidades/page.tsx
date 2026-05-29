import PageHeader from "../components/PageHeader";
import { Card, ProgressBar } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";

const universities = [
  { name:"Niagara University",  division:"NCAA D1",       location:"Niagara, NY",    status:"Contactada",      sc:"rgba(30,206,206,0.12)",   tc:"var(--teal)",                     scholarship:"Media — falta aclarar beca",  shC:"var(--gold)",                  fit:78,  nextAction:"Preguntar beca oficial a Coach Dylan",        priority:"Alta",       pc:"rgba(201,168,76,0.15)",    ptc:"var(--gold)"   },
  { name:"LIU Brooklyn",        division:"NCAA D1",       location:"Brooklyn, NY",   status:"Respondió",       sc:"rgba(5,150,105,0.12)",     tc:"#6ee7b7",                     scholarship:"Alta claridad",               shC:"#6ee7b7",                  fit:82,  nextAction:"Enviar actualizaciones de verano",             priority:"Alta",       pc:"rgba(201,168,76,0.15)",    ptc:"var(--gold)"   },
  { name:"Towson University",   division:"NCAA D1",       location:"Towson, MD",     status:"Interesada",      sc:"rgba(5,150,105,0.12)",     tc:"#6ee7b7",                     scholarship:"Alta claridad",               shC:"#6ee7b7",                  fit:85,  nextAction:"Seguimiento de llamada con Coach Boyle",       priority:"Opción",     pc:"rgba(30,206,206,0.12)",   ptc:"var(--teal)"  },
  { name:"Husson University",   division:"NCAA D3",       location:"Bangor, ME",     status:"Identificada",    sc:"rgba(127,175,178,0.1)",    tc:"var(--text-label)",       scholarship:"Parcial — need-based",        shC:"var(--text-label)",    fit:65,  nextAction:"Preparar primer correo",                       priority:"Pendiente",  pc:"var(--border-subtle)",    ptc:"var(--text-label)" },
  { name:"Princeton",           division:"NCAA D1 · Ivy", location:"Princeton, NJ",  status:"Reach",           sc:"rgba(251,191,36,0.12)",    tc:"#fbbf24",                     scholarship:"Need-based — sin athletic",   shC:"#fbbf24",                  fit:42,  nextAction:"Mejorar tiempos y GPA antes de contactar",     priority:"Aspirac.",   pc:"rgba(251,191,36,0.1)",    ptc:"#fbbf24"  },
  { name:"UNCW",                division:"NCAA D1",       location:"Wilmington, NC", status:"Contactada",      sc:"rgba(30,206,206,0.12)",    tc:"var(--teal)",                     scholarship:"Media claridad",              shC:"var(--gold)",                  fit:70,  nextAction:"Follow-up post competencia",                   priority:"Baja resp.", pc:"var(--border-subtle)",   ptc:"var(--text-label)" },
  { name:"Le Moyne",            division:"NCAA D2",       location:"Syracuse, NY",   status:"Identificada",    sc:"rgba(127,175,178,0.1)",    tc:"var(--text-label)",       scholarship:"Alta claridad — parcial",     shC:"#6ee7b7",                  fit:74,  nextAction:"Contactar Coach Adam en abril",                priority:"Opción",     pc:"rgba(30,206,206,0.12)",   ptc:"var(--teal)"  },
];

const CARD = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
} as const;

const INNER = {
  background: "var(--surface-hover)",
  border: "1px solid var(--border-subtle)",
} as const;

export default function UniversidadesPage() {
  return (
    <>
      <PageHeader
        title="Universidades"
        subtitle="Compara opciones, claridad de beca, nivel deportivo y próximos pasos."
      />

      <div className="space-y-4">
        {universities.map((uni, i) => (
          <ScrollReveal key={uni.name} delay={i * 50}>
          <div className="rounded-2xl p-4 sm:p-5 ximo-card-3d" style={CARD}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-black" style={{ color: "var(--text)" }}>
                    {uni.name}
                  </h2>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: uni.sc, color: uni.tc }}>{uni.status}</span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                    style={{ background: uni.pc, color: uni.ptc }}>{uni.priority}</span>
                </div>
                <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
                  {uni.division} · {uni.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black" style={{ color: "var(--teal)" }}>{uni.fit}%</p>
                <p className="text-[10px]" style={{ color: "var(--text-label)" }}>ajuste estimado</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl px-3 py-2.5" style={INNER}>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Interés del coach</p>
                <p className="mt-0.5 text-sm font-semibold" style={{ color: "var(--text)" }}>—</p>
              </div>
              <div className="rounded-xl px-3 py-2.5" style={INNER}>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Claridad de beca</p>
                <p className="mt-0.5 text-sm font-semibold" style={{ color: uni.shC }}>{uni.scholarship}</p>
              </div>
              <div className="rounded-xl px-3 py-2.5" style={INNER}>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Próxima acción</p>
                <p className="mt-0.5 text-sm font-semibold" style={{ color: "var(--teal)" }}>{uni.nextAction}</p>
              </div>
            </div>
            <div className="mt-3">
              <ProgressBar value={uni.fit} />
            </div>
          </div>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}

