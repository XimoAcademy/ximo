import { notFound } from "next/navigation";
import { GlassPanel, BackLink, StatusBadge } from "../../components/ui";
import ScrollReveal from "../../../components/ScrollReveal";
import { getDocument } from "@/lib/data/documents";
import { getCurrentUser } from "@/lib/auth/getUser";
import EditDocumentForm from "./EditDocumentForm";
import DocumentFile from "./DocumentFile";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, "success" | "info" | "gold"> = { listo: "success", revisar: "info", pendiente: "gold" };
const STATUS_LABEL: Record<string, string> = { listo: "Listo", revisar: "Revisar", pendiente: "Pendiente" };

export default async function DocumentoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [doc, user] = await Promise.all([getDocument(id), getCurrentUser()]);
  if (!doc) notFound();

  const status = doc.status ?? "pendiente";
  const fileName = doc.file_url ? doc.file_url.split("/").pop()?.replace(/^\d+-/, "") ?? null : null;

  return (
    <div className="mx-auto max-w-[820px] space-y-5">
      <BackLink href="/app/documentos">Documentos</BackLink>

      <ScrollReveal>
        <GlassPanel className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={STATUS_TONE[status] ?? "gold"}>{STATUS_LABEL[status] ?? status}</StatusBadge>
            {doc.type && <StatusBadge tone="neutral">Importancia {doc.type}</StatusBadge>}
          </div>
          <h1 className="mt-3 text-2xl font-black" style={{ color: "var(--text)" }}>{doc.title}</h1>
          {doc.notes && <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{doc.notes}</p>}
        </GlassPanel>
      </ScrollReveal>

      <ScrollReveal delay={60}>
        <GlassPanel className="p-5">
          <h2 className="mb-3 text-base font-black" style={{ color: "var(--text)" }}>Archivo</h2>
          {user ? (
            <DocumentFile docId={doc.id} userId={user.id} hasFile={!!doc.file_url} fileName={fileName} />
          ) : (
            <p className="text-sm" style={{ color: "var(--text-label)" }}>Inicia sesión para subir archivos.</p>
          )}
        </GlassPanel>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <GlassPanel className="p-5 sm:p-6">
          <h2 className="mb-4 text-base font-black" style={{ color: "var(--text)" }}>Detalles</h2>
          <EditDocumentForm doc={doc} />
        </GlassPanel>
      </ScrollReveal>
    </div>
  );
}
