"use client";

import { useState, type ReactNode } from "react";

/* ──────────────────────────────────────────────────────────────
   Small client-side interactive primitives that can be dropped
   into otherwise-static (server) pages. All visual/mock only —
   no backend. They keep redirects/pages server-rendered while
   still feeling alive.
   ────────────────────────────────────────────────────────────── */

// A single "mark as done" CTA that flips to a confirmed state.
export function MarkCompleteButton({
  label = "Marcar como completada",
  doneLabel = "Completada ✓",
  tone = "teal",
}: {
  label?: string;
  doneLabel?: string;
  tone?: "teal" | "gold" | "dark";
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setDone((d) => !d)}
      className={`ximo-glass-btn ${done ? "gold" : tone} text-xs`}
    >
      {done ? doneLabel : label}
    </button>
  );
}

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

// Visual notes textarea with a save confirmation.
export function NotesBox({
  placeholder = "Escribe tus notas…",
  defaultValue = "",
}: {
  placeholder?: string;
  defaultValue?: string;
}) {
  const [val, setVal] = useState(defaultValue);
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <textarea
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          setSaved(false);
        }}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-xl px-3.5 py-3 text-sm outline-none placeholder:text-[var(--text-label)]"
        style={{ background: "var(--surface-hover)", border: "1px solid var(--border)", color: "var(--text)" }}
      />
      <button
        type="button"
        onClick={() => setSaved(true)}
        className="ximo-glass-btn dark mt-3 text-xs"
      >
        {saved ? "Notas guardadas" : "Guardar notas"}
      </button>
    </div>
  );
}

// A labelled liquid-glass switch row (notifications, privacy).
export function SwitchRow({
  title,
  description,
  defaultOn = false,
}: {
  title: string;
  description?: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-xl px-3.5 py-3"
      style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}
    >
      <div className="min-w-0">
        <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
          {title}
        </p>
        {description && (
          <p className="mt-0.5 text-[11px] leading-snug" style={{ color: "var(--text-label)" }}>
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={title}
        onClick={() => setOn((v) => !v)}
        className={`ximo-glass-chip relative flex h-7 w-12 shrink-0 items-center rounded-full p-1 ${on ? "active" : ""}`}
      >
        <span
          aria-hidden
          className="h-5 w-5 rounded-full"
          style={{
            background: on ? "#ffffff" : "var(--text-3)",
            transform: on ? "translateX(20px)" : "translateX(0)",
            transition: "transform 0.32s cubic-bezier(0.22,1,0.36,1), background 0.2s ease",
          }}
        />
      </button>
    </div>
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

// A composer-style text field with a publish confirmation (community).
export function MiniComposer({
  placeholder = "Escribe tu respuesta…",
  button = "Publicar",
}: {
  placeholder?: string;
  button?: string;
}) {
  const [val, setVal] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div>
      <textarea
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          setSent(false);
        }}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-xl px-3.5 py-3 text-sm outline-none placeholder:text-[var(--text-label)]"
        style={{ background: "var(--surface-hover)", border: "1px solid var(--border)", color: "var(--text)" }}
      />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px]" style={{ color: "var(--text-label)" }}>
          {sent ? "Enviado · visible para la comunidad" : "Sé respetuoso y específico."}
        </span>
        <button
          type="button"
          disabled={!val.trim()}
          onClick={() => {
            setSent(true);
            setVal("");
          }}
          className="ximo-glass-btn teal text-xs"
        >
          {button}
        </button>
      </div>
    </div>
  );
}
