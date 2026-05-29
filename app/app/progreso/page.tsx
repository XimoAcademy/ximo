import PageHeader from "../components/PageHeader";
import { ProgressBar, SectionHeader } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";

const CARD  = { background:"var(--surface)",  border:"1px solid var(--border)" } as const;
const INNER = { background:"var(--surface-hover)", border:"1px solid var(--border-subtle)"  } as const;

const events = [
  { event:"50 libre",     current:"26.0", target:"25.2", improvement:"−0.8s",  progress:72, note:"Mejor marca en competencia reciente. Prioridad para coaches D1." },
  { event:"100 libre",    current:"58.0", target:"56.5", improvement:"−1.5s",  progress:58, note:"Consistencia mejorando. Enfocar en salida y primer 25m." },
  { event:"100 mariposa", current:"63.0", target:"61.0", improvement:"−2.0s",  progress:45, note:"Evento secundario. Útil para relays y versatilidad." },
  { event:"200 libre",    current:"2:05.0",target:"2:00.0",improvement:"−5.0s",progress:38, note:"Desarrollar resistencia para programas que valoran versatilidad." },
];

const recentProgress = [
  "Mejor técnica de salida en 50 libre",
  "Mejor constancia en entrenamiento de base",
  "Próxima competencia por actualizar — Guadalajara Open",
];

export default function ProgresoPage() {
  return (
    <>
      <PageHeader
        title="Progreso deportivo"
        subtitle="Visualiza tus eventos, tiempos actuales, metas y avances hacia estándares universitarios."
      />

      <div className="mb-5 space-y-3">
        {events.map((ev, i) => (
          <ScrollReveal key={ev.event} delay={i * 60}>
          <div className="rounded-2xl p-4 sm:p-5 ximo-card-3d" style={CARD}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-black" style={{ color:"var(--text)" }}>{ev.event}</h2>
              <span className="text-xs font-semibold" style={{ color:"var(--teal)" }}>Falta {ev.improvement}</span>
            </div>
            <div className="mb-3 flex flex-wrap gap-4 text-sm" style={{ color:"var(--text-2)" }}>
              <span>Actual: <strong className="font-mono" style={{ color:"var(--text)" }}>{ev.current}</strong></span>
              <span>Meta: <strong className="font-mono" style={{ color:"var(--gold)" }}>{ev.target}</strong></span>
            </div>
            <ProgressBar value={ev.progress} />
            <p className="mt-3 text-sm leading-relaxed" style={{ color:"var(--text-label)" }}>{ev.note}</p>
          </div>
          </ScrollReveal>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl p-4 sm:p-5" style={CARD}>
          <SectionHeader title="Últimos avances" subtitle="Temporada 2024–25" />
          <ul className="space-y-3">
            {recentProgress.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color:"var(--text-2)" }}>
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background:"var(--gold)" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl" style={CARD}>
          <div className="p-5" style={{ background:"linear-gradient(135deg, rgba(30,206,206,0.12), rgba(201,168,76,0.06))" }}>
            <p className="text-sm font-black" style={{ color:"var(--text)" }}>Meta principal</p>
            <p className="mt-0.5 text-xs" style={{ color:"var(--text-label)" }}>Enfoque de temporada</p>
          </div>
          <div className="p-5">
            <p className="text-sm leading-relaxed" style={{ color:"var(--text-2)" }}>
              Bajar el tiempo necesario para abrir más opciones universitarias reales.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

