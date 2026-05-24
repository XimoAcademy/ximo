import PageHeader from "../components/PageHeader";
import { Badge, Card, SectionHeader } from "../components/ui";

const satChecklist = [
  { item: "Investigar fechas", done: true },
  { item: "Crear cuenta College Board", done: true },
  { item: "Estudiar vocabulario", done: false },
  { item: "Hacer práctica semanal", done: false },
  { item: "Agendar examen oficial", done: false },
];

const toeflChecklist = [
  { item: "Medir nivel inicial", done: true },
  { item: "Practicar listening", done: false },
  { item: "Practicar speaking", done: false },
  { item: "Agendar examen", done: false },
  { item: "Enviar resultados", done: false },
];

const timeline = [
  {
    period: "Este mes",
    items: [
      "Completar 2 practice tests SAT",
      "Benchmark TOEFL con simulacro",
      "Definir fecha objetivo de examen",
    ],
  },
  {
    period: "Próximos 3 meses",
    items: [
      "SAT oficial — Mayo",
      "Intensificar listening y speaking TOEFL",
      "Compartir scores con coaches activos",
    ],
  },
  {
    period: "Antes de aplicar",
    items: [
      "TOEFL oficial — Junio",
      "Enviar scores a NCAA Eligibility Center",
      "Confirmar requisitos por universidad",
    ],
  },
];

const resources = [
  {
    name: "Khan Academy SAT",
    type: "SAT",
    desc: "Prep oficial gratuita — placeholder",
  },
  {
    name: "PrepScholar SAT",
    type: "SAT",
    desc: "Plan personalizado — placeholder",
  },
  {
    name: "Magoosh TOEFL",
    type: "TOEFL",
    desc: "Lecciones en video — placeholder",
  },
  {
    name: "ETS TOEFL Official",
    type: "TOEFL",
    desc: "Material oficial — placeholder",
  },
  {
    name: "Curso ximo SAT/TOEFL",
    type: "ximo",
    desc: "Próximamente en Academy → Cursos",
  },
];

export default function SatToeflPage() {
  return (
    <>
      <PageHeader
        title="SAT / TOEFL"
        subtitle="Organiza los exámenes que pueden abrirte más puertas académicas y deportivas."
      />

      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-4 sm:p-5">
          <SectionHeader title="Checklist SAT" subtitle="Score objetivo: 1350+" />
          <ul className="space-y-2">
            {satChecklist.map((c) => (
              <li
                key={c.item}
                className="flex items-center justify-between rounded-lg border border-[#0B1F33]/6 px-3 py-2"
              >
                <span className="text-sm text-[#0B1F33]">{c.item}</span>
                <Badge
                  className={
                    c.done
                      ? "bg-emerald-500/12 text-emerald-700"
                      : "bg-[#C9A84C]/15 text-[#0B1F33]"
                  }
                >
                  {c.done ? "Listo" : "Pendiente"}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4 sm:p-5">
          <SectionHeader title="Checklist TOEFL" subtitle="Score objetivo: 90+" />
          <ul className="space-y-2">
            {toeflChecklist.map((c) => (
              <li
                key={c.item}
                className="flex items-center justify-between rounded-lg border border-[#0B1F33]/6 px-3 py-2"
              >
                <span className="text-sm text-[#0B1F33]">{c.item}</span>
                <Badge
                  className={
                    c.done
                      ? "bg-emerald-500/12 text-emerald-700"
                      : "bg-[#C9A84C]/15 text-[#0B1F33]"
                  }
                >
                  {c.done ? "Listo" : "Pendiente"}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mb-5 p-4 sm:p-5">
        <SectionHeader title="Timeline" subtitle="Plan de preparación" />
        <div className="grid gap-4 sm:grid-cols-3">
          {timeline.map((block) => (
            <div
              key={block.period}
              className="rounded-xl border border-[#0B1F33]/6 bg-[#F5F5F0]/50 p-4"
            >
              <p className="text-sm font-black text-[#0B1F33]">{block.period}</p>
              <ul className="mt-3 space-y-2">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-xs text-[#5E7080]"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C9A84C]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 sm:p-5">
        <SectionHeader title="Recursos" subtitle="Herramientas recomendadas" />
        <div className="grid gap-3 sm:grid-cols-2">
          {resources.map((r) => (
            <div
              key={r.name}
              className="rounded-lg bg-[#F5F5F0] px-3 py-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#0B1F33]">
                  {r.name}
                </span>
                <Badge className="bg-[#0B1F33]/6 text-[#5E7080]">
                  {r.type}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-[#5E7080]">{r.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
