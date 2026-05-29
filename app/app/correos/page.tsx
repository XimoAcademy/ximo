import PageHeader from "../components/PageHeader";
import { SectionHeader } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";

const CARD  = { background:"var(--surface)",  border:"1px solid var(--border)" } as const;
const INNER = { background:"var(--surface-hover)", border:"1px solid var(--border-subtle)"  } as const;

const templates = [
  "Primer contacto con coach",
  "Follow-up después de no respuesta",
  "Actualización de tiempos",
  "Pregunta sobre beca/costo",
  "Agradecimiento después de llamada",
];

const messageStatus = [
  { label:"Enviado",    count:5, bg:"rgba(30,206,206,0.12)",  tc:"var(--teal)"  },
  { label:"Respondido", count:4, bg:"rgba(5,150,105,0.12)",   tc:"#6ee7b7"  },
  { label:"Pendiente",  count:3, bg:"rgba(201,168,76,0.12)",  tc:"var(--gold)"  },
  { label:"Follow-up",  count:2, bg:"var(--border-subtle)",   tc:"var(--text-label)" },
];

const emails = [
  { to:"LIU — Coach Lucy",          subject:"Actualización de competencias",   status:"Pendiente",  sb:"rgba(201,168,76,0.12)",  st:"var(--gold)", date:"Por enviar", preview:"Coach Lucy, comparto mis tiempos recientes: 50 libre 26.0s y 100 libre 58.0s. Adjunto video actualizado…" },
  { to:"Niagara — Coach Dylan",      subject:"Preguntar beca oficial",          status:"Follow-up",  sb:"var(--border-subtle)",   st:"var(--text-label)", date:"Mar 25", preview:"Estimado Coach Dylan, quería dar seguimiento y preguntar sobre las opciones de beca para atletas internacionales…" },
  { to:"Towson — Coach Boyle",       subject:"Confirmar llamada",               status:"Respondido", sb:"rgba(5,150,105,0.12)",   st:"#6ee7b7", date:"Mar 20", preview:"Coach Boyle, confirmo mi disponibilidad para la llamada del jueves. ¿Prefiere Zoom o llamada directa?" },
  { to:"Princeton — Coach Crispino", subject:"Volver a contactar en otoño",     status:"Pendiente",  sb:"rgba(201,168,76,0.12)",  st:"var(--gold)", date:"Oct 2025", preview:"Recordatorio: contactar cuando tenga mejores tiempos y GPA más sólido. Princeton es aspiracional…" },
];

export default function CorreosPage() {
  return (
    <>
      <PageHeader title="Correos" subtitle="Centraliza mensajes, templates, follow-ups y respuestas importantes." />

      {/* Status summary */}
      <div className="mb-5 rounded-2xl p-4" style={CARD}>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color:"var(--text-label)" }}>Estado de mensajes</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {messageStatus.map((s) => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: s.bg, border:"1px solid var(--border-subtle)" }}>
              <p className="text-xl font-black" style={{ color:"var(--text)" }}>{s.count}</p>
              <p className="mt-0.5 text-[10px] font-bold" style={{ color: s.tc }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-[240px_1fr]">
        {/* Templates */}
        <div className="rounded-2xl p-4" style={CARD}>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color:"var(--text-label)" }}>Templates rápidos</p>
          <ul className="space-y-1.5">
            {templates.map((t) => (
              <li key={t} className="cursor-default rounded-xl px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80" style={{ ...INNER, color:"var(--text-2)" }}>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Tip */}
        <div className="rounded-2xl p-4" style={{ background:"rgba(201,168,76,0.06)", border:"1px solid rgba(201,168,76,0.18)" }}>
          <p className="text-sm font-bold" style={{ color:"var(--gold)" }}>Consejo Ximo</p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color:"var(--text-2)" }}>
            Personaliza cada correo con tus tiempos, eventos principales y una pregunta concreta.
            Los coaches responden más cuando ven preparación y claridad.
          </p>
        </div>
      </div>

      <SectionHeader title="Correos recientes" subtitle="Historial de recruiting" />
      <div className="space-y-3">
        {emails.map((e, i) => (
          <ScrollReveal key={e.to} delay={i * 50}>
          <div className="rounded-2xl p-4 ximo-card-3d" style={CARD}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{e.to}</p>
                <p className="mt-0.5 text-sm" style={{ color:"var(--text-2)" }}>{e.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background:e.sb, color:e.st }}>{e.status}</span>
                <span className="text-[11px]" style={{ color:"var(--text-label)" }}>{e.date}</span>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color:"var(--text-3)" }}>{e.preview}</p>
          </div>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}

