# Ximo — Auditoría de textos (antes / después)

Fecha: 2026-07-07. Criterio: el copy debe reflejar lo que Ximo realmente ofrece
—organizar el recruiting, aprender paso a paso, seguir tu progreso, conectar con
la comunidad (Discord) y enviar anuncios a revisión manual— sin promesas de
becas, reclutamiento, alcance ni resultados garantizados, sin urgencia falsa y
sin patrones oscuros.

## Cambios importantes

### Promocionar (anunciantes)

| Antes | Después | Motivo |
|---|---|---|
| "Revisión garantizada" (chips y nota del formulario) | "Revisión manual" / "Sin pago antes de aprobarse" | "Garantizada" suena a promesa comercial; lo que existe es revisión manual |
| "El proceso protege a los atletas y garantiza calidad." | "Revisión manual antes de cualquier pago o publicación." | Sin verbo "garantizar" |
| Paso 03 "Configuras presupuesto… alcance estimado" mostrado antes de la revisión + simulador de presupuesto con "500–900 atletas" en la página pública | El simulador se movió al paso post-aprobación (`/campana`); toda cifra de alcance se etiqueta "estimación, no un resultado garantizado" | Cifras de alcance sin base = claim de alcance implícito |
| Paso 04 "Aparece en Comunidad… etiquetada como verificada" | "Publicación controlada… el equipo Ximo activa la publicación en Marcas y oportunidades" | La comunidad ahora es Discord; "verificada" implicaba aval del producto |
| "Pagar $X MXN y publicar →" / "Tu anuncio se publica… al confirmarse el pago" | "Pagar $X MXN →" / "Tras confirmarse el pago, el equipo Ximo activa la publicación" | El pago no publica automáticamente |
| Estado enviado: "¡Anuncio enviado!" | "Solicitud enviada. Ximo revisará tu anuncio manualmente. Si se aprueba, recibirás un correo para continuar con el pago." | Refleja el flujo real de aprobación→pago |
| Badge "Promocionado" / "Promoción revisada por Ximo" | "Publicidad" + aviso al consumidor ("Ximo no garantiza resultados… relacionados con dichos anuncios") | Etiquetado claro de publicidad (tarea 10) |
| Marcas: badge "Activa" | "Publicidad" | Los anuncios pagados deben identificarse como publicidad |

### Comunidad

| Antes | Después | Motivo |
|---|---|---|
| Feed interno ("Sé el primero en publicar…", "Solo atletas con suscripción activa") | Página "Comunidad Ximo en Discord" con QR, botón y aviso de plataforma externa | Tarea 4: la comunidad vive en Discord |
| Dashboard: "Comparte avances, resuelve dudas y conecta con otros atletas." | "…con otros atletas en nuestro Discord." + CTA "Unirme →" | Coherencia con el nuevo destino |
| Ayuda: "Cómo usar la comunidad — Publica avances…" | "Comunidad en Discord — Únete al canal…" | Ídem |
| Notificaciones: "Respuestas a tus publicaciones y menciones." | "Avisos sobre novedades de la comunidad Ximo." | Ya no hay publicaciones internas |

### Honestidad demo / pagos

| Antes | Después | Motivo |
|---|---|---|
| FAQ ayuda: "¿Necesito una suscripción…? Sí. No hay plan gratuito…" | "Por ahora no. Ximo está en fase demo… no se cobra nada automáticamente." | Contradecía la fase demo real y el resto de la app |
| Registro: un solo checkbox mezclando privacidad + menores | Checkbox de consentimiento con el texto requerido, **checkbox de marketing opcional y separado** (nunca premarcado) y nota específica para menores | LFPDPPP: consentimiento informado y finalidades secundarias opt-in |

### Enlaces y avisos

- Enlaces externos ahora indican "Sitio externo ↗" (SAT/TOEFL, recursos de lecciones,
  Discord, footer de la landing).
- Aviso al consumidor sobre publicidad añadido en `/app/marcas` y `/app/promocionar`
  (texto exacto de la tarea 10).

## Revisado sin cambios (copy ya honesto)

- Landing (`app/page.tsx`) y `_launch`: FAQ ya dice "¿Ximo me garantiza una beca? — No…".
- `/terminos` ya negaba garantías (se reforzó: "no somos agencia, escuela, universidad,
  asesor legal ni financiero, ni reclutador garantizado").
- Cursos, tareas, coaches, universidades, documentos, progreso, SAT/TOEFL: descripciones
  de organización/educación, sin claims.
- Onboarding, estados vacíos y errores: tono claro y honesto.

## Nota

El copy de `admin/moderation` (cola heredada de posts) se conserva; si se elimina la
moderación de contenido interno en el futuro, retirar también esa página.
