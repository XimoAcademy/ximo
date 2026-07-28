# Paquete de producción · Curso 7 · Lección 1
## "Tu pipeline de recruiting: de lista a sistema"

Lección piloto (flagship). Todo lo de abajo está listo para producir: bloques de
enseñanza, shot list, plan de subtítulos y **prompts de Higgsfield copy-paste**.
Duración objetivo: **6–8 min**. Guion fuente: `EXPANSION_2026-07-18_guiones.md`.

> **Estado de generación:** los prompts están listos, pero la cuenta de Higgsfield
> tiene 0 créditos y el trial expiró (2026-07-14). En cuanto haya créditos, se
> pegan y corren tal cual. Los gráficos de marca ya existen en `ximo-motion-kit.html`.

---

## 1 · Curva emocional → bloques de enseñanza

Sigue el sistema de edición Ximo (Curiosidad → Problema → Confusión → Explicación →
Ejemplo → Claridad → Acción → Confianza). No hay plano estático > ~5s.

| # | Bloque | Idea única | Emoción | Gráfico principal (del kit) |
|---|--------|-----------|---------|-----------------------------|
| 0 | **Hook** (5–12s) | "Tienes una lista. No tienes un sistema." | Curiosidad | *sin logo* · texto sobre B-roll |
| 1 | **Intro** (5–8s) | Marca | — | Logo Sting |
| 2 | Lista ≠ pipeline | Una lista dice a quién; un pipeline dice qué sigue | Problema | Lower third + contraste |
| 3 | Las 5 etapas | investigación → contactada → conversación → evaluación → descartada *por ahora* | Explicación | **Pipeline Kanban** |
| 4 | "Por ahora" | casi ningún descarte es definitivo | Claridad | Subtítulo cinético |
| 5 | Los 3 datos vivos | etapa · prioridad · próximo paso con fecha | Ejemplo | **Tarjeta de universidad** |
| 6 | Cuántas universidades | calidad > cantidad (20 bien > 60 abandonadas) | Explicación | Comparación 20/60 |
| 7 | El costo del desorden | perder oportunidad por falta de sistema, no de talento | Problema | Señal/ruido reutilizado |
| 8 | El silencio como tarea | baja prioridad + fecha de revisión, no borrar | Confianza | Tarjeta de universidad (estado atenuado) |
| 9 | **Resumen** | 3 takeaways | Claridad | Key Takeaways |
| 10 | **CTA** | completa el quiz → L2 | Acción | Pantalla de cierre |

