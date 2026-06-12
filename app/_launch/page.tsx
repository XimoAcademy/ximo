/**
 * LANDING DE LANZAMIENTO — NO RUTEADA (carpeta privada _launch).
 * Esta es la página principal para el día del lanzamiento público:
 * header con login/registro, precios en vivo desde Stripe, FAQ y footer legal.
 * Para activarla: mover este archivo a app/page.tsx (reemplazando la waitlist).
 */
import Link from "next/link";
import ScrollReveal from "../components/ScrollReveal";
import { isStripeConfigured, isAnnualConfigured, getDisplayPrices } from "@/lib/stripe/server";

const CONTACT_EMAIL = "ximoacademy@gmail.com";

const features = [
  {
    title: "Tu proceso en orden",
    desc: "Organiza universidades, coaches, respuestas, llamadas, documentos y próximos pasos sin perder oportunidades importantes.",
  },
  {
    title: "Recruiting pipeline real",
    desc: "Etapas claras por universidad y coach: primer contacto, seguimiento, llamadas y ofertas. Sabes siempre cuál es el siguiente paso.",
  },
  {
    title: "Progreso deportivo",
    desc: "Registra tus tiempos y marcas, visualiza tu mejora por estilo y comparte resultados cuando un coach los pida.",
  },
  {
    title: "Directorio NCAA",
    desc: "Explora programas y coaches de natación NCAA con datos para encontrar el nivel y la beca que se ajustan a ti.",
  },
  {
    title: "Cursos y SAT/TOEFL",
    desc: "Aprende el proceso paso a paso y organiza tus exámenes académicos con checklists y recursos seleccionados.",
  },
  {
    title: "Comunidad con visión",
    desc: "Comparte avances y dudas con atletas que van al mismo lugar que tú. Contenido moderado, sin ruido.",
  },
];

const faqs = [
  {
    q: "¿Para quién es Ximo?",
    a: "Para atletas mexicanos (por ahora, nadadores) que quieren competir en universidades de Estados Unidos y necesitan organizar su proceso de recruiting: universidades, coaches, correos, documentos, exámenes y tiempos.",
  },
  {
    q: "¿Ximo me garantiza una beca?",
    a: "No. Ximo es una herramienta de organización y educación: te da estructura, datos y comunidad. El resultado depende de tu nivel deportivo, académico y de tu constancia.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Ximo funciona con una suscripción (mensual o anual) que desbloquea toda la plataforma. El precio exacto y la moneda se muestran antes de pagar. Puedes cancelar cuando quieras y conservas el acceso hasta el final del periodo pagado.",
  },
  {
    q: "¿Qué pasa si soy menor de edad?",
    a: "Necesitas el consentimiento de tu padre, madre o tutor para crear una cuenta y contratar la suscripción. Ellos pueden ejercer en tu nombre los derechos sobre tus datos.",
  },
  {
    q: "¿Cómo protegen mis datos?",
    a: "Tus datos se tratan conforme a la ley mexicana de protección de datos (LFPDPPP). Puedes exportarlos o eliminar tu cuenta en cualquier momento desde Configuración. Lee el Aviso de Privacidad para el detalle completo.",
  },
];

