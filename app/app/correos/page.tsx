import PageHeader from "../components/PageHeader";
import { Badge, Card, SectionHeader } from "../components/ui";

const templates = [
  "Primer contacto con coach",
  "Follow-up después de no respuesta",
  "Actualización de tiempos",
  "Pregunta sobre beca/costo",
  "Agradecimiento después de llamada",
];

const messageStatus = [
  { label: "Enviado", count: 5, color: "bg-[#1D4ED8]/12 text-[#1D4ED8]" },
  { label: "Respondido", count: 4, color: "bg-emerald-500/12 text-emerald-700" },
  { label: "Pendiente", count: 3, color: "bg-[#C9A84C]/15 text-[#0B1F33]" },
  { label: "Follow-up", count: 2, color: "bg-[#0B1F33]/8 text-[#5E7080]" },
];

const emails = [
  {
    to: "LIU — Coach Lucy",
    subject: "Actualización de competencias pendiente",
    status: "Pendiente",
    statusColor: "bg-[#C9A84C]/15 text-[#0B1F33]",
    date: "Por enviar",
    preview:
      "Coach Lucy, comparto mis tiempos de la competencia del fin de semana: 50 libre 26.0s y 100 libre 58.0s. Adjunto video actualizado...",
  },
  {
    to: "Niagara — Coach Dylan",
    subject: "Preguntar beca oficial",
    status: "Follow-up",
    statusColor: "bg-[#0B1F33]/8 text-[#5E7080]",
    date: "Mar 25",
    preview:
      "Estimado Coach Dylan, quería dar seguimiento y preguntarle sobre las opciones de beca para atletas internacionales en su programa...",
  },
  {
    to: "Towson — Coach Boyle",
    subject: "Confirmar llamada",
    status: "Respondido",
    statusColor: "bg-emerald-500/12 text-emerald-700",
    date: "Mar 20",
    preview:
      "Coach Boyle, confirmo mi disponibilidad para la llamada del jueves. ¿Prefiere Zoom o una llamada directa? Gracias por su tiempo...",
  },
  {
    to: "Princeton — Coach Crispino",
    subject: "Volver a contactar en otoño",
    status: "Pendiente",
    statusColor: "bg-[#C9A84C]/15 text-[#0B1F33]",
    date: "Oct 2025",
    preview:
      "Recordatorio: contactar cuando tenga mejores tiempos y GPA más sólido. Princeton es aspiracional — preparar perfil completo...",
  },
];

export default function CorreosPage() {
  return (
    <>
      <PageHeader
        title="Correos"
        subtitle="Centraliza mensajes, templates, follow-ups y respuestas importantes."
      />

      <Card className="mb-5 p-4">
        <SectionHeader title="Estado de mensajes" subtitle="Resumen del pipeline" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {messageStatus.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/70 p-3 text-center"
            >
              <p className="text-xl font-black text-[#0B1F33]">{s.count}</p>
              <Badge className={`mt-1 ${s.color}`}>{s.label}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="mb-5 grid gap-4 lg:grid-cols-[240px_1fr]">
        <Card className="p-4">
          <SectionHeader title="Templates rápidos" subtitle="Listos para usar" />
          <ul className="space-y-2">
            {templates.map((t) => (
              <li
                key={t}
                className="cursor-default rounded-lg border border-[#0B1F33]/6 bg-[#F5F5F0]/60 px-3 py-2 text-sm font-medium text-[#0B1F33]"
              >
                {t}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="border-[#C9A84C]/20 bg-gradient-to-br from-[#0B1F33]/5 to-[#C9A84C]/5 p-4">
          <p className="text-sm font-bold text-[#0B1F33]">
            Tip ximo
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#5E7080]">
            Personaliza cada correo con tiempos reales, eventos principales y
            una pregunta concreta. Los coaches responden más cuando ven
            preparación y claridad.
          </p>
        </Card>
      </div>

      <SectionHeader title="Correos recientes" subtitle="Historial de recruiting" />
      <div className="space-y-3">
        {emails.map((email) => (
          <Card key={email.to} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-[#0B1F33]">{email.to}</p>
                <p className="mt-0.5 text-sm text-[#0D1B2A]">{email.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={email.statusColor}>{email.status}</Badge>
                <span className="text-[11px] text-[#5E7080]">{email.date}</span>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#5E7080]">
              {email.preview}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