**Momento sin gráficos:** bloque 7 ("nada de eso es falta de talento — es falta
de sistema") — pausa, contacto visual, dejar respirar la frase.

---

## 2 · Shot list (orden de timeline)

Ritmo de cámara 2–4s; B-roll cada 6–15s; alterna wide/medium/close; punch-ins ≤115%.

| Shot | Dur | Fuente | Contenido |
|------|-----|--------|-----------|
| S1 | 0:00–0:08 | Higgsfield vídeo `V1` | Atleta mirando una libreta con nombres tachados — hook |
| S2 | 0:08–0:14 | Kit · Logo Sting | Intro de marca |
| S3 | 0:14–0:40 | Talking head + Lower third | "El transfer portal"→ aquí "Lista vs. pipeline" |
| S4 | 0:40–1:20 | Kit · **Pipeline Kanban** | Las 5 etapas, chip Iowa moviéndose |
| S5 | 1:20–1:35 | Higgsfield imagen `I2` | B-roll: pantalla con tablero (textura, no UI real) |
| S6 | 1:35–2:20 | Kit · **Tarjeta de universidad** | Michigan · etapa/prioridad/próximo paso |
| S7 | 2:20–2:45 | Higgsfield vídeo `V2` | Atleta escribiendo en calma, luz de amanecer |
| S8 | 2:45–3:30 | Talking head + gráfico 20/60 | Calidad sobre cantidad |
| S9 | 3:30–4:10 | Momento emocional (sin gráfico) | "no es falta de talento" |
| S10 | 4:10–4:40 | Kit · Key Takeaways | 3 puntos en cascada |
| S11 | 4:40–5:00 | Kit · Pantalla de cierre | CTA quiz + L2 |

*(Ajusta el tramo 5:00–8:00 con talking head + B-roll según la extensión real de la narración.)*

---

## 3 · Plan de subtítulos (keyword highlight)

Resalta **solo** la palabra clave en peach. ≤42 car/línea, máx 2 líneas.

- "Una lista te dice **a quién** quieres contactar." → highlight `a quién`
- "Un pipeline te dice **dónde** está cada conversación y **qué sigue**." → `dónde`, `qué sigue`
- "en recruiting casi ningún descarte es **definitivo**." → `definitivo`
- "etapa, prioridad y su **próximo paso con fecha**." → `próximo paso`
- "no está en un pipeline: está en una **lista de deseos**." → `lista de deseos`
- "es falta de **sistema**." → `sistema`

---

## 4 · Prompts de Higgsfield — copy-paste

Voz de marca visual: navy #0B1F33 / cream #F5F5F0 / peach #FBD1A2; cálido, premium,
documental, "Apple hizo una academia". Sin logos de universidades reales, sin caras
reconocibles, sin marcas neón, sin estética gaming.

### 4.1 · Imágenes (B-roll / fondos)

> Modelo sugerido: **Seedream 5.0 Pro** (2K) o **Nano Banana Pro** · relación 16:9 · 1920×1080

**`I1` — Hook / libreta**
```
Cinematic still, an international teenage track athlete sitting at a wooden desk at
dawn, looking thoughtfully at a handwritten notebook full of university names with
some crossed out, warm soft window light, shallow depth of field, muted navy and
cream tones, peach highlight from the sunrise, premium documentary look, no text,
no logos, 16:9.
```

**`I2` — B-roll pantalla/tablero (textura, no UI legible)**
```
Close-up of an out-of-focus laptop screen showing a soft abstract kanban board with
warm cream cards on a deep navy interface, blurred bokeh, peach accent glow, clean
minimal Apple-keynote aesthetic, no readable text, cinematic, 16:9.
```

**`I3` — Ambiente / rutina**
```
Wide cinematic shot of an empty running track at sunrise, long shadows, calm and
aspirational mood, warm cream sky with a soft peach horizon, deep navy foreground,
premium documentary color grade, no people, no text, 16:9.
```

### 4.2 · Vídeo (B-roll con movimiento)

> Modelo sugerido: **Seedance 2.0** (8s, 720p) o **Kling 3.0** (8s, 1080p) · image-to-video desde I1/I3

**`V1` — Hook (desde `I1`)**
```
Slow subtle push-in on the athlete looking at the notebook, gentle dust motes in the
dawn light, minimal motion, cinematic, 8 seconds.
```

**`V2` — Atleta escribiendo (calma)**
```
Medium shot, a young athlete calmly typing on a laptop after training, warm morning
light, slow gentle camera drift, focused and hopeful expression, premium documentary
tone, no on-screen text, 8 seconds.
```

### 4.3 · Voz en off (si no se graba al fundador)

> Modelo sugerido: **Eleven v3** o **MiniMax Speech 2.8 HD** · español neutro LatAm ·
> tono humano, cercano, seguro. Nivel de voz −6 a −12 dBFS, ~−16 LUFS.

**Segmento apertura (VO):**
```
En el primer curso construiste tu lista estratégica de universidades. Esta lección
la convierte en otra cosa: un pipeline. La diferencia parece pequeña y lo cambia
todo. Una lista te dice a quién quieres contactar. Un pipeline te dice dónde está
cada conversación y qué sigue.
```

*(Repite por bloque usando el guion fuente. Mantén una sola voz en toda la academia
para consistencia — Lección 43 debe sonar como Lección 1.)*

---

## 5 · Checklist QC antes de exportar
- [ ] Sin momentos muertos; audio limpio; música duckeada (−16 a −20 dBFS)
- [ ] Colores/fuentes consistentes con el kit; sin errores de ortografía
- [ ] Subtítulos sincronizados, solo keyword resaltada
- [ ] Ningún activo con copyright; ningún logo de universidad real
- [ ] Cada gráfico enseña algo — si decora, se elimina
- [ ] Export master 4K (3840×2160, Rec.709, AAC) + 1080p streaming + cortes 9:16 y 1:1
