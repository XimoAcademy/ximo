import { BackLink, EmptyState } from "../../../components/ui";
import { getFeed } from "@/lib/data/community";
import PostCard from "../../PostCard";

export const dynamic = "force-dynamic";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const decoded = decodeURIComponent(topic);
  const { posts } = await getFeed(decoded);
  const label = decoded.charAt(0).toUpperCase() + decoded.slice(1);

  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <BackLink href="/app/comunidad">Comunidad</BackLink>

      <div>
        <h1 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text)" }}>#{label}</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-label)" }}>
          {posts.length} {posts.length === 1 ? "publicación" : "publicaciones"} en esta etiqueta
        </p>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title={`Aún no hay publicaciones en #${label}`}
          text="Sé el primero en publicar con esta etiqueta desde la comunidad."
          action="Ir a la comunidad"
          actionHref="/app/comunidad"
        />
      ) : (
        <div className="space-y-3">
          {posts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      )}
    </div>
  );
}
