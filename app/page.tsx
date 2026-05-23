export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F5F0] text-[#0B1F33]">
    <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
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
  
        <a
          href="/build-log"
          className="rounded-xl border border-[#0B1F33]/10 bg-white px-8 py-4 text-sm font-bold text-[#0B1F33]"
        >
          Ver cómo nace ximo
        </a>
      </div>
  
      <div className="mt-16 grid w-full gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white p-6 text-left shadow-sm">
          <h3 className="font-bold">Tu proceso en orden</h3>
          <p className="mt-2 text-sm leading-6 text-[#5E7080]">
            Organiza universidades, coaches, respuestas, llamadas, documentos
            y próximos pasos sin perder oportunidades importantes.
          </p>
        </div>
  
        <div className="rounded-2xl border border-black/5 bg-white p-6 text-left shadow-sm">
          <h3 className="font-bold">Creado desde una historia real</h3>
          <p className="mt-2 text-sm leading-6 text-[#5E7080]">
            ximo nace del camino de un nadador mexicano buscando oportunidades
            universitarias, becas y crecimiento deportivo fuera de México.
          </p>
        </div>
  
        <div className="rounded-2xl border border-black/5 bg-white p-6 text-left shadow-sm">
          <h3 className="font-bold">Una comunidad con visión</h3>
          <p className="mt-2 text-sm leading-6 text-[#5E7080]">
            Sigue el proceso, aprende del camino y forma parte de una nueva
            generación de atletas que quiere vivir su deporte de otra manera.
          </p>
        </div>
      </div>
    </section>

      <section id="waitlist" className="bg-[#0B1F33] px-6 py-24 text-white">
  <div className="mx-auto max-w-5xl">
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
        Creemos que el talento mexicano puede llegar más lejos cuando tiene
        claridad, acompañamiento y un sistema que convierte la disciplina en
        oportunidades reales.
      </p>
    </div>

    <div className="mt-12 overflow-hidden rounded-3xl border border-[#C9A84C]/20 bg-[#F5F5F0] p-2 shadow-2xl">
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
  </div>
</section>
    </main>
  );
}