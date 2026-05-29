import PageHeader from "../components/PageHeader";
import { SectionHeader } from "../components/ui";

const CARD = { background:"rgba(17,37,56,0.7)",  border:"1px solid rgba(47,127,134,0.14)" } as const;
const INNER = { background:"rgba(47,127,134,0.06)", border:"1px solid rgba(47,127,134,0.1)"  } as const;

function statusStyle(s: string): { background: string; color: string } {
  if (s.includes("alto") || s.includes("confirmado")) return { background:"rgba(5,150,105,0.12)",    color:"#6ee7b7" };
  if (s.includes("claridad"))                          return { background:"rgba(201,168,76,0.12)",  color:"#C9A84C" };
  if (s.includes("Aspiracional"))                     return { background:"rgba(251,191,36,0.12)",  color:"#fbbf24" };
  if (s.includes("follow") || s.includes("Follow"))   return { background:"rgba(30,206,206,0.12)",  color:"#1ECECE" };
  return { background:"rgba(47,127,134,0.1)", color:"rgba(127,175,178,0.6)" };
}

const coaches = [
  { name:"Coach Dylan",    university:"Niagara University",   email:"dylan.s@niagara.edu",      status:"Requiere claridad de beca",  last:"Correo inicial · Mar 10 — sin respuesta",           next:"Mar 25 — follow-up con tiempos y pregunta sobre beca", priority:"Alta",  notes:"Pendiente aclarar beca oficial antes de avanzar." },
  { name:"Coach Lucy",     university:"LIU",                  email:"lucy.m@liu.edu",            status:"Interés alto",               last:"Respondió · Mar 18 — quiere ver video actualizado",  next:"Enviar actualizaciones de verano · esta semana",       priority:"Alta",  notes:"Buena comunicación. Priorizar envío de marcas recientes." },
  { name:"Coach Boyle",    university:"Towson University",    email:"boyle.t@towson.edu",        status:"Interés confirmado",         last:"Llamada intro · Mar 20 — interés confirmado",        next:"Seguimiento de llamada · confirmar visita campus",     priority:"Alta",  notes:"Visita campus tentativa para abril." },
  { name:"Coach Crispino", university:"Princeton",            email:"crispino@princeton.edu",    status:"Aspiracional",               last:"Sin contacto directo aún",                            next:"Volver a contactar en otoño con mejores tiempos",     priority:"Baja",  notes:"Reach school. Mejorar marcas antes de primer contacto." },
  { name:"Coach Adam",     university:"Le Moyne",             email:"adam.r@lemoyne.edu",        status:"Follow-up necesario",        last:"Correo enviado · Mar 5 — sin respuesta",             next:"Abr 1 — segundo follow-up con perfil completo",        priority:"Media", notes:"Opción D2 sólida con buena claridad de beca parcial." },
  { name:"Coach Husson",   university:"Husson University",    email:"husson.swim@husson.edu",    status:"Esperando respuesta",        last:"Primer correo · Mar 15",                              next:"Mar 30 — follow-up si no responde",                    priority:"Media", notes:"D3 con opciones académicas y deportivas balanceadas." },
];

const messages = [
  { coach:"Coach Dylan · Niagara",   preview:"Estimado Coach Dylan, quería dar seguimiento a mi correo anterior y compartir mis tiempos actualizados. También me gustaría entender las opciones de beca disponibles para atletas internacionales…" },
  { coach:"Coach Lucy · LIU",        preview:"Coach Lucy, gracias por su respuesta. Adjunto mi video actualizado de 50 y 100 libre, junto con mi perfil atlético actualizado…" },
  { coach:"Coach Boyle · Towson",    preview:"Coach Boyle, fue un placer hablar con usted. Confirmo mi disponibilidad para la visita al campus y quería preguntar qué documentos debo preparar…" },
];

function PriorityBadge({ p }: { p: string }) {
  const s = p === "Alta"
    ? { background:"rgba(201,168,76,0.15)", color:"#C9A84C" }
    : p === "Media"
    ? { background:"rgba(30,206,206,0.12)",  color:"#1ECECE" }
    : { background:"rgba(47,127,134,0.1)",   color:"rgba(127,175,178,0.5)" };
  return <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={s}>Prioridad {p.toLowerCase()}</span>;
}

export default function CoachesPage() {
  return (
    <>
      <PageHeader
        title="Coaches"
        subtitle="Organiza conversaciones, respuestas, llamadas, follow-ups y próximos mensajes."
      />

      {/* Summary */}
      <div className="mb-5 rounded-2xl p-4" style={CARD}>
        <p className="text-sm font-bold" style={{ color:"#F5F5F0" }}>Resumen</p>
        <p className="mt-0.5 text-xs" style={{ color:"rgba(127,175,178,0.5)" }}>
          6 coaches en pipeline · 3 con interés alto · 2 esperando respuesta
        </p>
      </div>

      {/* Coach cards */}
      <div className="mb-5 space-y-3">
        {coaches.map((c) => {
          const ss = statusStyle(c.status);
          return (
            <div key={c.name} className="rounded-2xl p-4 sm:p-5 ximo-card-3d" style={CARD}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-black" style={{ color:"#F5F5F0" }}>{c.name}</h2>
                  <p className="text-sm" style={{ color:"rgba(127,175,178,0.5)" }}>{c.university}</p>
                  <p className="mt-0.5 text-xs" style={{ color:"rgba(127,175,178,0.35)" }}>{c.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={ss}>{c.status}</span>
                  <PriorityBadge p={c.priority} />
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl p-3" style={INNER}>
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color:"rgba(127,175,178,0.45)" }}>Última interacción</p>
                  <p className="mt-1 text-sm" style={{ color:"rgba(245,245,240,0.7)" }}>{c.last}</p>
                </div>
                <div className="rounded-xl p-3" style={INNER}>
                  <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color:"rgba(127,175,178,0.45)" }}>Próximo follow-up</p>
                  <p className="mt-1 text-sm font-semibold" style={{ color:"#1ECECE" }}>{c.next}</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed" style={{ color:"rgba(127,175,178,0.45)" }}>{c.notes}</p>
            </div>
          );
        })}
      </div>

      {/* Suggested messages */}
      <div className="rounded-2xl p-4 sm:p-5" style={CARD}>
        <SectionHeader title="Próximo mensaje sugerido" subtitle="Borradores listos para personalizar y enviar" />
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.coach} className="rounded-xl p-4" style={INNER}>
              <p className="text-sm font-bold" style={{ color:"#F5F5F0" }}>{m.coach}</p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color:"rgba(245,245,240,0.5)" }}>{m.preview}</p>
              <button type="button" className="mt-3 text-xs font-semibold transition-opacity hover:opacity-70" style={{ color:"#1ECECE" }}>
                Usar plantilla →
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
