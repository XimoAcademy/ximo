import PageHeader from "../components/PageHeader";
import { Card, ProgressBar, SectionHeader } from "../components/ui";

const events = [
  {
    event: "50 libre",
    current: "26.0",
    target: "25.2",
    improvement: "−0.8s",
    progress: 72,
    note: "Mejor marca en competencia reciente. Prioridad para coaches D1.",
  },
  {
    event: "100 libre",
    current: "58.0",
    target: "56.5",
    improvement: "−1.5s",
    progress: 58,
    note: "Consistencia mejorando. Enfocar en salida y primer 25m.",
  },
  {
    event: "100 mariposa",
    current: "63.0",
    target: "61.0",
    improvement: "−2.0s",
    progress: 45,
    note: "Evento secundario. Útil para relays y versatilidad.",
  },
  {
    event: "200 libre",
    current: "2:05.0",
    target: "2:00.0",
    improvement: "−5.0s",
    progress: 38,
    note: "Desarrollar resistencia para programas que valoran versatilidad.",
  },
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

      <div className="mb-5 space-y-4">
        {events.map((ev) => (
          <Card key={ev.event} className="p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-black text-[#0B1F33]">{ev.event}</h2>
              <span className="text-xs font-semibold text-[#1D4ED8]">
                Falta {ev.improvement}
              </span>
            </div>
            <div className="mb-3 flex flex-wrap gap-4 text-sm">
              <span>
                Actual:{" "}
                <strong className="font-mono text-[#0B1F33]">
                  {ev.current}
                </strong>
              </span>
              <span className="text-[#5E7080]">
                Meta: <strong className="font-mono">{ev.target}</strong>
              </span>
            </div>
            <ProgressBar value={ev.progress} />
            <p className="mt-3 text-sm leading-relaxed text-[#5E7080]">
              {ev.note}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-4 sm:p-5">
          <SectionHeader title="Últimos avances" subtitle="Temporada 2024–25" />
          <ul className="space-y-3">
            {recentProgress.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-[#0D1B2A]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A84C]" />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-[#0B1F33] to-[#0A1C2E] p-5">
            <p className="text-sm font-black text-white">Meta principal</p>
            <p className="mt-1 text-xs text-white/45">Enfoque de temporada</p>
          </div>
          <div className="p-5">
            <p className="text-sm leading-relaxed text-[#5E7080]">
              Bajar el tiempo necesario para abrir más opciones universitarias
              reales.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
