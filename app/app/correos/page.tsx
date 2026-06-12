import PageHeader from "../components/PageHeader";
import { EmptyState, StatusBadge, GlassPanel } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";
import { getEmails, getCoachOptions, type EmailRow } from "@/lib/data/emails";
import ComposeEmail from "./ComposeEmail";
import { setEmailStatusAction, deleteEmailAction } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, "info" | "success" | "gold" | "neutral" | "warning"> = {
  Borrador: "neutral",
  Enviado: "info",
  Respondido: "success",
  "Follow-up": "gold",
  "Sin respuesta": "warning",
};
const NEXT_STATUS: Record<string, string> = {
  Borrador: "Enviado",
  Enviado: "Respondido",
  Respondido: "Follow-up",
  "Follow-up": "Sin respuesta",
  "Sin respuesta": "Borrador",
};

function fmtDate(ts: string | null): string {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

function EmailCard({ e }: { e: EmailRow }) {
  const status = e.status ?? "Borrador";
  const to = e.coach?.name ?? e.university?.name ?? "Sin destinatario";
  return (
    <div className="rounded-2xl p-4 ximo-card-3d" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{to}</p>
          <p className="mt-0.5 text-sm" style={{ color: "var(--text-2)" }}>{e.subject || "(Sin asunto)"}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge tone={STATUS_TONE[status] ?? "neutral"}>{status}</StatusBadge>
          {e.sent_at && <span className="text-[11px]" style={{ color: "var(--text-label)" }}>{fmtDate(e.sent_at)}</span>}
        </div>
      </div>
      {e.body && (
        <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-3)" }}>{e.body}</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <form action={setEmailStatusAction}>
          <input type="hidden" name="id" value={e.id} />
          <input type="hidden" name="status" value={NEXT_STATUS[status] ?? "Enviado"} />
          <button className="ximo-glass-chip rounded-full px-3 py-1 text-[11px] font-semibold" style={{ color: "var(--teal)" }}>
            Marcar: {NEXT_STATUS[status] ?? "Enviado"}
          </button>
        </form>
        {e.coach?.email && (
          <a
            href={`mailto:${e.coach.email}?subject=${encodeURIComponent(e.subject ?? "")}&body=${encodeURIComponent(e.body ?? "")}`}
            className="ximo-glass-chip rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{ color: "var(--gold)" }}
          >
            Abrir en correo
          </a>
        )}
        <form action={deleteEmailAction} className="ml-auto">
          <input type="hidden" name="id" value={e.id} />
          <button className="ximo-text-btn">Eliminar</button>
        </form>
      </div>
    </div>
  );
}

export default async function CorreosPage() {
  const [{ rows }, coaches] = await Promise.all([getEmails(), getCoachOptions()]);

  const counts = {
    Enviado: rows.filter((e) => e.status === "Enviado").length,
    Respondido: rows.filter((e) => e.status === "Respondido").length,
    "Follow-up": rows.filter((e) => e.status === "Follow-up").length,
    Borrador: rows.filter((e) => e.status === "Borrador").length,
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="Correos" subtitle="Centraliza tus mensajes a coaches: plantillas, follow-ups y respuestas." />
        <ComposeEmail coaches={coaches} />
      </div>

      {/* Tip */}
      <GlassPanel tone="gold" className="mb-5 p-4">
        <p className="text-sm font-bold" style={{ color: "var(--gold)" }}>Consejo Ximo</p>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
          Personaliza cada correo con tus tiempos, tu prueba principal y una pregunta concreta. Los coaches responden más
          cuando ven preparación y claridad. Usa las plantillas como punto de partida, nunca al pie de la letra.
        </p>
      </GlassPanel>

      {rows.length === 0 ? (
        <EmptyState
          title="Aún no tienes correos"
          text="Redacta tu primer correo con una de las plantillas listas para coaches. Vincúlalo a un coach para llevar el seguimiento de respuestas y follow-ups."
        />
      ) : (
        <>
          <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(["Enviado", "Respondido", "Follow-up", "Borrador"] as const).map((k) => (
              <div key={k} className="rounded-xl p-3 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)" }}>
                <p className="text-xl font-black" style={{ color: "var(--text)" }}>{counts[k]}</p>
                <p className="mt-0.5 text-[10px] font-bold" style={{ color: "var(--text-label)" }}>{k}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {rows.map((e, i) => (
              <ScrollReveal key={e.id} delay={i * 40}>
                <EmailCard e={e} />
              </ScrollReveal>
            ))}
          </div>
        </>
      )}
    </>
  );
}
