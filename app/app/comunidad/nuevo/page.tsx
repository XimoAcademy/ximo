import { BackLink, GlassPanel } from "../../components/ui";
import { getIdentity } from "@/lib/data/identity";
import Composer from "../Composer";

export const dynamic = "force-dynamic";

export default async function NuevaPublicacionPage() {
  const identity = await getIdentity();
  return (
    <div className="mx-auto max-w-[680px] space-y-5">
      <BackLink href="/app/comunidad">Comunidad</BackLink>
      <div>
        <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>Nueva publicación</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
          Comparte una meta, un avance, un logro o una duda. Tu publicación pasa por revisión antes de aparecer en el feed.
        </p>
      </div>
      <Composer initials={identity?.initials ?? "XI"} />
      <GlassPanel tone="gold" className="p-4">
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
          Mantén la comunidad sana: sé respetuoso, evita compartir información personal y reporta cualquier contenido
          inapropiado. Las publicaciones que incumplan las reglas no se aprueban.
        </p>
      </GlassPanel>
    </div>
  );
}
