"use client";

import { useEffect, useRef, useState } from "react";
import type { SupportMessage } from "@/lib/data/support-chat";

const QUICK_QUESTIONS = [
  "¿Cómo repito un cuestionario que no aprobé?",
  "No me llegan las notificaciones",
  "¿Cómo actualizo mi perfil de atleta?",
  "¿Cómo cancelo o cambio mi suscripción?",
];

type LocalMessage = Pick<SupportMessage, "role" | "content"> & { id: string };

function toLocal(m: SupportMessage): LocalMessage {
  return { id: m.id, role: m.role, content: m.content };
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1" aria-label="Ximo Support AI está escribiendo">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full"
          style={{ background: "var(--text-label)", animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}

function Bubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
        style={
          isUser
            ? { background: "var(--teal-bg)", border: "1px solid var(--teal-border)", color: "var(--text)" }
            : { background: "var(--surface-hover)", border: "1px solid var(--border-subtle)", color: "var(--text-2)" }
        }
      >
        {content}
      </div>
    </div>
  );
}

export default function SupportChat({ initialMessages }: { initialMessages: SupportMessage[] }) {
  const [messages, setMessages] = useState<LocalMessage[]>(() => initialMessages.map(toLocal));
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setInput("");
    setError(null);
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: trimmed }]);
    setSending(true);

    try {
      const res = await fetch("/api/support-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) throw new Error(`request failed: ${res.status}`);
      const data = (await res.json()) as { reply: string };
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: data.reply }]);
    } catch {
      setError("No se pudo enviar tu mensaje. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <div className="rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed" style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)", color: "var(--text-2)" }}>
              ¡Hola! Soy Ximo Support AI. Pregúntame lo que necesites sobre la plataforma: cursos, cuestionarios,
              notificaciones, tu cuenta o cualquier duda técnica.
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="ximo-glass-chip rounded-full px-3 py-1.5 text-[11px] font-semibold"
                  style={{ color: "var(--text-2)" }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <Bubble key={m.id} role={m.role} content={m.content} />
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-3.5 py-2" style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}>
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t px-4 py-3" style={{ borderColor: "var(--border-subtle)" }}>
        {error && (
          <p className="mb-2 text-[11px] font-semibold" style={{ color: "var(--error)" }}>
            {error}
          </p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-end gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta…"
            disabled={sending}
            className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none"
            style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)", color: "var(--text)" }}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="ximo-glass-btn teal shrink-0 text-xs disabled:opacity-50"
          >
            Enviar
          </button>
        </form>
        <p className="mt-2 text-[10px]" style={{ color: "var(--text-3)" }}>
          Gratis, sin límite de uso · Ximo Support AI puede cometer errores — para casos complejos, únete a la
          próxima sesión de soporte en vivo.
        </p>
      </div>
    </div>
  );
}
