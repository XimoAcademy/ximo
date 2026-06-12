import Link from "next/link";
import PageHeader from "../components/PageHeader";
import { StatusBadge, EmptyState, StatCard, InnerTile } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";
import { getCoaches, getUniversityOptions, type CoachRow } from "@/lib/data/coaches";
import AddCoachForm from "./AddCoachForm";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, "neutral" | "info" | "gold" | "success" | "error" | "warning"> = {
  "Sin contactar": "neutral",
  Contactado: "info",
  "Esperando respuesta": "warning",
  Respondió: "gold",
  "Interés alto": "success",
  "Interés confirmado": "success",
  "Llamada agendada": "info",
  Descartado: "error",
};

function fmtDate(ts: string | null): string | null {
  if (!ts) return null;
  return new Date(ts).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

function CoachCard({ c }: { c: CoachRow }) {
  const next = fmtDate(c.next_follow_up_at);
  const last = fmtDate(c.last_contact_at);
  return (
    <Link href={`/app/coaches/${c.id}`} className="block rounded-2xl p-4 sm:p-5 ximo-card-3d"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-black" style={{ color: "var(--text)" }}>{c.name}</h2>
          <p className="text-sm" style={{ color: "var(--text-label)" }}>
            {[c.role, c.university?.name].filter(Boolean).join(" · ") || "Sin universidad vinculada"}
          </p>
          {c.email && <p className="mt-0.5 text-xs" style={{ color: "var(--text-label)" }}>{c.email}</p>}
        </div>
        {c.status && <StatusBadge tone={STATUS_TONE[c.status] ?? "neutral"}>{c.status}</StatusBadge>}
      </div>
      {(last || next) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <InnerTile className="px-3 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Último contacto</p>
            <p className="mt-0.5 text-sm" style={{ color: "var(--text-2)" }}>{last ?? "—"}</p>
          </InnerTile>
          <InnerTile className="px-3 py-2.5">
            <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>Próximo follow-up</p>
            <p className="mt-0.5 text-sm font-semibold" style={{ color: "var(--teal)" }}>{next ?? "Por agendar"}</p>
          </InnerTile>
        </div>
      )}
      {c.notes && <p className="mt-3 line-clamp-2 text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>{c.notes}</p>}
    </Link>
  );
}

export default async function CoachesPage() {
  const [{ rows }, universities] = await Promise.all([getCoaches(), getUniversityOptions()]);

  const interested = rows.filter((c) => ["Interés alto", "Interés confirmado"].includes(c.status ?? "")).length;
  const waiting = rows.filter((c) => c.status === "Esperando respuesta").length;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="Coaches"
          subtitle="Tu CRM de entrenadores (Gestor de Relaciones con Coaches): registra conversaciones, respuestas, llamadas y follow-ups con cada programa NCAA."
        />
        <AddCoachForm universities={universities} />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="Tu CRM de coaches está vacío"
          text="El CRM (Gestor de Relaciones con Coaches) te permite llevar el seguimiento de cada entrenador: conversaciones, respuestas y próximos pasos. Agrega tu primer coach o encuéntralo en el directorio NCAA."
          action="Ver directorio NCAA"
          actionHref="/app/directorio"
        />
      ) : (
        <>
          <div className="mb-5 grid grid-cols-3 gap-3">
            <StatCard label="En pipeline" value={rows.length} />
            <StatCard label="Con interés" value={interested} accent="gold" />
            <StatCard label="Esperando respuesta" value={waiting} accent="text" />
          </div>
          <div className="space-y-3">
            {rows.map((c, i) => (
              <ScrollReveal key={c.id} delay={i * 40}>
                <CoachCard c={c} />
              </ScrollReveal>
            ))}
          </div>
        </>
      )}
    </>
  );
}
