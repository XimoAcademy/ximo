import PageHeader from "../components/PageHeader";
import { SectionHeader } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";

const CARD  = { background:"rgba(17,37,56,0.7)",  border:"1px solid rgba(47,127,134,0.14)" } as const;
const INNER = { background:"rgba(47,127,134,0.06)", border:"1px solid rgba(47,127,134,0.1)"  } as const;

const templates = [
  "Primer contacto con coach",
  "Follow-up despuÃ©s de no respuesta",
  "ActualizaciÃ³n de tiempos",
  "Pregunta sobre beca/costo",
  "Agradecimiento despuÃ©s de llamada",
];

const messageStatus = [
  { label:"Enviado",    count:5, bg:"rgba(30,206,206,0.12)",  tc:"#1ECECE"  },
  { label:"Respondido", count:4, bg:"rgba(5,150,105,0.12)",   tc:"#6ee7b7"  },
  { label:"Pendiente",  count:3, bg:"rgba(201,168,76,0.12)",  tc:"#C9A84C"  },
  { label:"Follow-up",  count:2, bg:"rgba(47,127,134,0.1)",   tc:"rgba(127,175,178,0.6)" },
];

const emails = [
  { to:"LIU â€” Coach Lucy",          subject:"ActualizaciÃ³n de competencias",   status:"Pendiente",  sb:"rgba(201,168,76,0.12)",  st:"#C9A84C", date:"Por enviar", preview:"Coach Lucy, comparto mis tiempos recientes: 50 libre 26.0s y 100 libre 58.0s. Adjunto video actualizadoâ€¦" },
  { to:"Niagara â€” Coach Dylan",      subject:"Preguntar beca oficial",          status:"Follow-up",  sb:"rgba(47,127,134,0.1)",   st:"rgba(127,175,178,0.6)", date:"Mar 25", preview:"Estimado Coach Dylan, querÃ­a dar seguimiento y preguntar sobre las opciones de beca para atletas internacionalesâ€¦" },
  { to:"Towson â€” Coach Boyle",       subject:"Confirmar llamada",               status:"Respondido", sb:"rgba(5,150,105,0.12)",   st:"#6ee7b7", date:"Mar 20", preview:"Coach Boyle, confirmo mi disponibilidad para la llamada del jueves. Â¿Prefiere Zoom o llamada directa?" },
  { to:"Princeton â€” Coach Crispino", subject:"Volver a contactar en otoÃ±o",     status:"Pendiente",  sb:"rgba(201,168,76,0.12)",  st:"#C9A84C", date:"Oct 2025", preview:"Recordatorio: contactar cuando tenga mejores tiempos y GPA mÃ¡s sÃ³lido. Princeton es aspiracionalâ€¦" },
];

export default function CorreosPage() {
  return (
    <>
      <PageHeader title="Correos" subtitle="Centraliza mensajes, templates, follow-ups y respuestas importantes." />

      {/* Status summary */}
      <div className="mb-5 rounded-2xl p-4" style={CARD}>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color:"rgba(127,175,178,0.5)" }}>Estado de mensajes</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {messageStatus.map((s) => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: s.bg, border:"1px solid rgba(47,127,134,0.1)" }}>
              <p className="text-xl font-black" style={{ color:"#F5F5F0" }}>{s.count}</p>
              <p className="mt-0.5 text-[10px] font-bold" style={{ color: s.tc }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-[240px_1fr]">
        {/* Templates */}
        <div className="rounded-2xl p-4" style={CARD}>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color:"rgba(127,175,178,0.5)" }}>Templates rÃ¡pidos</p>
          <ul className="space-y-1.5">
            {templates.map((t) => (
              <li key={t} className="cursor-default rounded-xl px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80" style={{ ...INNER, color:"rgba(245,245,240,0.7)" }}>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Tip */}
        <div className="rounded-2xl p-4" style={{ background:"rgba(201,168,76,0.06)", border:"1px solid rgba(201,168,76,0.18)" }}>
          <p className="text-sm font-bold" style={{ color:"#C9A84C" }}>Consejo Ximo</p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color:"rgba(245,245,240,0.5)" }}>
            Personaliza cada correo con tiempos reales, eventos principales y una pregunta concreta.
            Los coaches responden mÃ¡s cuando ven preparaciÃ³n y claridad.
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
                <p className="text-sm font-bold" style={{ color:"#F5F5F0" }}>{e.to}</p>
                <p className="mt-0.5 text-sm" style={{ color:"rgba(245,245,240,0.55)" }}>{e.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background:e.sb, color:e.st }}>{e.status}</span>
                <span className="text-[11px]" style={{ color:"rgba(127,175,178,0.4)" }}>{e.date}</span>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color:"rgba(245,245,240,0.42)" }}>{e.preview}</p>
          </div>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}

