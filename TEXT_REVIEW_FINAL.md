# Ximo — Revisión final de textos (TEXT_REVIEW_FINAL.md)

Fecha: 2026-07-08. Complementa `TEXT_AUDIT.md` (auditoría anterior). Criterios de esta
pasada: español natural de México, tono humano/profesional/motivador, **cero uso de
"real"/"reales" en texto visible**, sin promesas (becas, admisiones, patrocinadores,
resultados, alcance de anuncios, crecimiento de Discord, aprobación o publicación
automática) y sin lenguaje robótico.

## Prohibición de "real / reales" — ocurrencias corregidas

| Ubicación | Antes | Después |
|---|---|---|
| Cursos (lección) | "El calendario real del recruiting" | "El calendario del recruiting, mes a mes" |
| Cursos (resumen) | "…personalización que genera respuestas reales de coaches" | "…personalización que genera respuestas de coaches" |
| Cursos (título) | "Becas y costo real" | "Becas y costo neto" |
| Cursos (varios) | "costo real / costos reales / costo neto real" | "costo neto / costos netos" |
| Configuración | "alertas push en tiempo real" / "notificaciones en tiempo real" | "alertas push al instante" / "notificaciones del navegador al instante" |
| Cómo nace Ximo | "momentos reales" (TikTok) | "los aprendizajes y la construcción de Ximo desde cero" |
| Landing parqueada (`_launch`) | "Recruiting pipeline real", "oportunidad real", "historia real", "oportunidades reales" | "pipeline completo", "oportunidad concreta", "historia vivida", "oportunidades concretas" |

Verificación final: `grep -i "\breal(es)?\b"` sobre `app/` solo devuelve comentarios de
código (no visibles al usuario).

## Paso de demo $0.00 (nuevo copy)

- `/subscribe` (modo demo): badge "Paso de demostración", precio grande **"$0.00 MXN"**,
  explicación honesta ("simula cómo funcionará la activación… hoy todo cuesta $0.00 y no
  se te cobra nada"), viñetas: sin cargo, sin tarjeta, "solo se genera un registro de
  prueba de la activación (no es una factura ni un comprobante fiscal)". CTA:
  **"Continuar con demo →"**.
- Pantalla de confirmación: en demo dice "Estamos activando tu acceso demo" y "registro
  de prueba a $0.00 — no se realizó ningún cargo" (antes: "confirmando tu pago / gracias
  por suscribirte", que sonaba a cobro).
- `/terminos`: nueva cláusula — el registro del demo "no constituye una factura ni un
  comprobante fiscal (CFDI)".

## Landing (menos es más)

- "El problema": 3 párrafos densos → 2 concisos, mismo mensaje emocional.
- "Cómo nació": 4 párrafos → 3, primera persona intacta, sin exageraciones.
- "La solución": intro recortada; las 6 tarjetas pasaron a descripciones de una línea,
  con más aire (gap y padding mayores).
- Paneles con más padding en pantallas ≥sm; jerarquía tipográfica sin cambios.

## Cómo nace Ximo (rediseño)

Página clara → mismo lenguaje visual del inicio: fondo oscuro premium, paneles de vidrio,
acentos teal/dorado, chips "Sitio externo", CTA de demo al final. Copy reducido y más
cálido; sin promesas de acceso o crecimiento.

## Otros ajustes de tono

- Configuración → "Notificaciones de comunidad": descripción actualizada (ya no hay
  publicaciones internas).
- Subidas de archivos: errores reescritos en tono humano ("Se perdió la conexión durante
  la subida. Verifica tu red e intenta de nuevo.", "Ese tipo de archivo no es compatible.
  Usa PDF, JPG, PNG, DOC o DOCX.").
- Panel admin de anuncios: instrucciones de publicación manual en Discord en español
  claro; el botón automatizado siempre etiqueta el mensaje como "Publicidad".
- Páginas legales: nota visible de que serán revisadas por un profesional del derecho
  antes del lanzamiento comercial (requisito de esta pasada).

## Revisado sin cambios

Dashboard, tareas, recruiting, coaches, universidades, directorio, correos, documentos,
progreso, SAT/TOEFL, perfil, ayuda, notificaciones, onboarding, auth, comunidad
(Discord), promocionar, marcas, facturación: el copy ya venía de la auditoría anterior
(TEXT_AUDIT.md) y cumple los criterios de esta pasada.
