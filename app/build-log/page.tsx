const platforms = [
  {
    name: "Instagram",
    handle: "@delfinmanny_",
    text: "Avances rápidos, historias, decisiones del proyecto y contenido diario para atletas que quieren llevar su deporte más lejos.",
    link: "https://www.instagram.com/delfinmanny_/",
    cta: "Ver Instagram",
  },
  {
    name: "TikTok",
    handle: "@delfinmanny",
    text: "Videos cortos sobre el proceso, aprendizajes, ideas, momentos reales y la construcción de ximo desde cero.",
    link: "https://www.tiktok.com/@delfinmanny",
    cta: "Ver TikTok",
  },
  {
    name: "YouTube",
    handle: "@delfinmanny",
    text: "Contenido más completo sobre recruiting, becas, universidades, decisiones importantes y la visión detrás de ximo.",
    link: "https://www.youtube.com/@delfinmanny",
    cta: "Ver YouTube",
  },
  {
    name: "Zoop",
    handle: "Acceso fundador",
    text: "El espacio más cercano para seguir ximo desde dentro: avances exclusivos, detrás de cámaras, decisiones del proyecto y prioridad para futuras pruebas.",
    link: "https://app.zoop.club/delfinmanny",
    cta: "Entrar a Zoop",
  },
];

export default function BuildLog() {
  return (
    <main className="min-h-screen bg-[#F5F5F0] px-6 py-20 text-[#0B1F33]">
      <section className="mx-auto max-w-6xl">
        <a href="/" className="text-sm font-bold text-[#1D4ED8]">
          ← Volver al inicio
        </a>

        <div className="mt-12 max-w-4xl">
          <p className="text-sm font-bold tracking-[0.25em] text-[#C9A84C]">
            DETRÁS DE ximo
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
          Sé parte del camino que está dando vida a ximo.
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#5E7080]">
          Esta primera etapa no es solo para registrarte. Es una invitación a entrar desde el inicio, ver cómo nace ximo y acompañar el proceso de crear una plataforma que ayude a atletas mexicanos a encontrar más oportunidades.
          </p>

          <p className="mt-5 text-lg leading-8 text-[#5E7080]">
            Queremos que el proceso también sea parte de la historia. Por eso,
            todo se irá documentando en Instagram, TikTok, YouTube y Zoop.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {platforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.link}
              target="_blank"
              rel="noreferrer"
              className="group rounded-3xl border border-black/5 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
                    Plataforma
                  </p>

                  <h2 className="mt-3 text-3xl font-black">
                    {platform.name}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-[#1D4ED8]">
                    {platform.handle}
                  </p>
                </div>

                <span className="rounded-full bg-[#F5F5F0] px-4 py-2 text-xs font-bold text-[#0B1F33]">
                  {platform.cta}
                </span>
              </div>

              <p className="mt-6 leading-7 text-[#5E7080]">
                {platform.text}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-[#0B1F33] p-8 text-white md:p-10">
          <p className="text-sm font-bold tracking-[0.25em] text-[#C9A84C]">
            ACCESO FUNDADOR
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight">
            Sé parte del grupo que verá ximo antes que todos.
          </h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">
            En Zoop compartiremos el lado más cercano de ximo: avances antes que
            en redes, detrás de cámaras, decisiones del proyecto, aprendizajes
            de recruiting y prioridad para probar futuras versiones.
          </p>

          <a
            href="https://app.zoop.club/delfinmanny"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-xl bg-white px-8 py-4 text-sm font-bold text-[#0B1F33]"
          >
            Entrar al acceso fundador
          </a>
        </div>
      </section>
    </main>
  );
}