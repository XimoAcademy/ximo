import Link from "next/link";
import { getFeed, getTrendingTopics, getCommunityStats } from "@/lib/data/community";
import { getIdentity } from "@/lib/data/identity";
import Composer from "./Composer";
import PostCard from "./PostCard";

export const dynamic = "force-dynamic";

const SURFACE = "var(--surface)";
const BORDER = "var(--border)";

export default async function ComunidadPage() {
  const [{ posts }, identity, trending, stats] = await Promise.all([
    getFeed(),
    getIdentity(),
    getTrendingTopics(),
    getCommunityStats(),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      {/* Feed */}
      <div className="min-w-0 space-y-4">
        <Composer initials={identity?.initials ?? "XI"} />

        {posts.length === 0 ? (
          <div className="rounded-2xl py-12 text-center" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <p className="text-sm font-black" style={{ color: "var(--text)" }}>Sé el primero en publicar</p>
            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>
              Comparte una meta, un avance o una duda. Las publicaciones pasan por revisión antes de aparecer en el feed
              para mantener la comunidad sana.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}

        <p className="py-3 text-center text-[10px]" style={{ color: "rgba(127,175,178,0.4)" }}>
          Comunidad Ximo · Solo atletas con suscripción activa
        </p>
      </div>

      {/* Sidebar */}
      <aside className="hidden space-y-4 lg:block">
        <div className="rounded-2xl p-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Comunidad</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Atletas", value: stats.athletes },
              { label: "Publicaciones", value: stats.posts },
              { label: "Hoy", value: stats.postsToday },
              { label: "Deportes", value: 1 },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl px-2.5 py-2 text-center" style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
                <p className="text-lg font-black" style={{ color: "var(--teal)" }}>{value}</p>
                <p className="text-[9px] font-semibold" style={{ color: "var(--text-label)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>Tendencias</p>
          {trending.length === 0 ? (
            <p className="text-[11px]" style={{ color: "var(--text-3)" }}>Aún no hay tendencias. Publica con una etiqueta para empezar.</p>
          ) : (
            <div className="space-y-2">
              {trending.map(({ topic, count }, i) => (
                <Link key={topic} href={`/app/comunidad/temas/${encodeURIComponent(topic.toLowerCase())}`}
                  className="ximo-glass-chip flex w-full items-center justify-between rounded-xl px-2.5 py-2">
                  <div className="flex items-center gap-2">
                    <span className="w-4 text-center text-[10px] font-black" style={{ color: "var(--text-label)" }}>#{i + 1}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--text-2)" }}>{topic}</span>
                  </div>
                  <span className="text-[10px]" style={{ color: "var(--text-label)" }}>{count}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl p-4" style={{ background: "rgba(232,206,78,0.06)", border: "1px solid var(--gold-border)" }}>
          <p className="mb-1.5 text-xs font-black" style={{ color: "var(--gold)" }}>¿Tu marca apoya atletas?</p>
          <p className="mb-3 text-[11px] leading-relaxed" style={{ color: "var(--text-3)" }}>Conecta con atletas serios en proceso de recruiting.</p>
          <Link href="/app/promocionar" className="ximo-glass-btn gold shiny block w-full text-center text-xs">Promocionar con Ximo →</Link>
        </div>
      </aside>
    </div>
  );
}
