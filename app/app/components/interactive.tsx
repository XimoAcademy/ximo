"use client";

import { useState, type ReactNode } from "react";

/* ──────────────────────────────────────────────────────────────
   Small client-side interactive primitives that can be dropped
   into otherwise-static (server) pages. All visual/mock only —
   no backend. They keep redirects/pages server-rendered while
   still feeling alive.
   ────────────────────────────────────────────────────────────── */

// Toggleable checklist (visual). Pre-checked items can be passed.
export function Checklist({
  items,
}: {
  items: { label: string; done?: boolean }[];
}) {
  const [state, setState] = useState(() => items.map((i) => !!i.done));
  return (
    <ul className="space-y-2">
      {items.map((item, i) => {
        const checked = state[i];
        return (
          <li key={item.label}>
            <button
              type="button"
              onClick={() => setState((s) => s.map((v, j) => (j === i ? !v : v)))}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors"
              style={{
                background: "var(--surface-hover)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px] font-black"
                style={
                  checked
                    ? { background: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--success)" }
                    : { background: "transparent", color: "transparent", border: "1px solid var(--border-strong)" }
                }
              >
                ✓
              </span>
              <span
                className="text-sm"
                style={{
                  color: checked ? "var(--text-3)" : "var(--text-2)",
                  textDecoration: checked ? "line-through" : "none",
                }}
              >
                {item.label}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// FAQ accordion item.
export function FaqItem({ q, a }: { q: string; a: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
          {q}
        </span>
        <span
          className="shrink-0 text-sm"
          style={{ color: "var(--teal)", transform: open ? "rotate(45deg)" : "none", transition: "transform 0.25s ease" }}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
          {a}
        </div>
      )}
    </div>
  );
}
