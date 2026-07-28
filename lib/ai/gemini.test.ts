import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { askXimoSupport } from "./gemini";

vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

const NEXT = { whenLabel: "14 ago 2026, 7:00 p.m. GMT-6" };

function geminiResponse(parts: Array<{ text?: string; thought?: boolean }>, finishReason = "STOP") {
  return {
    ok: true,
    json: async () => ({ candidates: [{ finishReason, content: { parts } }] }),
  } as unknown as Response;
}

describe("askXimoSupport", () => {
  const originalKey = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    process.env.GEMINI_API_KEY = "test-key";
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalKey;
    vi.restoreAllMocks();
  });

  it("returns the model's text reply", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => geminiResponse([{ text: "Revisa tus preferencias." }])));
    await expect(askXimoSupport([], "No me llegan notificaciones", null)).resolves.toBe(
      "Revisa tus preferencias."
    );
  });

  it("drops reasoning parts so thinking never leaks to the athlete", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        geminiResponse([
          { text: "El usuario pregunta por notificaciones...", thought: true },
          { text: "Respuesta visible." },
        ])
      )
    );
    await expect(askXimoSupport([], "hola", null)).resolves.toBe("Respuesta visible.");
  });

  it("sends thinking disabled so replies are not truncated by thought tokens", async () => {
    const fetchMock = vi.fn(async () => geminiResponse([{ text: "ok" }]));
    vi.stubGlobal("fetch", fetchMock);
    await askXimoSupport([], "hola", null);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.generationConfig.thinkingConfig).toEqual({ thinkingBudget: 0 });
    expect(body.generationConfig.maxOutputTokens).toBeGreaterThan(500);
  });

  it("injects the next live session so the model never invents a date", async () => {
    const fetchMock = vi.fn(async () => geminiResponse([{ text: "ok" }]));
    vi.stubGlobal("fetch", fetchMock);
    await askXimoSupport([], "necesito ayuda humana", NEXT);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    const lastTurn = body.contents.at(-1).parts[0].text as string;
    expect(lastTurn).toContain(NEXT.whenLabel);
  });

  it("instructs the model not to share any link (athletes already know the community)", async () => {
    const fetchMock = vi.fn(async () => geminiResponse([{ text: "ok" }]));
    vi.stubGlobal("fetch", fetchMock);
    await askXimoSupport([], "hola", NEXT);

    const system = JSON.parse(fetchMock.mock.calls[0][1].body as string).systemInstruction.parts[0].text;
    expect(system).toContain("No\ncompartas ningún enlace");
  });

  it("only sends the last 10 turns of history", async () => {
    const fetchMock = vi.fn(async () => geminiResponse([{ text: "ok" }]));
    vi.stubGlobal("fetch", fetchMock);
    const history = Array.from({ length: 30 }, (_, i) => ({
      role: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
      content: `m${i}`,
    }));
    await askXimoSupport(history, "actual", null);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.contents).toHaveLength(11); // 10 history + current message
  });

  it("maps assistant turns to Gemini's 'model' role", async () => {
    const fetchMock = vi.fn(async () => geminiResponse([{ text: "ok" }]));
    vi.stubGlobal("fetch", fetchMock);
    await askXimoSupport([{ role: "assistant", content: "previa" }], "hola", null);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.contents[0].role).toBe("model");
  });

  it("falls back to the live session instead of throwing when the API errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 500, text: async () => "boom" }) as unknown as Response)
    );
    const reply = await askXimoSupport([], "hola", NEXT);
    expect(reply).toContain(NEXT.whenLabel);
    expect(reply).not.toContain("http");
  });

  it("says the daily quota ran out (429) instead of a vague error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 429, text: async () => "quota" }) as unknown as Response)
    );
    const reply = await askXimoSupport([], "hola", NEXT);
    expect(reply).toContain("límite de consultas");
    expect(reply).toContain(NEXT.whenLabel);
  });

  it("retries once on a transient 5xx and returns the recovered reply", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503, text: async () => "unavailable" } as unknown as Response)
      .mockResolvedValueOnce(geminiResponse([{ text: "Respuesta tras reintento." }]));
    vi.stubGlobal("fetch", fetchMock);

    await expect(askXimoSupport([], "hola", null)).resolves.toBe("Respuesta tras reintento.");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not retry a 4xx — a bad key or quota error will not fix itself", async () => {
    const fetchMock = vi.fn(
      async () => ({ ok: false, status: 429, text: async () => "quota" }) as unknown as Response
    );
    vi.stubGlobal("fetch", fetchMock);

    await askXimoSupport([], "hola", null);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("gives up after the retry when the API stays down", async () => {
    const fetchMock = vi.fn(
      async () => ({ ok: false, status: 503, text: async () => "unavailable" }) as unknown as Response
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(askXimoSupport([], "hola", NEXT)).resolves.toContain(NEXT.whenLabel);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("falls back when fetch itself rejects", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network down"); }));
    await expect(askXimoSupport([], "hola", null)).resolves.toContain("No pude procesar");
  });

  it("falls back without calling the API when no key is configured", async () => {
    delete process.env.GEMINI_API_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(askXimoSupport([], "hola", null)).resolves.toContain("No pude procesar");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("falls back when the model returns an empty reply", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => geminiResponse([{ text: "   " }])));
    await expect(askXimoSupport([], "hola", null)).resolves.toContain("No pude procesar");
  });
});