export default async function Home() {
  const stripeOn = isStripeConfigured();
  const annualOn = isAnnualConfigured();
  const prices = stripeOn ? await getDisplayPrices() : {};
  const year = new Date().getFullYear();

  // Months free on the annual plan (one decimal, e.g. "1.5 meses gratis").
  const monthsFree =
    prices.monthly && prices.annual && prices.monthly.currency === prices.annual.currency
      ? Math.max(0, Math.round((12 - prices.annual.amount / prices.monthly.amount) * 10) / 10)
      : null;
  const annualBadge =
    monthsFree && monthsFree > 0
      ? `${monthsFree} ${monthsFree === 1 ? "mes gratis" : "meses gratis"}`
      : "Mejor precio";

  return (
    <main className="min-h-screen bg-[#F5F5F0] text-[#0B1F33]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#F5F5F0]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-black tracking-tight">
            ximo <span className="text-[#C9A84C]">Academy</span>
          </Link>
          <nav className="flex items-center gap-3 text-sm font-bold">
            <a href="#features" className="hidden px-3 py-2 text-[#5E7080] transition-colors hover:text-[#0B1F33] sm:block">Qué incluye</a>
            <a href="#pricing" className="hidden px-3 py-2 text-[#5E7080] transition-colors hover:text-[#0B1F33] sm:block">Precio</a>
            <a href="#faq" className="hidden px-3 py-2 text-[#5E7080] transition-colors hover:text-[#0B1F33] sm:block">Preguntas</a>
            <Link href="/login" className="rounded-xl border border-[#0B1F33]/10 bg-white px-4 py-2 transition-colors hover:border-[#0B1F33]/25">
              Iniciar sesión
            </Link>
            <Link href="/register" className="rounded-xl bg-[#0B1F33] px-4 py-2 text-white shadow-lg transition-opacity hover:opacity-90">
              Crear cuenta
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-20 pt-24 text-center">
        <ScrollReveal className="flex flex-col items-center">
        <div className="mb-6 rounded-2xl border border-[#C9A84C]/30 bg-white/70 px-5 py-2 text-sm font-semibold tracking-[0.25em] text-[#C9A84C]">
          MÉXICO PRIMERO
        </div>

        <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
          Convierte tu camino deportivo en una oportunidad real.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5E7080]">
          ximo ayuda a atletas mexicanos a organizar universidades, coaches,
          becas, correos, documentos, progreso deportivo y próximos pasos en un
          solo lugar.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-xl bg-[#0B1F33] px-8 py-4 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90"
          >
            Empezar ahora →
          </Link>
          <a
            href="#pricing"
            className="rounded-xl border border-[#0B1F33]/10 bg-white px-8 py-4 text-sm font-bold text-[#0B1F33] transition-colors hover:border-[#0B1F33]/25"
          >
            Ver precio
          </a>
        </div>

        <p className="mt-5 text-xs text-[#5E7080]">
          Pago seguro con Stripe · Cancela cuando quieras
        </p>
        </ScrollReveal>
      </section>

      {/* ── Features ── */}
      <section id="features" className="mx-auto max-w-6xl px-6 pb-24">
        <ScrollReveal>
          <h2 className="text-center text-3xl font-black tracking-tight md:text-4xl">
            Todo tu recruiting, en un solo lugar.
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid w-full gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={(i % 3) * 90} className="h-full">
              <div className="h-full rounded-2xl border border-black/5 bg-white p-6 text-left shadow-sm">
                <h3 className="font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5E7080]">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-12" delay={80}>
        <div className="rounded-2xl border border-[#C9A84C]/25 bg-white p-8 text-center shadow-sm">
          <h3 className="text-xl font-black">Creado desde una historia real</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#5E7080]">
            ximo nace del camino de un nadador mexicano buscando oportunidades
            universitarias, becas y crecimiento deportivo fuera de México.{" "}
            <Link href="/build-log" className="font-bold text-[#0B1F33] underline underline-offset-2">
              Conoce cómo nace ximo →
            </Link>
          </p>
        </div>
        </ScrollReveal>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-[#0B1F33] px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold tracking-[0.25em] text-[#C9A84C]">PRECIO</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                Una suscripción. Toda la plataforma.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/65">
                Sin plan gratuito y sin funciones a medias: la suscripción desbloquea
                recruiting, comunidad, cursos, progreso y todo lo demás.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100} className={`mx-auto mt-12 grid max-w-3xl gap-6 ${annualOn ? "md:grid-cols-2" : "max-w-md"}`}>
            {/* Monthly */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">Plan mensual</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-black">{prices.monthly?.label ?? "$49 USD"}</span>
                <span className="text-sm text-white/55">/ mes</span>
              </div>
              <p className="mt-2 text-xs text-white/55">Facturado mensualmente · Cancela cuando quieras</p>
              <Link
                href="/register"
                className="mt-6 block rounded-xl bg-white px-6 py-3 text-center text-sm font-bold text-[#0B1F33] transition-opacity hover:opacity-90"
              >
                Crear cuenta
              </Link>
            </div>

            {/* Annual */}
            {annualOn && (
              <div className="relative rounded-3xl border border-[#C9A84C]/40 bg-[#C9A84C]/10 p-8 text-left">
                <span className="absolute -top-3 right-6 rounded-full bg-[#C9A84C] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#0B1F33]">
                  {annualBadge}
                </span>
                <p className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">Plan anual</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-black">{prices.annual?.label ?? "Plan anual"}</span>
                  {prices.annual && <span className="text-sm text-white/55">/ año</span>}
                </div>
                <p className="mt-2 text-xs text-white/55">Facturado anualmente · Cancela cuando quieras</p>
                <Link
                  href="/register"
                  className="mt-6 block rounded-xl bg-[#C9A84C] px-6 py-3 text-center text-sm font-bold text-[#0B1F33] transition-opacity hover:opacity-90"
                >
                  Crear cuenta
                </Link>
              </div>
            )}
          </ScrollReveal>

          <p className="mt-8 text-center text-xs text-white/45">
            La suscripción se renueva automáticamente. Puedes cancelarla en cualquier momento desde
            Facturación y conservas el acceso hasta el final del periodo pagado.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
        <ScrollReveal>
          <h2 className="text-center text-3xl font-black tracking-tight md:text-4xl">Preguntas frecuentes</h2>
        </ScrollReveal>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <ScrollReveal key={f.q} delay={i * 60}>
            <details className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer list-none font-bold marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span className="shrink-0 text-[#C9A84C] transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-[#5E7080]">{f.a}</p>
            </details>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-14" delay={80}>
        <div className="rounded-3xl bg-[#0B1F33] p-10 text-center text-white">
          <h3 className="text-2xl font-black md:text-3xl">Tu camino empieza hoy.</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/65">
            Únete a la generación de atletas mexicanos que organiza su proceso
            y convierte la disciplina en oportunidades reales.
          </p>
          <Link
            href="/register"
            className="mt-7 inline-block rounded-xl bg-[#C9A84C] px-8 py-4 text-sm font-bold text-[#0B1F33] transition-opacity hover:opacity-90"
          >
            Crear mi cuenta →
          </Link>
        </div>
        </ScrollReveal>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-black/5 bg-white px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <p className="text-lg font-black">ximo <span className="text-[#C9A84C]">Academy</span></p>
            <p className="mt-1 text-xs text-[#5E7080]">© {year} Ximo · Hecho en México 🇲🇽</p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-[#5E7080]">
            <Link href="/terminos" className="transition-colors hover:text-[#0B1F33]">Términos y Condiciones</Link>
            <Link href="/privacidad" className="transition-colors hover:text-[#0B1F33]">Aviso de Privacidad</Link>
            <Link href="/build-log" className="transition-colors hover:text-[#0B1F33]">Cómo nace ximo</Link>
            <Link href="/login" className="transition-colors hover:text-[#0B1F33]">Iniciar sesión</Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-[#0B1F33]">{CONTACT_EMAIL}</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
