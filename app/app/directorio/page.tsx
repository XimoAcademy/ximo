import Link from "next/link";
import PageHeader from "../components/PageHeader";
import { GlassPanel, InnerTile, StatusBadge } from "../components/ui";
import ScrollReveal from "../../components/ScrollReveal";
import { getPrograms, programCount } from "@/lib/data/ncaa";

export default async function DirectorioPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [programs, counts] = await Promise.all([getPrograms(q), programCount()]);

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        title="Directorio NCAA D1"
        subtitle="Programas de natación D1 y los contactos de sus coaches. Agrega los que te interesen a tu lista."
      />

      {/* Summary + search */}
      <ScrollReveal>
        <GlassPanel className="mb-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="info">{counts.programs} programas</StatusBadge>
              <StatusBadge tone="success">{counts.withCoaches} con coaches</StatusBadge>
              <StatusBadge tone="neutral">Natación · D1 · Hombres</StatusBadge>
            </div>
            <form method="get" className="flex w-full gap-2 sm:w-auto">
              <input
                type="text"
                name="q"
                defaultValue={q ?? ""}
                placeholder="Buscar universidad…"
                className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none sm:w-64"
                style={{ background: "var(--surface-hover)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
              <button type="submit" className="ximo-glass-btn teal text-xs">
                Buscar
              </button>
            </form>
          </div>
          {q && (
            <p className="mt-3 text-xs" style={{ color: "var(--text-label)" }}>
              {programs.length} resultado{programs.length === 1 ? "" : "s"} para “{q}”.{" "}
              <Link href="/app/directorio" style={{ color: "var(--teal)" }}>Limpiar</Link>
            </p>
          )}
        </GlassPanel>
      </ScrollReveal>

      {/* Grid */}
      {programs.length === 0 ? (
        <GlassPanel className="px-6 py-12 text-center">
          <p className="text-sm font-bold" style={{ color: "var(--text-label)" }}>
            Sin resultados.
          </p>
        </GlassPanel>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p, i) => (
            <ScrollReveal key={p.id} delay={Math.min(i, 8) * 30}>
              <Link href={`/app/directorio/${p.slug}`} className="block h-full">
                <GlassPanel className="h-full p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-black leading-snug" style={{ color: "var(--text)" }}>
                      {p.name}
                    </p>
                    <StatusBadge tone="neutral">{p.division}</StatusBadge>
                  </div>
                  {p.conference && (
                    <p className="mt-1 text-[11px]" style={{ color: "var(--text-label)" }}>{p.conference}</p>
                  )}
                  <p className="mt-3 text-xs font-semibold" style={{ color: "var(--teal)" }}>
                    Ver coaches →
                  </p>
                </GlassPanel>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      )}

      <InnerTile className="mt-6 px-4 py-3 text-center">
        <p className="text-[11px]" style={{ color: "var(--text-label)" }}>
          Datos de contacto públicos tomados de los sitios oficiales de cada programa.
        </p>
      </InnerTile>
    </div>
  );
}
