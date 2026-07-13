import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import ScrollReveal from "./components/ScrollReveal";
import JourneyBackground from "./components/journey/JourneyBackground";
import { resolveAccess } from "@/lib/subscription/requireSubscription";

export const metadata: Metadata = {
  title: "Ximo — Live the Dream",
  description:
    "El camino del atleta mexicano hacia el college deportivo, en un solo lugar. Únete a la lista y entra hoy a la versión demo de Ximo.",
};

/**
 * WAITLIST + scroll journey ("viaje por mundos"). The fixed 3D crystal snake
 * (JourneyBackground) descends behind transparent story sections.
 *
 * Persuasion is applied ethically — real benefits framed aspirationally, drawing
 * on: Self-Determination Theory (Deci & Ryan, 2000 — autonomy/competence/
 * relatedness), narrative transportation (Green & Brock, 2000), future
 * self-continuity (Hershfield, 2011), loss aversion (Kahneman & Tversky, 1979),
 * and Cialdini (1984 — commitment/consistency, social proof, scarcity).
 */

const panel =
  "rounded-3xl border border-white/10 bg-[rgba(8,11,22,0.55)] px-7 py-10 backdrop-blur-md shadow-2xl sm:px-11 sm:py-12";

export default async function Home() {
  // Root-route behavior (requirement #3): a Google visitor with a valid session
  // should land where they belong, server-side, before the landing renders.
  //  - active subscriber        → straight to the dashboard (/app)
  //  - inactive (definitively)  → subscription page, still signed in
  //  - transient lookup failure → recoverable status screen (never sign out,
  //                               never wrongly grant access)
  //  - no valid session         → public landing (below)
  const access = await resolveAccess();
  if (access === "active") redirect("/app");
  if (access === "inactive") redirect("/subscribe");
  if (access === "error") redirect("/account-status");

  const year = new Date().getFullYear();
  return (
    <main className="relative text-white">
      <JourneyBackground />

      {/* ── Brand banner · intro splash (the Ximo wordmark) ── */}
      {/* The gradient is masked to fade out toward the bottom, so the banner
          diffuses into the live forest scene behind it instead of cutting hard. */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(135deg,#2FB8CA 0%,#7FCE7C 50%,#ECD24E 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 46%, transparent 90%)",
            maskImage: "linear-gradient(to bottom, #000 0%, #000 46%, transparent 90%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="font-display font-black leading-none text-white drop-shadow-[0_6px_40px_rgba(0,0,0,0.22)] text-[5.5rem] sm:text-8xl md:text-[11rem]">
            Ximo
          </h1>
          <p className="mt-3 font-display text-xl font-bold tracking-[0.18em] text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)] md:text-3xl">
            -Live the Dream-
          </p>
          <a
            href="#world-2"
            className="mt-12 animate-pulse text-xs font-semibold uppercase tracking-[0.3em] text-white/80"
          >
            ↓ Entra al viaje ↓
          </a>
        </div>
      </section>

      {/* ── World 2 · The problem (agitation + loss aversion) ── */}
      <section id="world-2" className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <ScrollReveal className="w-full max-w-2xl">
          <div className={panel}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">El problema</p>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">El camino al alto nivel se volvió demasiado caro y confuso.</h2>
            <p className="mt-6 text-base leading-8 text-white/70">
              Muchos atletas pierden oportunidades no porque les falte talento,
              sino porque nadie les explica qué pasos seguir, a quién escribirle,
              cómo presentarse o qué documentos preparar.
            </p>
            <p className="mt-5 text-base leading-8 text-white/70">
              Y cuando el proceso se siente inalcanzable, es fácil empezar a creer
              que el sueño no es para ti. Eso es lo que Ximo quiere cambiar.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ── World 3 · Origin (authenticity / narrative transportation) ── */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <ScrollReveal className="w-full max-w-2xl">
          <div className={panel}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1ECECE]">Cómo nació</p>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">Ximo nació porque yo también pasé por eso.</h2>
            <p className="mt-6 text-base leading-8 text-white/70">
              Soy Manuel Zúñiga, fundador de Ximo. Yo también sentí esa duda:
              pensé que el camino era demasiado caro, demasiado difícil, que quizá
              no iba a llegar.
            </p>
            <p className="mt-5 text-base leading-8 text-white/70">
              Aprendí el proceso paso a paso: cómo hablar con coaches, cómo
              organizar mis documentos, cómo mostrar mi progreso. Con el tiempo se
              abrieron puertas en varias universidades NCAA División 1 — no porque
              fuera fácil, sino porque encontré un método y seguí avanzando.
            </p>
            <p className="mt-5 text-base leading-8 text-white/70">
              Ximo existe para compartir ese método con más atletas de habla
              hispana y hacer este camino más claro y más posible.
            </p>
            <Link href="/build-log" className="mt-7 inline-block text-sm font-bold text-[#C9A84C] underline underline-offset-4">
              Conoce cómo nace Ximo →
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ── World 4 · The solution (clarity / competence — SDT) ── */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <ScrollReveal className="w-full max-w-3xl">
          <div className={panel}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1ECECE]">La solución</p>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">Un método paso a paso para perseguir tus sueños.</h2>
            <p className="mt-6 text-base leading-8 text-white/70">
              Ximo no promete magia: te da estructura. Qué hacer, en qué orden y
              cómo avanzar con claridad.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6">
              {[
                ["Cree en ti primero", "El primer paso es dejar de pensar que tu sueño no es para ti."],
                ["Construye tu perfil", "Organiza tiempos, logros, videos, documentos y calificaciones."],
                ["Descubre tu universidad ideal", "Encuentra opciones que hagan sentido para tu nivel y tus metas."],
                ["Contacta coaches con orden", "Aprende a escribir, dar seguimiento y sostener la conversación."],
                ["Entiende becas y costos", "Claridad sobre becas y ayuda financiera antes de comprometerte."],
                ["Avanza acompañado", "Una comunidad de atletas que van hacia el mismo lugar."],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left sm:p-6">
                  <h3 className="text-sm font-black text-white">{t}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── World 5 · Belonging + future self (relatedness — SDT) ── */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <ScrollReveal className="w-full max-w-2xl text-center">
          <div className={panel}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A84C]">No vas solo</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">Una generación que va al mismo lugar.</h2>
            <p className="mt-5 text-base leading-8 text-white/70">
              Una comunidad de atletas mexicanos con la misma visión. El atleta que
              quieres ser dentro de un año ya empezó hoy — y empieza aquí. Ximo es
              quien te acompaña a llegar.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ── World 6 · Commitment: waitlist + demo (consistency + scarcity) ── */}
      <section id="waitlist" className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <ScrollReveal className="w-full max-w-2xl text-center">
          <span className="rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
            Acceso temprano
          </span>
          <h2 className="mt-5 text-4xl font-black md:text-5xl">Empieza a vivir el sueño.</h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-white/70">
            Si has trabajado demasiado por esto, no te rindas antes de entender el
            camino. Ximo existe para ayudarte a dar el siguiente paso con claridad.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-block rounded-xl bg-[#1ECECE] px-10 py-4 text-sm font-black uppercase tracking-wide text-[#06222a] shadow-[0_0_40px_rgba(30,206,206,0.4)] transition-transform hover:scale-[1.03]"
          >
            Únete al demo ahora →
          </Link>
          <p className="mt-3 text-[11px] text-white/45">Versión demo · acceso gratuito</p>
        </ScrollReveal>

        <ScrollReveal delay={120} className="mt-12 w-full max-w-2xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
            <p className="px-2 pb-3 pt-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
              O déjanos tu correo para la versión final
            </p>
            <div className="overflow-hidden rounded-2xl bg-[#F5F5F0]">
              <iframe
                src="https://tally.so/embed/NpbZyO?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                width="100%"
                height="500"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Lista de espera ximo"
              />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Footer — Live the Dream, policies, Powered by Delfinmanny ── */}
      <footer className="relative z-10 border-t border-white/10 bg-[rgba(6,9,18,0.75)] px-6 py-14 backdrop-blur-md">
        <div className="mx-auto max-w-6xl">
          <p className="font-display text-3xl font-black tracking-tight text-white md:text-4xl">Live the Dream</p>
          <p className="mt-2 max-w-md text-sm text-white/55">
            Ximo — creado por un atleta, para atletas que se atreven a perseguir su sueño.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Producto</p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li><Link href="/register" className="hover:text-white">Entrar al demo</Link></li>
                <li><a href="#waitlist" className="hover:text-white">Lista de espera</a></li>
                <li><Link href="/login" className="hover:text-white">Iniciar sesión</Link></li>
                <li><Link href="/build-log" className="hover:text-white">Cómo nace ximo</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Legal</p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li><Link href="/terminos" className="hover:text-white">Términos y Condiciones</Link></li>
                <li><Link href="/privacidad" className="hover:text-white">Aviso de Privacidad</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookies y tecnologías</Link></li>
                <li><Link href="/politica-de-anuncios" className="hover:text-white">Política de anuncios</Link></li>
                <li><Link href="/terminos-anunciantes" className="hover:text-white">Términos anunciantes</Link></li>
                <li><Link href="/reglas-comunidad" className="hover:text-white">Reglas de comunidad</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Contacto</p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li><a href="mailto:ximoacademy@gmail.com" className="hover:text-white">ximoacademy@gmail.com</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Síguenos</p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li><a href="https://www.instagram.com/delfinmanny_/" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram ↗</a></li>
                <li><a href="https://www.tiktok.com/@delfinmanny" target="_blank" rel="noopener noreferrer" className="hover:text-white">TikTok ↗</a></li>
                <li><a href="https://www.youtube.com/@delfinmanny" target="_blank" rel="noopener noreferrer" className="hover:text-white">YouTube ↗</a></li>
                <li><a href="https://app.zoop.club/delfinmanny" target="_blank" rel="noopener noreferrer" className="hover:text-white">Zoop ↗</a></li>
                <li className="text-[10px] text-white/40">Enlaces a sitios externos</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/45 md:flex-row">
            <p>© {year} Ximo · Versión demo en pruebas</p>
            <p>
              Powered by{" "}
              <a href="https://www.instagram.com/delfinmanny_/" target="_blank" rel="noopener noreferrer" className="font-bold text-white/70 hover:text-white">
                Delfinmanny
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
