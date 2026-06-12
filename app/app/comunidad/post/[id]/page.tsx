import { notFound } from "next/navigation";
import { BackLink, GlassPanel, StatusBadge } from "../../../components/ui";
import { getPost, authorName, authorInitials, authorSubline } from "@/lib/data/community";
import { getIdentity } from "@/lib/data/identity";
import PostCard from "../../PostCard";
import CommentForm from "./CommentForm";

export const dynamic = "force-dynamic";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  return new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [result, identity] = await Promise.all([getPost(id), getIdentity()]);
  if (!result) notFound();
  const { post, comments } = result;
  const visibleComments = comments.filter((c) => c.moderation_status === "approved" || c.isMine);

  return (
    <div className="mx-auto max-w-[760px] space-y-5">
      <BackLink href="/app/comunidad">Comunidad</BackLink>

      <PostCard post={post} />

      <GlassPanel className="p-5">
        <h2 className="mb-4 text-base font-black" style={{ color: "var(--text)" }}>
          Comentarios {visibleComments.length > 0 && <span style={{ color: "var(--text-label)" }}>· {visibleComments.length}</span>}
        </h2>

        <div className="mb-5">
          <CommentForm postId={post.id} initials={identity?.initials ?? "XI"} />
        </div>

        {visibleComments.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-label)" }}>Sé el primero en responder.</p>
        ) : (
          <div className="space-y-3">
            {visibleComments.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black"
                  style={{ background: "var(--surface-hover)", color: "var(--teal)" }}>
                  {authorInitials(c.author, c.user_id)}
                </div>
                <div className="flex-1 rounded-xl px-3 py-2.5" style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
                  <div className="mb-0.5 flex flex-wrap items-center gap-2">
                    <p className="text-[11px] font-bold" style={{ color: "var(--text)" }}>{authorName(c.author)}</p>
                    <span className="text-[10px]" style={{ color: "var(--text-label)" }}>{authorSubline(c.author)} · {timeAgo(c.created_at)}</span>
                    {c.isMine && c.moderation_status !== "approved" && <StatusBadge tone="gold">En revisión</StatusBadge>}
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
