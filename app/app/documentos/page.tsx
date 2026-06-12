import Link from "next/link";
import PageHeader from "../components/PageHeader";
import { ProgressBar, StatusBadge, GlassPanel } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";
import { getDocuments, type DocumentRow } from "@/lib/data/documents";
import AddDocumentForm from "./AddDocumentForm";
import { setDocumentStatusAction, seedDocumentChecklistAction } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, "success" | "info" | "gold"> = {
  listo: "success",
  revisar: "info",
  pendiente: "gold",
};
const STATUS_LABEL: Record<string, string> = { listo: "Listo", revisar: "Revisar", pendiente: "Pendiente" };
const NEXT_STATUS: Record<string, string> = { pendiente: "revisar", revisar: "listo", listo: "pendiente" };

function DocRow({ doc }: { doc: DocumentRow }) {
  const status = doc.status ?? "pendiente";
  const done = status === "listo";
  return (
    <div className="rounded-2xl p-4 ximo-card-3d" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={`/app/documentos/${doc.id}`} className="flex min-w-0 items-center gap-3 group">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
            style={done ? { background: "rgba(5,150,105,0.15)", color: "var(--success)" } : { background: "var(--border-subtle)", color: "var(--text-label)" }}>
            {done ? "✓" : "·"}
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold transition-colors group-hover:text-[var(--teal)]" style={{ color: "var(--text)" }}>{doc.title}</p>
            {doc.notes && <p className="truncate text-xs" style={{ color: "var(--text-label)" }}>{doc.notes}</p>}
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {doc.type && <StatusBadge tone="neutral">{doc.type}</StatusBadge>}
          {doc.file_url && <StatusBadge tone="info">archivo</StatusBadge>}
          {(() => {
            const nextStatus = NEXT_STATUS[status] ?? "revisar";
            const blockedByFile = nextStatus === "listo" && !doc.file_url;
            if (blockedByFile) {
              return (
                <Link
                  href={`/app/documentos/${doc.id}`}
                  title="Sube el archivo primero para marcarlo como listo"
                  className="ximo-glass-chip rounded-full px-3 py-1 text-[11px] font-semibold"
                  style={{ color: "var(--text-label)", border: "1px dashed var(--border)" }}
                >
                  Subir archivo →
                </Link>
              );
            }
            return (
              <form action={setDocumentStatusAction}>
                <input type="hidden" name="id" value={doc.id} />
                <input type="hidden" name="status" value={nextStatus} />
                <button className="ximo-glass-chip rounded-full px-3 py-1 text-[11px] font-semibold" style={{ color: STATUS_TONE[status] === "success" ? "var(--success)" : "var(--teal)" }}>
                  {STATUS_LABEL[status] ?? status}
                </button>
              </form>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default async function DocumentosPage() {
  const { rows } = await getDocuments();
  const completed = rows.filter((d) => d.status === "listo").length;
  const pct = rows.length ? (completed / rows.length) * 100 : 0;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Documentos" subtitle="Ten listo todo lo que un coach o universidad pueda pedirte." />
        <AddDocumentForm />
      </div>

      {rows.length === 0 ? (
        <GlassPanel tone="teal" className="px-6 py-12 text-center">
          <p className="text-sm font-black" style={{ color: "var(--text)" }}>Empieza tu checklist de documentos</p>
          <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>
            Carga el checklist estándar de reclutamiento (transcript, video, perfil atlético, SAT/TOEFL y más) y ve marcando cada uno a medida que lo prepares.
          </p>
          <form action={seedDocumentChecklistAction} className="mt-5">
            <button className="ximo-glass-btn teal text-xs">Cargar checklist estándar</button>
          </form>
        </GlassPanel>
      ) : (
        <>
          <div className="mb-5 rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-2xl font-black" style={{ color: "var(--teal)" }}>
                  {completed} <span className="text-base font-medium" style={{ color: "var(--text-2)" }}>de {rows.length}</span>
                </p>
                <p className="text-sm" style={{ color: "var(--text-label)" }}>documentos preparados</p>
              </div>
              <div className="w-full max-w-xs"><ProgressBar value={pct} /></div>
            </div>
          </div>

          <div className="space-y-2.5">
            {rows.map((doc, i) => (
              <ScrollReveal key={doc.id} delay={i * 30}>
                <DocRow doc={doc} />
              </ScrollReveal>
            ))}
          </div>
        </>
      )}
    </>
  );
}
