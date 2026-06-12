import { notFound } from "next/navigation";
import { GlassPanel, InnerTile, BackLink, StatusBadge } from "../../components/ui";
import { getProgram } from "@/lib/data/ncaa";
import { addToMyUniversitiesAction, addCoachToMyCrmAction } from "../actions";

export default async function ProgramDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ added?: string; coach?: string }>;
}) {
  const { slug } = await params;
  const { added, coach } = await searchParams;
  const result = await getProgram(slug);
  if (!result) notFound();
  const { program, coaches } = result;

  return (
    <div className="mx-auto max-w-[860px] space-y-5">
      <BackLink href="/app/directorio">Directorio NCAA</BackLink>

      {added && (
        <div
          className="ximo-fade-up rounded-xl px-4 py-3 text-[13px] font-semibold"
          style={{ background: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success)" }}
        >
          Agregada a tus universidades. Gestiónala en Recruiting → Universidades.
        </div>
      )}

      {coach && (
        <div
          className="ximo-fade-up rounded-xl px-4 py-3 text-[13px] font-semibold"
          style={{ background: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success)" }}
        >
          {coach === "added"
            ? "Coach agregado a tu CRM y vinculado a la universidad. Gestiónalo en Coaches."
            : "Ese coach ya está en tu CRM."}
        </div>
      )}

      {/* Header */}
      <GlassPanel className="p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone="info">{program.division}</StatusBadge>
              <StatusBadge tone="neutral">Natación · Hombres</StatusBadge>
              {program.conference && <StatusBadge tone="gold">{program.conference}</StatusBadge>}
            </div>
            <h1 className="mt-3 text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>
              {program.name}
            </h1>
            {program.location && (
              <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>{program.location}</p>
            )}
          </div>

          <form action={addToMyUniversitiesAction} className="shrink-0">
            <input type="hidden" name="slug" value={program.slug} />
            <input type="hidden" name="name" value={program.name} />
            <input type="hidden" name="division" value={program.division} />
            <input type="hidden" name="website" value={program.website ?? ""} />
            <button type="submit" className="ximo-glass-btn teal text-xs">
              + Agregar a mis universidades
            </button>
          </form>
        </div>

        {/* Official links */}
        <div className="mt-5 flex flex-wrap gap-2">
          {program.website && (
            <a href={program.website} target="_blank" rel="noopener noreferrer" className="ximo-glass-btn dark text-xs">
              Sitio oficial ↗
            </a>
          )}
          {program.coaches_url && (
            <a href={program.coaches_url} target="_blank" rel="noopener noreferrer" className="ximo-glass-btn dark text-xs">
              Página de coaches ↗
            </a>
          )}
        </div>
      </GlassPanel>

      {/* Coaches */}
      <GlassPanel className="p-5">
        <h2 className="mb-4 text-base font-black" style={{ color: "var(--text)" }}>
          Cuerpo técnico {coaches.length > 0 && <span style={{ color: "var(--text-label)" }}>· {coaches.length}</span>}
        </h2>

        {coaches.length === 0 ? (
          <InnerTile className="px-4 py-8 text-center">
            <p className="text-sm font-bold" style={{ color: "var(--text-label)" }}>
              Contactos por cargar
            </p>
            <p className="mx-auto mt-1 max-w-sm text-[12px] leading-relaxed" style={{ color: "var(--text-3)" }}>
              Aún no importamos los coaches de este programa. Mientras tanto, consulta la página oficial de
              coaches.
            </p>
            {program.coaches_url && (
              <a href={program.coaches_url} target="_blank" rel="noopener noreferrer" className="ximo-glass-btn dark mt-4 inline-block text-xs">
                Abrir página de coaches ↗
              </a>
            )}
          </InnerTile>
        ) : (
          <div className="space-y-2.5">
            {coaches.map((c) => (
              <InnerTile key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{c.name}</p>
                  {c.title && <p className="text-[12px]" style={{ color: "var(--text-label)" }}>{c.title}</p>}
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="text-[12px] font-semibold" style={{ color: "var(--teal)" }}>{c.email}</a>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {c.phone && (
                    <span className="text-[11px]" style={{ color: "var(--text-label)" }}>{c.phone}</span>
                  )}
                  <form action={addCoachToMyCrmAction}>
                    <input type="hidden" name="slug" value={program.slug} />
                    <input type="hidden" name="program_name" value={program.name} />
                    <input type="hidden" name="division" value={program.division} />
                    <input type="hidden" name="website" value={program.website ?? ""} />
                    <input type="hidden" name="coach_name" value={c.name} />
                    <input type="hidden" name="title" value={c.title ?? ""} />
                    <input type="hidden" name="email" value={c.email ?? ""} />
                    <button type="submit" className="ximo-glass-chip rounded-full px-3 py-1.5 text-[11px] font-semibold" style={{ color: "var(--teal)" }}>
                      + Mi CRM
                    </button>
                  </form>
                </div>
              </InnerTile>
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
