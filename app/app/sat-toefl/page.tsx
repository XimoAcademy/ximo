import PageHeader from "../components/PageHeader";
import { SectionHeader } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";

const CARD  = { background:"var(--surface)",  border:"1px solid var(--border)" } as const;
const INNER = { background:"var(--surface-hover)", border:"1px solid var(--border-subtle)"  } as const;

const satChecklist  = [
  { item:"Investigar fechas",          done:true  },
  { item:"Crear cuenta College Board", done:true  },
  { item:"Estudiar vocabulario",       done:false },
  { item:"Hacer práctica semanal",     done:false },
  { item:"Agendar examen oficial",     done:false },
];
const toeflChecklist = [
  { item:"Medir nivel inicial",    done:true  },
  { item:"Practicar listening",    done:false },
  { item:"Practicar speaking",     done:false },
  { item:"Agendar examen",         done:false },
  { item:"Enviar resultados",      done:false },
];
const timeline = [
  { period:"Este mes",          items:["Completar 2 practice tests SAT","Benchmark TOEFL con simulacro","Definir fecha objetivo de examen"] },
  { period:"Próximos 3 meses",  items:["SAT oficial — Mayo","Intensificar listening y speaking TOEFL","Compartir scores con coaches activos"] },
  { period:"Antes de aplicar",  items:["TOEFL oficial — Junio","Enviar scores a NCAA Eligibility Center","Confirmar requisitos por universidad"] },
];
const resources = [
  { name:"Khan Academy SAT",      type:"SAT",    desc:"Prep oficial gratuita" },
  { name:"PrepScholar SAT",       type:"SAT",    desc:"Plan personalizado" },
  { name:"Magoosh TOEFL",         type:"TOEFL",  desc:"Lecciones en video" },
  { name:"ETS TOEFL Official",    type:"TOEFL",  desc:"Material oficial" },
  { name:"Cursos Ximo SAT/TOEFL", type:"Ximo",   desc:"Próximamente en Cursos" },
];

function CheckRow({ item, done }: { item:string; done:boolean }) {
  return (
    <li className="flex items-center justify-between rounded-xl px-3 py-2.5" style={INNER}>
      <span className="text-sm" style={{ color:"var(--text-2)" }}>{item}</span>
      <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={
        done
          ? { background:"rgba(5,150,105,0.12)", color:"#6ee7b7" }
          : { background:"rgba(201,168,76,0.12)", color:"var(--gold)" }
      }>
        {done ? "Listo" : "Pendiente"}
      </span>
    </li>
  );
}

export default function SatToeflPage() {
  return (
    <>
      <PageHeader title="SAT / TOEFL" subtitle="Organiza los exámenes que pueden abrirte más puertas académicas y deportivas." />

      {/* Checklists */}
      <ScrollReveal>
      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl p-4 sm:p-5" style={CARD}>
          <SectionHeader title="Checklist SAT" subtitle="Score objetivo: 1350+" />
          <ul className="space-y-2">{satChecklist.map((c) => <CheckRow key={c.item} {...c} />)}</ul>
        </div>
        <div className="rounded-2xl p-4 sm:p-5" style={CARD}>
          <SectionHeader title="Checklist TOEFL" subtitle="Score objetivo: 90+" />
          <ul className="space-y-2">{toeflChecklist.map((c) => <CheckRow key={c.item} {...c} />)}</ul>
        </div>
      </div>
      </ScrollReveal>

      {/* Timeline */}
      <ScrollReveal delay={80}>
      <div className="mb-5 rounded-2xl p-4 sm:p-5" style={CARD}>
        <SectionHeader title="Timeline" subtitle="Plan de preparación" />
        <div className="grid gap-4 sm:grid-cols-3">
          {timeline.map((b) => (
            <div key={b.period} className="rounded-xl p-4" style={INNER}>
              <p className="text-sm font-black" style={{ color:"var(--text)" }}>{b.period}</p>
              <ul className="mt-3 space-y-2">
                {b.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-label)" }}>
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background:"var(--gold)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      </ScrollReveal>

      {/* Resources */}
      <ScrollReveal delay={100}>
      <div className="rounded-2xl p-4 sm:p-5" style={CARD}>
        <SectionHeader title="Recursos" subtitle="Herramientas recomendadas" />
        <div className="grid gap-3 sm:grid-cols-2">
          {resources.map((r) => (
            <div key={r.name} className="rounded-xl px-3 py-2.5" style={INNER}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color:"var(--text)" }}>{r.name}</span>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background:"var(--border-subtle)", color:"var(--text-label)" }}>{r.type}</span>
              </div>
              <p className="mt-1 text-xs" style={{ color:"var(--text-label)" }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
      </ScrollReveal>
    </>
  );
}

