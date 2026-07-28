import { describe, expect, it } from "vitest";
import { avisoPublicado, avisoRecordatorio, DIRECTO_TITULO, DIRECTO_DONDE } from "./text";

const CUANDO = "14 ago 2026, 7:00 p.m. GMT-6";

describe("avisoPublicado", () => {
  const aviso = avisoPublicado(CUANDO);

  it("anuncia que habrá directo para resolver dudas", () => {
    expect(aviso.title).toContain(DIRECTO_TITULO);
  });

  it("incluye la fecha y la hora", () => {
    expect(aviso.title).toContain(CUANDO);
  });

  it("dice dónde verlo, sin ningún enlace", () => {
    expect(aviso.body).toBe(DIRECTO_DONDE);
    expect(aviso.body).toContain("Discord");
  });
});

describe("avisoRecordatorio", () => {
  const aviso = avisoRecordatorio("en 10 minutos", CUANDO);

  it("dice cuánto falta y cuándo es", () => {
    expect(aviso.title).toContain("en 10 minutos");
    expect(aviso.title).toContain(CUANDO);
  });

  it("mantiene el mismo pie que el aviso de publicación", () => {
    expect(aviso.body).toBe(avisoPublicado(CUANDO).body);
  });
});

describe("el texto nunca lleva enlaces", () => {
  const textos = [
    avisoPublicado(CUANDO),
    avisoRecordatorio("en 24 horas", CUANDO),
    avisoRecordatorio("en 1 hora", CUANDO),
    avisoRecordatorio("en 10 minutos", CUANDO),
  ];

  it.each(textos)("ni en el título ni en el cuerpo: %o", (t) => {
    expect(`${t.title} ${t.body}`).not.toMatch(/https?:\/\/|discord\.gg/i);
  });
});

describe("el texto es siempre el mismo salvo la fecha", () => {
  it("dos directos distintos solo difieren en la fecha", () => {
    const a = avisoPublicado("1 ene 2027, 9:00 a.m. GMT-6");
    const b = avisoPublicado(CUANDO);
    expect(a.body).toBe(b.body);
    expect(a.title.replace("1 ene 2027, 9:00 a.m. GMT-6", "")).toBe(b.title.replace(CUANDO, ""));
  });
});
