"use client";

import { useActionState, useEffect, useState } from "react";
import { createPostAction, type ActionResult } from "./actions";
import { COMMUNITY_TAGS, type CommunityTag } from "@/lib/data/community-constants";

export default function Composer({ initials }: { initials: string }) {
  const [text, setText] = useState("");
  const [tag, setTag] = useState<CommunityTag>("Meta");
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(createPostAction, null);
  const [notice, setNotice] = useState<string | null>(null);

  // Clear the textarea and show the notice on success, adjusting state during
  // render (all fields are controlled, so no DOM reset is needed).
  const [prevState, setPrevState] = useState<ActionResult | null>(null);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.ok) {
      setText("");
      setNotice("Tu publicación está en revisión y aparecerá en el feed cuando sea aprobada.");
    }
  }

  // Auto-dismiss the notice (timer only — the async callback may set state).
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  return (
    <form action={formAction} className="rounded-2xl p-4 sm:p-5" style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}>
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black"
          style={{ background: "rgba(30,206,206,0.15)", color: "var(--teal)", border: "1px solid rgba(30,206,206,0.2)" }}>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <textarea name="body" value={text} onChange={(e) => setText(e.target.value)}
            placeholder="¿Qué está pasando en tu camino deportivo?" rows={3}
            className="w-full resize-none rounded-xl bg-transparent p-0 text-sm outline-none placeholder:text-[var(--text-label)]"
            style={{ color: "var(--text)" }} maxLength={1000} />
          <input type="hidden" name="tag" value={tag} />

          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex flex-wrap gap-1.5">
              {COMMUNITY_TAGS.map((t) => (
                <button key={t} type="button" onClick={() => setTag(t)}
                  className={`ximo-glass-chip rounded-full px-2.5 py-0.5 text-[10px] font-bold ${tag === t ? "active" : ""}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tabular-nums" style={{ color: text.length > 950 ? "var(--error)" : "var(--text-label)" }}>{1000 - text.length}</span>
              <button type="submit" disabled={!text.trim() || pending} className="ximo-glass-btn teal text-xs disabled:opacity-50">
                {pending ? "Publicando…" : "Publicar"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {state?.error && <p className="mt-3 text-xs font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>}
      {notice && <p className="mt-3 rounded-lg px-3 py-2 text-xs font-semibold" style={{ background: "var(--teal-bg)", color: "var(--teal)" }}>{notice}</p>}
    </form>
  );
}
