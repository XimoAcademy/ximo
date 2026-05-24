import PageHeader from "../components/PageHeader";
import { Badge, Card, ProgressBar, SectionHeader } from "../components/ui";

const documents = [
  {
    name: "Transcript académico",
    status: "listo",
    importance: "alta",
    note: "Traducción oficial lista y verificada",
  },
  {
    name: "Perfil atlético",
    status: "revisar",
    importance: "alta",
    note: "Actualizar logros y tiempos de marzo",
  },
  {
    name: "Video deportivo",
    status: "pendiente",
    importance: "alta",
    note: "Subir clip de 50 libre · competencia reciente",
  },
  {
    name: "Pasaporte",
    status: "listo",
    importance: "media",
    note: "Vigente hasta 2029",
  },
  {
    name: "SAT",
    status: "listo",
    importance: "alta",
    note: "Practice 1340 — listo para compartir mientras agenda oficial",
  },
  {
    name: "TOEFL",
    status: "pendiente",
    importance: "alta",
    note: "Examen programado para junio",
  },
  {
    name: "Cartas de recomendación",
    status: "pendiente",
    importance: "media",
    note: "Solicitar a coach y director académico",
  },
  {
    name: "Lista de universidades",
    status: "listo",
    importance: "media",
    note: "12 universidades curadas con prioridades",
  },
  {
    name: "Historial de tiempos",
    status: "listo",
    importance: "alta",
    note: "Temporada 2024–25 documentada",
  },
  {
    name: "Información financiera",
    status: "listo",
    importance: "baja",
    note: "FAFSA prep y estimado de need-based aid",
  },
];

const statusStyles: Record<string, string> = {
  listo: "bg-emerald-500/12 text-emerald-700",
  pendiente: "bg-[#C9A84C]/15 text-[#0B1F33]",
  revisar: "bg-[#1D4ED8]/12 text-[#1D4ED8]",
};

const importanceStyles: Record<string, string> = {
  alta: "bg-[#0B1F33]/8 text-[#0B1F33]",
  media: "bg-[#F5F5F0] text-[#5E7080]",
  baja: "bg-[#F5F5F0] text-[#5E7080]",
};

export default function DocumentosPage() {
  const completed = documents.filter((d) => d.status === "listo").length;

  return (
    <>
      <PageHeader
        title="Documentos"
        subtitle="Ten listo todo lo que un coach o universidad puede pedirte."
      />

      <Card className="mb-5 p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-[#0B1F33]">
              {completed} de {documents.length}
            </p>
            <p className="text-sm text-[#5E7080]">documentos preparados</p>
          </div>
          <div className="w-full max-w-xs">
            <ProgressBar value={(completed / documents.length) * 100} />
          </div>
        </div>
      </Card>

      <SectionHeader title="Checklist" subtitle="Estado de cada documento" />
      <div className="space-y-3">
        {documents.map((doc) => (
          <Card key={doc.name} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                    doc.status === "listo"
                      ? "bg-emerald-500/15 text-emerald-700"
                      : "bg-[#0B1F33]/6 text-[#5E7080]"
                  }`}
                >
                  {doc.status === "listo" ? "✓" : "·"}
                </span>
                <div>
                  <p className="font-bold text-[#0B1F33]">{doc.name}</p>
                  <p className="text-xs text-[#5E7080]">{doc.note}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={importanceStyles[doc.importance]}>
                  Importancia {doc.importance}
                </Badge>
                <Badge className={statusStyles[doc.status]}>
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
