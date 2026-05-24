import PageHeader from "../components/PageHeader";
import { Badge, Card, ProgressBar } from "../components/ui";

const filters = [
  "Todas",
  "Prioridad alta",
  "Necesitan seguimiento",
  "Aspiracionales",
  "Con interés real",
];

const universities = [
  {
    name: "Niagara University",
    division: "NCAA D1",
    location: "Niagara, NY",
    status: "Contactada",
    statusColor: "bg-[#1D4ED8]/12 text-[#1D4ED8]",
    coachInterest: "Interés medio",
    scholarship: "Media — falta aclarar beca oficial",
    scholarshipColor: "text-[#C9A84C]",
    fit: 78,
    nextAction: "Preguntar beca oficial a Coach Dylan",
    priority: "Alta prioridad",
    priorityColor: "bg-[#C9A84C]/15 text-[#0B1F33]",
  },
  {
    name: "LIU",
    division: "NCAA D1",
    location: "Brooklyn, NY",
    status: "Respondió",
    statusColor: "bg-emerald-500/12 text-emerald-700",
    coachInterest: "Interés alto",
    scholarship: "Alta claridad",
    scholarshipColor: "text-emerald-600",
    fit: 82,
    nextAction: "Enviar actualizaciones de verano",
    priority: "Alta prioridad",
    priorityColor: "bg-[#C9A84C]/15 text-[#0B1F33]",
  },
  {
    name: "Towson University",
    division: "NCAA D1",
    location: "Towson, MD",
    status: "Interesada",
    statusColor: "bg-emerald-500/12 text-emerald-700",
    coachInterest: "Interés alto",
    scholarship: "Alta claridad",
    scholarshipColor: "text-emerald-600",
    fit: 85,
    nextAction: "Seguimiento de llamada con Coach Boyle",
    priority: "Opción segura",
    priorityColor: "bg-[#1D4ED8]/12 text-[#1D4ED8]",
  },
  {
    name: "Husson University",
    division: "NCAA D3",
    location: "Bangor, ME",
    status: "Identificada",
    statusColor: "bg-[#0B1F33]/8 text-[#5E7080]",
    coachInterest: "Sin contacto",
    scholarship: "Parcial — need-based",
    scholarshipColor: "text-[#5E7080]",
    fit: 65,
    nextAction: "Preparar primer correo",
    priority: "Pendiente",
    priorityColor: "bg-[#0B1F33]/8 text-[#5E7080]",
  },
  {
    name: "Princeton",
    division: "NCAA D1 · Ivy",
    location: "Princeton, NJ",
    status: "Reach",
    statusColor: "bg-amber-500/12 text-amber-700",
    coachInterest: "Aspiracional",
    scholarship: "Need-based — sin athletic full ride",
    scholarshipColor: "text-amber-600",
    fit: 42,
    nextAction: "Mejorar tiempos y GPA antes de contactar",
    priority: "Aspiracional",
    priorityColor: "bg-amber-500/12 text-amber-700",
  },
  {
    name: "UNCW",
    division: "NCAA D1",
    location: "Wilmington, NC",
    status: "Contactada",
    statusColor: "bg-[#1D4ED8]/12 text-[#1D4ED8]",
    coachInterest: "Interés bajo",
    scholarship: "Media claridad",
    scholarshipColor: "text-[#C9A84C]",
    fit: 70,
    nextAction: "Follow-up post competencia",
    priority: "Baja respuesta",
    priorityColor: "bg-[#0B1F33]/8 text-[#5E7080]",
  },
  {
    name: "Le Moyne",
    division: "NCAA D2",
    location: "Syracuse, NY",
    status: "Identificada",
    statusColor: "bg-[#0B1F33]/8 text-[#5E7080]",
    coachInterest: "Por evaluar",
    scholarship: "Alta claridad — parcial",
    scholarshipColor: "text-emerald-600",
    fit: 74,
    nextAction: "Contactar Coach Adam en abril",
    priority: "Opción segura",
    priorityColor: "bg-[#1D4ED8]/12 text-[#1D4ED8]",
  },
];

export default function UniversidadesPage() {
  return (
    <>
      <PageHeader
        title="Universidades"
        subtitle="Compara opciones, claridad de beca, nivel deportivo, comunicación con coaches y próximos pasos."
      />

      <Card className="mb-4 p-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, i) => (
            <button
              key={filter}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                i === 0
                  ? "bg-[#0B1F33] text-white"
                  : "border border-[#0B1F33]/10 bg-white text-[#5E7080] hover:border-[#0B1F33]/20"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        {universities.map((uni) => (
          <Card key={uni.name} className="p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-black text-[#0B1F33]">
                    {uni.name}
                  </h2>
                  <Badge className={uni.statusColor}>{uni.status}</Badge>
                  <Badge className={uni.priorityColor}>{uni.priority}</Badge>
                </div>
                <p className="mt-1 text-sm text-[#5E7080]">
                  {uni.division} · {uni.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#1D4ED8]">
                  {uni.fit}%
                </p>
                <p className="text-[10px] text-[#5E7080]">ajuste estimado</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg bg-[#F5F5F0] px-3 py-2">
                <p className="text-[9px] font-bold tracking-wide text-[#5E7080] uppercase">
                  Interés del coach
                </p>
                <p className="mt-0.5 text-sm font-semibold text-[#0B1F33]">
                  {uni.coachInterest}
                </p>
              </div>
              <div className="rounded-lg bg-[#F5F5F0] px-3 py-2">
                <p className="text-[9px] font-bold tracking-wide text-[#5E7080] uppercase">
                  Claridad de beca
                </p>
                <p
                  className={`mt-0.5 text-sm font-semibold ${uni.scholarshipColor}`}
                >
                  {uni.scholarship}
                </p>
              </div>
              <div className="rounded-lg bg-[#F5F5F0] px-3 py-2">
                <p className="text-[9px] font-bold tracking-wide text-[#5E7080] uppercase">
                  Próxima acción
                </p>
                <p className="mt-0.5 text-sm font-semibold text-[#0B1F33]">
                  {uni.nextAction}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <ProgressBar
                value={uni.fit}
                color="from-[#1D4ED8] to-[#C9A84C]"
              />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
