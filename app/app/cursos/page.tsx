import PageHeader from "../components/PageHeader";

const CARD  = { background:"rgba(17,37,56,0.7)",  border:"1px solid rgba(47,127,134,0.14)" } as const;

const courses = [
  { title:"Recruiting universitario desde cero",   desc:"Reglas NCAA, divisiones, calendario y cómo iniciar tu proceso como atleta internacional.",     status:"disponible pronto", lessons:8 },
  { title:"Cómo escribirle a coaches",             desc:"Plantillas, estructura y personalización que genera respuestas reales.",                         status:"disponible pronto", lessons:6 },
  { title:"SAT / TOEFL para atletas",              desc:"Equilibra entrenamiento de élite con preparación académica internacional.",                      status:"próximamente",      lessons:10 },
  { title:"Cómo armar tu perfil deportivo",        desc:"Video, resume atlético y narrativa que destaca ante coaches.",                                   status:"próximamente",      lessons:7 },
  { title:"Marca personal para atletas",           desc:"Redes, contenido y presencia digital para atletas en proceso de recruiting.",                    status:"próximamente",      lessons:6 },
  { title:"Mentalidad y disciplina",               desc:"Hábitos, enfoque y resiliencia en el camino universitario.",                                     status:"próximamente",      lessons:5 },
];

export default function CursosPage() {
  return (
    <>
      <PageHeader title="Cursos" subtitle="Aprende el proceso que muchos atletas tienen que descubrir solos." />

      {/* Promo banner */}
      <div className="mb-5 rounded-2xl p-5" style={{ ...CARD, background:"linear-gradient(135deg, rgba(201,168,76,0.1), rgba(47,127,134,0.08))", border:"1px solid rgba(201,168,76,0.2)" }}>
        <p className="text-sm font-bold" style={{ color:"#C9A84C" }}>Acceso anticipado</p>
        <p className="mt-1 text-sm leading-relaxed" style={{ color:"rgba(245,245,240,0.5)" }}>
          Los suscriptores activos tendrán prioridad para acceder a los primeros contenidos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((c) => (
          <div key={c.title} className="flex flex-col rounded-2xl p-4 sm:p-5 ximo-card-3d" style={CARD}>
            <div className="mb-2 flex items-start justify-between gap-2">
              <h2 className="text-sm font-black" style={{ color:"#F5F5F0" }}>{c.title}</h2>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0" style={
                c.status === "disponible pronto"
                  ? { background:"rgba(201,168,76,0.12)", color:"#C9A84C" }
                  : { background:"rgba(47,127,134,0.1)", color:"rgba(127,175,178,0.5)" }
              }>
                {c.status}
              </span>
            </div>
            <p className="mb-4 flex-1 text-sm leading-relaxed" style={{ color:"rgba(245,245,240,0.45)" }}>{c.desc}</p>
            <p className="text-[11px]" style={{ color:"rgba(127,175,178,0.35)" }}>{c.lessons} lecciones</p>
            <button type="button" className="mt-3 text-left text-xs font-semibold opacity-50 cursor-not-allowed" style={{ color:"#1ECECE" }} disabled>
              Acceso próximamente →
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
