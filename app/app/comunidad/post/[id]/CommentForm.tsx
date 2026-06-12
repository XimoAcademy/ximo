"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addCommentAction, type ActionResult } from "../../actions";

export default function CommentForm({ postId, initials }: { postId: string; initials: string }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(addCommentAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Show the notice on success, adjusting state during render.
  const [prevState, setPrevState] = useState<ActionResult | null>(null);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.ok) setNotice("Tu comentario está en revisión.");
  }

  // DOM-only work on success (uncontrolled textarea reset) + notice timer.
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  return (
    <form ref={formRef} action={formAction} className="flex gap-3">
      <input type="hidden" name="post_id" value={postId} />
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black"
        style={{ background: "var(--surface-hover)", color: "var(--teal)" }}>
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <textarea name="body" rows={2} required placeholder="Escribe un comentario…" className="ximo-input resize-none" maxLength={800} />
        {state?.error && <p className="mt-2 text-xs font-semibold" style={{ color: "var(--error)" }}>{state.error}</p>}
        {notice && <p className="mt-2 text-xs font-semibold" style={{ color: "var(--teal)" }}>{notice}</p>}
        <div className="mt-2 flex justify-end">
          <button type="submit" disabled={pending} className="ximo-glass-btn teal text-xs disabled:opacity-50">
            {pending ? "Enviando…" : "Comentar"}
          </button>
        </div>
      </div>
    </form>
  );
}
