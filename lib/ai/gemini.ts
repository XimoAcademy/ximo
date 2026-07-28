/**
 * SERVER-ONLY MODULE — import exclusively from server actions / route handlers.
 * GEMINI_API_KEY has no NEXT_PUBLIC_ prefix, so Next.js never inlines it into
 * client bundles; do not re-export anything from client components.
 *
 * Ximo Support AI — free-tier Gemini chat for platform/usage/troubleshooting
 * questions. Plain `fetch` against the Gemini REST API (no SDK dependency),
 * matching how lib/discord/ads.ts calls Discord's API.
 *
 * Env: GEMINI_API_KEY (required), GEMINI_MODEL (optional, default below).
 */
import * as Sentry from "@sentry/nextjs";

// gemini-2.0-flash / 2.5-flash are no longer available to new API projects
// (they return 404 "no longer available to new users", or a free-tier quota of
// literally 0). 3.5-flash is the current free-tier flash model.
const DEFAULT_MODEL = "gemini-3.5-flash";

/** Backoff before the single retry on a transient 5xx. */
const RETRY_DELAY_MS = 600;

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface NextSessionContext {
  /** Pre-formatted, e.g. "14 ago 2026, 7:00 p.m. GMT-6". */
  whenLabel: string;
}

const SYSTEM_PROMPT = `Eres "Ximo Support AI", el asistente de soporte técnico de Ximo Academy, una
plataforma educativa que ayuda a atletas estudiantes con su proceso de recruiting universitario
(perfil, comunicación con coaches, becas, SAT/TOEFL, documentos, y 6 cursos con lecciones en video
y cuestionarios).

Tu único trabajo es ayudar con preguntas sobre CÓMO USAR LA PLATAFORMA: navegación, progreso de
cursos y cuestionarios, notificaciones, suscripción/cuenta, y errores técnicos comunes. No eres un
asesor de recruiting deportivo, ni das consejos legales, migratorios, médicos o financieros
personalizados — si te preguntan eso, indica amablemente que esos temas los cubren los cursos de
la academia o un profesional calificado, no tú.

Responde siempre en español, de forma breve, cálida y directa (2-5 frases salvo que la pregunta
realmente requiera más detalle). Nunca pidas contraseñas, datos de pago ni documentos sensibles.

Si no puedes resolver la duda con confianza, o el usuario necesita ayuda humana, recomienda el
próximo directo para resolver dudas, que se hace dentro de la comunidad de Discord de Ximo. Usa
exactamente la fecha y hora que se te dan a continuación (si existen) — nunca las inventes. No
compartas ningún enlace: los atletas ya saben cómo entrar a la comunidad.`;

function buildContents(history: ChatTurn[], userMessage: string, next: NextSessionContext | null) {
  const contextNote = next
    ? `[Contexto interno — no visible al usuario, solo para ti]\nPróximo directo para resolver dudas: ${next.whenLabel}, en la comunidad de Discord.`
    : `[Contexto interno — no visible al usuario, solo para ti]\nNo hay ningún directo programado por ahora.`;

  const turns = [
    ...history.slice(-10).map((t) => ({
      role: t.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: t.content }],
    })),
    { role: "user" as const, parts: [{ text: `${contextNote}\n\nPregunta del atleta: ${userMessage}` }] },
  ];
  return turns;
}

/**
 * Asks Gemini for a support reply. Never throws — on any failure it logs to
 * Sentry and returns a graceful fallback string so the chat UI always has
 * something to show.
 */
export async function askXimoSupport(
  history: ChatTurn[],
  userMessage: string,
  next: NextSessionContext | null
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const fallback = next
    ? `No pude procesar tu mensaje en este momento. Mientras tanto, el próximo directo para resolver dudas es el ${next.whenLabel}, en la comunidad de Discord.`
    : "No pude procesar tu mensaje en este momento. Intenta de nuevo en unos minutos, o revisa la sección de Directos para ver el próximo.";

  if (!apiKey) {
    Sentry.captureException(new Error("askXimoSupport called without GEMINI_API_KEY configured"));
    return fallback;
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: buildContents(history, userMessage, next),
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 800,
      // Gemini 3.x "thinking" tokens are billed against maxOutputTokens.
      // Left on, a short support answer burns ~500 thought tokens and the
      // visible reply gets truncated mid-sentence (finishReason MAX_TOKENS).
      // Support answers don't need reasoning — disabling it makes replies
      // complete AND noticeably faster.
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  try {
    // Gemini returns transient 503s often enough to matter (observed twice in
    // one short test run). One bounded retry turns most of those into a real
    // answer instead of the fallback. 5xx only — retrying a 4xx (bad key,
    // quota) would just burn latency.
    let res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });

    if (res.status >= 500) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });
    }

    if (!res.ok) {
      Sentry.captureException(new Error(`Gemini API responded ${res.status}: ${await res.text()}`));
      return fallback;
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        finishReason?: string;
        content?: { parts?: Array<{ text?: string; thought?: boolean }> };
      }>;
    };
    const candidate = data.candidates?.[0];
    // Skip reasoning parts (thought: true) — only user-facing text goes back.
    const text = candidate?.content?.parts
      ?.filter((p) => !p.thought)
      .map((p) => p.text ?? "")
      .join("")
      .trim();

    // A truncated reply would end mid-sentence; report it so the token budget
    // can be tuned rather than silently shipping a half-answer.
    if (candidate?.finishReason === "MAX_TOKENS") {
      Sentry.captureException(new Error("Gemini reply truncated (MAX_TOKENS) — raise maxOutputTokens"));
    }

    return text || fallback;
  } catch (e) {
    Sentry.captureException(e);
    return fallback;
  }
}
