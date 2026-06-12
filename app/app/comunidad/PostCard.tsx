"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toggleLikeAction, reportContentAction, deletePostAction } from "./actions";
import { TAG_STYLE } from "@/lib/data/community-constants";
import type { FeedPost } from "@/lib/data/community";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} d`;
  return new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

export default function PostCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [likes, setLikes] = useState(post.likes);
  const [, startTransition] = useTransition();
  const ts = TAG_STYLE[post.topic ?? ""] ?? TAG_STYLE.Meta;
  const pendingReview = post.isMine && post.moderation_status !== "approved";

  function onLike() {
    setLiked((v) => !v);
    setLikes((n) => (liked ? n - 1 : n + 1));
    startTransition(async () => { await toggleLikeAction(post.id); });
  }

  function onReport() {
    const reason = prompt("¿Por qué reportas esta publicación? (acoso, spam, sexual, violencia, otro)");
    if (!reason) return;
    const fd = new FormData();
    fd.set("target_type", "post");
    fd.set("target_id", post.id);
    fd.set("reason", reason.trim().toLowerCase());
    startTransition(async () => { await reportContentAction(fd); });
    alert("Gracias. Revisaremos este contenido.");
  }

  function onDelete() {
    if (!confirm("¿Eliminar tu publicación?")) return;
    const fd = new FormData();
    fd.set("id", post.id);
    startTransition(async () => { await deletePostAction(fd); });
  }

  return (
    <article className="rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black"
          style={{ background: "var(--surface-hover)", color: "var(--teal)" }}>
          {post.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-black" style={{ color: "var(--text)" }}>{post.displayName}</span>
            <span className="text-[11px]" style={{ color: "var(--text-label)" }}>{post.subline}</span>
            <span className="text-[11px]" style={{ color: "var(--text-label)" }}>· {timeAgo(post.created_at)}</span>
            {post.topic && (
              <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: ts.bg, color: ts.color }}>{post.topic}</span>
            )}
          </div>

          {pendingReview && (
            <span className="mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "var(--gold-bg)", color: "var(--gold)" }}>
              En revisión
            </span>
          )}

          {post.title && <p className="mb-1 text-sm font-bold" style={{ color: "var(--text)" }}>{post.title}</p>}
          <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>{post.body}</p>

          <div className="mt-3 flex items-center gap-1 pt-2.5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <button type="button" onClick={onLike}
              aria-label={liked ? `Quitar me gusta, ${likes}` : `Me gusta, ${likes}`}
              aria-pressed={liked}
              className="ximo-glass-chip flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold"
              style={liked ? { color: "#f87171" } : undefined}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                <path d="M6.5 11S1 7.5 1 4a2.5 2.5 0 0 1 5.5 0A2.5 2.5 0 0 1 12 4c0 3.5-5.5 7-5.5 7Z" />
              </svg>
              {likes}
            </button>
            <Link href={`/app/comunidad/post/${post.id}`}
              className="ximo-glass-chip flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M11 7.5A4.5 4.5 0 0 1 2 6a4.5 4.5 0 0 1 9 1.5v0A1.5 1.5 0 0 1 9.5 9L7 11.5V9H4.5" />
              </svg>
              {post.comments}
            </Link>
            <Link href={`/app/comunidad/post/${post.id}`} className="ximo-glass-chip ml-auto rounded-lg px-2.5 py-1.5 text-[11px] font-semibold" style={{ color: "var(--teal)" }}>
              Ver conversación →
            </Link>
            {post.isMine ? (
              <button type="button" onClick={onDelete} className="ximo-text-btn ml-1">Eliminar</button>
            ) : (
              <button type="button" onClick={onReport} className="ximo-text-btn ml-1">Reportar</button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
