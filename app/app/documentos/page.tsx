import PageHeader from "../components/PageHeader";
import { ProgressBar, SectionHeader } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";

const CARD  = { background:"var(--surface)",  border:"1px solid var(--border)" } as const;

const documents = [
  { name:"Transcript académico",       status:"listo",    importance:"alta",  note:"Traducción oficial lista y verificada" },
  { name:"Perfil atlético",            status:"revisar",  importance:"alta",  note:"Actualizar logros y tiempos de marzo" },
  { name:"Video deportivo",            status:"pendiente",importance:"alta",  note:"Subir clip de 50 libre · competencia reciente" },
  { name:"Pasaporte",                  status:"listo",    importance:"media", note:"Vigente hasta 2029" },
  { name:"SAT",                        status:"listo",    importance:"alta",  note:"Practice 1340 — listo para compartir" },
  { name:"TOEFL",                      status:"pendiente",importance:"alta",  note:"Examen programado para junio" },
  { name:"Cartas de recomendación",    status:"pendiente",importance:"media", note:"Solicitar a coach y director académico" },
  { name:"Lista de universidades",     status:"listo",    importance:"media", note:"12 universidades curadas con prioridades" },
  { name:"Historial de tiempos",       status:"listo",    importance:"alta",  note:"Temporada 2024–25 documentada" },
  { name:"Información financiera",     status:"listo",    importance:"baja",  note:"FAFSA prep y estimado de need-based aid" },
];

function statusBadge(s: string) {
  if (s === "listo")    return { bg:"rgba(5,150,105,0.12)",   tc:"#6ee7b7",  label:"Listo" };
  if (s === "revisar")  return { bg:"rgba(30,206,206,0.12)",  tc:"var(--teal)",  label:"Revisar" };
  return                       { bg:"rgba(201,168,76,0.12)",  tc:"var(--gold)",  label:"Pendiente" };
}

function importanceBadge(i: string) {
  if (i === "alta")   return { bg:"var(--border)",  tc:"rgba(127,175,178,0.7)", label:"Alta" };
  if (i === "media")  return { bg:"var(--surface-hover)",  tc:"var(--text-label)", label:"Media" };
  return                     { bg:"var(--surface-hover)",  tc:"var(--text-label)", label:"Baja" };
}

export default function DocumentosPage() {
  const completed = documents.filter((d) => d.status === "listo").length;

  return (
    <>
      <PageHeader title="Documentos" subtitle="Ten listo todo lo que un coach o universidad puede pedirte." />

      {/* Progress summary */}
      <div className="mb-5 rounded-2xl p-5" style={CARD}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-black" style={{ color:"var(--teal)" }}>
              {completed} <span className="text-base font-medium" style={{ color:"var(--text-2)" }}>de {documents.length}</span>
            </p>
            <p className="text-sm" style={{ color:"var(--text-label)" }}>documentos preparados</p>
          </div>
          <div className="w-full max-w-xs">
            <ProgressBar value={(completed / documents.length) * 100} />
          </div>
        </div>
      </div>

      <SectionHeader title="Checklist" subtitle="Estado de cada documento" />
      <div className="space-y-2.5">
        {documents.map((doc, i) => {
          const s = statusBadge(doc.status);
          const imp = importanceBadge(doc.importance);
          return (
            <ScrollReveal key={doc.name} delay={i * 40}>
            <div className="rounded-2xl p-4 ximo-card-3d" style={CARD}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                    style={doc.status === "listo"
                      ? { background:"rgba(5,150,105,0.15)", color:"#6ee7b7" }
                      : { background:"var(--border-subtle)", color:"var(--text-label)" }
                    }
                  >
                    {doc.status === "listo" ? "✓" : "·"}
                  </span>
                  <div>
                    <p className="font-bold" style={{ color:"var(--text)" }}>{doc.name}</p>
                    <p className="text-xs" style={{ color:"var(--text-label)" }}>{doc.note}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background:imp.bg, color:imp.tc }}>
                    {imp.label}
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background:s.bg, color:s.tc }}>
                    {s.label}
                  </span>
                </div>
              </div>
            </div>
            </ScrollReveal>
          );
        })}
      </div>
    </>
  );
}

