import Link from "next/link";
import ScrollReveal from "./components/ScrollReveal";

/**
 * WAITLIST (pre-lanzamiento). Página pública para registrarse y recibir el
 * aviso cuando Ximo abra al público. Intencionalmente NO enlaza a la app
 * (login/registro/precios viven aparte y sin promocionarse hasta el
 * lanzamiento). La landing de lanzamiento está lista en app/_launch/page.tsx.
 */
export default function Home() {
  const year = new Date().getFullYear();
  return (
    <main className="min-h-screen bg-[#F5F5F0] text-[#0B1F33]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
        <ScrollReveal className="flex flex-col items-center">
          <div className="mb-6 rounded-2xl border border-[#C9A84C]/30 bg-white/70 px-5 py-2 text-sm font-semibold tracking-[0.25em] text-[#C9A84C]">
            ximo Academy
          </div>

          <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            Convierte tu camino deportivo en una oportunidad real.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5E7080]">
            ximo ayuda a atletas mexicanos a organizar universidades, coaches,
            becas, correos, documentos, progreso deportivo y próximos pasos en un
            solo lugar.
          </p>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5E7080]">
            Para quienes sueñan con llevar su deporte más lejos, competir en otro
            nivel y abrir puertas que antes parecían imposibles.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#waitlist"
              className="rounded-xl bg-[#0B1F33] px-8 py-4 text-sm font-bold text-white shadow-lg"
            >
              Unirme a la primera generación
            </a>

            <Link
              href="/build-log"
              className="rounded-xl border border-[#0B1F33]/10 bg-white px-8 py-4 text-sm font-bold text-[#0B1F33]"
            >
              Ver cómo nace ximo
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid w-full gap-4 md:grid-cols-3">
          {[
            {
              t: "Tu proceso en orden",
              d: "Organiza universidades, coaches, respuestas, llamadas, documentos y próximos pasos sin perder oportunidades importantes.",
            },
            {
              t: "Creado desde una historia real",
              d: "ximo nace del camino de un nadador mexicano buscando oportunidades universitarias, becas y crecimiento deportivo fuera de México.",
            },
            {
              t: "Una comunidad con visión",
              d: "Sigue el proceso, aprende del camino y forma parte de una nueva generación de atletas que quiere vivir su deporte de otra manera.",
            },
          ].map((c, i) => (
            <ScrollReveal key={c.t} delay={i * 90} className="h-full">
              <div className="h-full rounded-2xl border border-black/5 bg-white p-6 text-left shadow-sm">
                <h3 className="font-bold">{c.t}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5E7080]">{c.d}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section id="waitlist" className="bg-[#0B1F33] px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold tracking-[0.25em] text-[#C9A84C]">
                ACCESO TEMPRANO
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                Únete a la primera generación de atletas ximo.
              </h2>

              <p className="mt-5 text-lg leading-8 text-white/65">
                Ximo nace para atletas mexicanos que quieren llevar su deporte más lejos.
                Una plataforma para organizar universidades, coaches, becas, correos,
                documentos, progreso deportivo y oportunidades reales en un solo lugar.
              </p>

              <p className="mt-4 text-base leading-7 text-white/55">
                Regístrate y te avisaremos en cuanto Ximo abra sus puertas.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80} className="mt-12">
            <div className="overflow-hidden rounded-3xl border border-[#C9A84C]/20 bg-[#F5F5F0] p-2 shadow-2xl">
              <iframe
                src="https://tally.so/embed/NpbZyO?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                width="100%"
                height="900"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Lista de espera ximo"
                className="rounded-2xl bg-[#F5F5F0]"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer mínimo: solo lo legalmente necesario, sin enlaces a la app. */}
      <footer className="border-t border-black/5 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
          <p className="text-xs text-[#5E7080]">© {year} Ximo · Hecho en México 🇲🇽</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-[#5E7080]">
            <Link href="/terminos" className="transition-colors hover:text-[#0B1F33]">Términos y Condiciones</Link>
            <Link href="/privacidad" className="transition-colors hover:text-[#0B1F33]">Aviso de Privacidad</Link>
            <a href="mailto:ximoacademy@gmail.com" className="transition-colors hover:text-[#0B1F33]">ximoacademy@gmail.com</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
