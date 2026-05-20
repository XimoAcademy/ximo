const updates = [
    {
      date: "May 2026",
      title: "XIMO public version started",
      text: "The first public version of XIMO is focused on three things: landing page, waitlist, and build log.",
    },
    {
      date: "May 2026",
      title: "Claude sketches saved as reference",
      text: "The original visual prototypes are being used as design references while the real product is built step by step.",
    },
    {
      date: "Next step",
      title: "Waitlist and early athlete feedback",
      text: "The goal is to collect the first interested athletes and learn what problems they want XIMO to solve first.",
    },
  ];
  
  export default function BuildLog() {
    return (
      <main className="min-h-screen bg-[#F5F5F0] px-6 py-20 text-[#0B1F33]">
        <section className="mx-auto max-w-3xl">
          <a href="/" className="text-sm font-bold text-[#1D4ED8]">
            ← Back to home
          </a>
  
          <p className="mt-10 text-sm font-bold tracking-[0.25em] text-[#C9A84C]">
            BUILD LOG
          </p>
  
          <h1 className="mt-4 text-5xl font-black tracking-tight">
            Building XIMO in public.
          </h1>
  
          <p className="mt-5 text-lg leading-8 text-[#5E7080]">
            This is where I document the process of turning XIMO from an idea into
            a real platform for student-athletes.
          </p>
  
          <div className="mt-12 space-y-5">
            {updates.map((update) => (
              <article
                key={update.title}
                className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
                  {update.date}
                </p>
                <h2 className="mt-3 text-2xl font-black">{update.title}</h2>
                <p className="mt-3 leading-7 text-[#5E7080]">{update.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    );
  }