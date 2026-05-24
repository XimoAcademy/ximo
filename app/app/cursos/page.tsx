import PageHeader from "../components/PageHeader";
import { Badge, Card } from "../components/ui";

const courses = [
  {
    title: "Recruiting universitario desde cero",
    desc: "Reglas NCAA, divisiones, calendario y cómo iniciar tu proceso como atleta internacional.",
    status: "disponible pronto",
    lessons: 8,
  },
  {
    title: "Cómo escribirle a coaches",
    desc: "Plantillas, estructura y personalización que genera respuestas reales.",
    status: "disponible pronto",
    lessons: 6,
  },
  {
    title: "SAT / TOEFL para atletas",
    desc: "Equilibra entrenamiento de élite con preparación académica internacional.",
    status: "próximamente",
    lessons: 10,
  },
  {
    title: "Cómo armar tu perfil deportivo",
    desc: "Video, resume atlético y narrativa que destaca ante coaches.",
    status: "próximamente",
    lessons: 7,
  },
  {
    title: "Marca personal para atletas",
    desc: "Redes, contenido y presencia digital para atletas en proceso de recruiting.",
    status: "próximamente",
    lessons: 6,
  },
  {
    title: "Mentalidad y disciplina",
    desc: "Hábitos, enfoque y resiliencia en el camino universitario.",
    status: "próximamente",
    lessons: 5,
  },
];

export default function CursosPage() {
  return (
    <>
      <PageHeader
        title="Cursos"
        subtitle="Aprende el proceso que muchos atletas tienen que descubrir solos."
      />

      <Card className="mb-5 border-[#C9A84C]/20 bg-gradient-to-br from-[#0B1F33] to-[#0A1C2E] p-5 text-white">
        <p className="text-sm leading-relaxed text-white/70">
          Los miembros fundadores tendrán prioridad para acceder a los primeros
          contenidos.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((course) => (
          <Card key={course.title} className="flex flex-col p-4 sm:p-5">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h2 className="text-sm font-black text-[#0B1F33]">
                {course.title}
              </h2>
              <Badge
                className={
                  course.status === "disponible pronto"
                    ? "bg-[#C9A84C]/15 text-[#0B1F33]"
                    : "bg-[#0B1F33]/6 text-[#5E7080]"
                }
              >
                {course.status}
              </Badge>
            </div>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-[#5E7080]">
              {course.desc}
            </p>
            <p className="text-[11px] text-[#5E7080]">
              {course.lessons} lecciones · próximamente
            </p>
            <button
              type="button"
              className="mt-3 text-left text-xs font-semibold text-[#1D4ED8] opacity-60"
              disabled
            >
              Acceso próximamente →
            </button>
          </Card>
        ))}
      </div>
    </>
  );
}
