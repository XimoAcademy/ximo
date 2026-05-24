import PageHeader from "../components/PageHeader";
import { Badge, Card, SectionHeader } from "../components/ui";

const coaches = [
  {
    name: "Coach Dylan",
    university: "Niagara University",
    email: "dylan.s@niagara.edu",
    status: "Requiere claridad de beca",
    statusColor: "bg-[#C9A84C]/15 text-[#0B1F33]",
    lastInteraction: "Correo inicial · Mar 10 — sin respuesta",
    nextFollowUp: "Mar 25 — follow-up con tiempos y pregunta sobre beca",
    priority: "Alta",
    notes: "Pendiente aclarar beca oficial antes de avanzar.",
  },
  {
    name: "Coach Lucy",
    university: "LIU",
    email: "lucy.m@liu.edu",
    status: "Interés alto",
    statusColor: "bg-emerald-500/12 text-emerald-700",
    lastInteraction: "Respondió · Mar 18 — quiere ver video actualizado",
    nextFollowUp: "Enviar actualizaciones de verano · esta semana",
    priority: "Alta",
    notes: "Buena comunicación. Priorizar envío de marcas recientes.",
  },
  {
    name: "Coach Boyle",
    university: "Towson University",
    email: "boyle.t@towson.edu",
    status: "Interés alto",
    statusColor: "bg-emerald-500/12 text-emerald-700",
    lastInteraction: "Llamada intro · Mar 20 — interés confirmado",
    nextFollowUp: "Seguimiento de llamada · confirmar visita campus",
    priority: "Alta",
    notes: "Visita campus tentativa para abril.",
  },
  {
    name: "Coach Crispino",
    university: "Princeton",
    email: "crispino@princeton.edu",
    status: "Aspiracional",
    statusColor: "bg-amber-500/12 text-amber-700",
    lastInteraction: "Sin contacto directo aún",
    nextFollowUp: "Volver a contactar en otoño con mejores tiempos",
    priority: "Baja",
    notes: "Reach school. Mejorar marcas antes de primer contacto.",
  },
  {
    name: "Coach Adam",
    university: "Le Moyne",
    email: "adam.r@lemoyne.edu",
    status: "Follow-up necesario",
    statusColor: "bg-[#1D4ED8]/12 text-[#1D4ED8]",
    lastInteraction: "Correo enviado · Mar 5 — sin respuesta",
    nextFollowUp: "Abr 1 — segundo follow-up con perfil completo",
    priority: "Media",
    notes: "Opción D2 sólida con buena claridad de beca parcial.",
  },
  {
    name: "Coach Husson",
    university: "Husson University",
    email: "husson.swim@husson.edu",
    status: "Esperando respuesta",
    statusColor: "bg-[#0B1F33]/8 text-[#5E7080]",
    lastInteraction: "Primer correo · Mar 15",
    nextFollowUp: "Mar 30 — follow-up si no responde",
    priority: "Media",
    notes: "D3 con opciones académicas y deportivas balanceadas.",
  },
];

const suggestedMessages = [
  {
    coach: "Coach Dylan · Niagara",
    preview:
      "Estimado Coach Dylan, quería dar seguimiento a mi correo anterior y compartir mis tiempos actualizados de la competencia reciente. También me gustaría entender mejor las opciones de beca disponibles para atletas internacionales...",
  },
  {
    coach: "Coach Lucy · LIU",
    preview:
      "Coach Lucy, gracias por su respuesta. Adjunto mi video actualizado de 50 y 100 libre de la competencia del fin de semana, junto con mi perfil atlético actualizado...",
  },
  {
    coach: "Coach Boyle · Towson",
    preview:
      "Coach Boyle, fue un placer hablar con usted. Confirmo mi disponibilidad para la visita al campus y quería preguntarle qué documentos o información debo preparar antes de la reunión...",
  },
];

export default function CoachesPage() {
  return (
    <>
      <PageHeader
        title="Coaches"
        subtitle="Organiza conversaciones, respuestas, llamadas, follow-ups y próximos mensajes."
      />

      <Card className="mb-5 p-4">
        <SectionHeader
          title="Resumen"
          subtitle="6 coaches en pipeline · 3 con interés alto · 2 esperando respuesta"
        />
      </Card>

      <div className="mb-5 space-y-4">
        {coaches.map((coach) => (
          <Card key={coach.name} className="p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-[#0B1F33]">
                  {coach.name}
                </h2>
                <p className="text-sm text-[#5E7080]">{coach.university}</p>
                <p className="mt-1 text-xs text-[#5E7080]">{coach.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className={coach.statusColor}>{coach.status}</Badge>
                <Badge
                  className={
                    coach.priority === "Alta"
                      ? "bg-[#C9A84C]/15 text-[#0B1F33]"
                      : coach.priority === "Media"
                        ? "bg-[#1D4ED8]/12 text-[#1D4ED8]"
                        : "bg-[#F5F5F0] text-[#5E7080]"
                  }
                >
                  Prioridad {coach.priority.toLowerCase()}
                </Badge>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-[#F5F5F0] p-3">
                <p className="text-[9px] font-bold tracking-wide text-[#5E7080] uppercase">
                  Última interacción
                </p>
                <p className="mt-1 text-sm text-[#0B1F33]">
                  {coach.lastInteraction}
                </p>
              </div>
              <div className="rounded-lg bg-[#F5F5F0] p-3">
                <p className="text-[9px] font-bold tracking-wide text-[#5E7080] uppercase">
                  Próximo follow-up
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1D4ED8]">
                  {coach.nextFollowUp}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#5E7080]">
              {coach.notes}
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-4 sm:p-5">
        <SectionHeader
          title="Próximo mensaje sugerido"
          subtitle="Borradores listos para personalizar y enviar"
        />
        <div className="space-y-3">
          {suggestedMessages.map((msg) => (
            <div
              key={msg.coach}
              className="rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/50 p-4"
            >
              <p className="text-sm font-bold text-[#0B1F33]">{msg.coach}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#5E7080]">
                {msg.preview}
              </p>
              <button
                type="button"
                className="mt-3 text-xs font-semibold text-[#1D4ED8]"
              >
                Usar plantilla →
              </button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
