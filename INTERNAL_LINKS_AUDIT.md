# Ximo — Auditoría de enlaces internos

Fecha: 2026-07-07. Se auditaron rutas, sidebar, CTAs, tarjetas, menús, footer y
redirecciones. Cada CTA debe llevar a la página que promete.

## Problemas encontrados y corregidos

| # | Ubicación | Problema | Corrección |
|---|---|---|---|
| 1 | Sidebar (`AppShell.tsx`) | `/app/marcas` (Marcas y oportunidades) no estaba enlazada en ningún menú — página huérfana, y es donde se publican los anuncios aprobados | Añadida al grupo "Oportunidades" como "Marcas" |
| 2 | `lib/data/ads.ts` (admin) | La consulta seleccionaba columnas inexistentes (`budget`, `platform`, `cta_label`, `cta_url`) → la cola de anuncios del admin **siempre quedaba vacía** en silencio | Migración `009_ad_review_flow.sql` crea las columnas; la consulta ahora coincide con el esquema |
| 3 | `/app/promocionar/revision` | CTA "Configurar campaña y pagar" se mostraba también para anuncios **pendientes** (prometía pagar antes de la aprobación) | Solo se muestra con estado `approved_pending_payment` |
| 4 | `/app/promocionar/campana` | Permitía llegar al pago con un anuncio aún en revisión | La página y la acción de pago exigen `approved_pending_payment`; si está pendiente, explica y enlaza a "Estado de revisión" |
| 5 | `/app/promocionar` | "← Volver a Comunidad" y copy "Aparece en Comunidad": los anuncios ya no se publican en la comunidad (ahora es Discord) | Enlaza y describe "Marcas y oportunidades" |
| 6 | `/app/promocionar/preview` | "Ver la comunidad" como destino del anuncio | Ahora "Ver Marcas y oportunidades" (`/app/marcas`) |
| 7 | `/app/comunidad/*` (subrutas) | Al convertir la comunidad en página de Discord, `nuevo`, `post/[id]` y `temas/[topic]` quedaban huérfanas | Eliminadas junto con `Composer`, `PostCard`, `actions.ts` y `lib/data/community*` |
| 8 | Dashboard `/app` | Tarjeta y CTA "Comunidad" describían el feed interno | Copy actualizado a Discord; sigue apuntando a `/app/comunidad` (la puerta a Discord) |
| 9 | Centro de ayuda | Tema "Cómo usar la comunidad" describía publicar posts internos; FAQ afirmaba "No hay plan gratuito" (falso en fase demo) | Tema reescrito hacia Discord; FAQ corregida a la realidad demo + FAQ nueva sobre Discord |
| 10 | Footer legal (landing y `LegalShell`) | Solo enlazaba Términos y Privacidad | Ahora enlaza las 6 páginas legales (términos, privacidad, cookies, política de anuncios, términos anunciantes, reglas de comunidad) |
| 11 | Formulario de anuncio | No enlazaba términos de anunciantes (no existían) | Paso 5 del asistente enlaza `/terminos-anunciantes` y `/politica-de-anuncios` |

## Rutas verificadas como correctas (sin cambios)

- Sidebar: `/app`, `/app/comunidad`, `/app/tareas`, `/app/recruiting`, `/app/directorio`,
  `/app/universidades`, `/app/coaches`, `/app/correos`, `/app/documentos`, `/app/progreso`,
  `/app/cursos`, `/app/sat-toefl`, `/app/promocionar` (+ admin: moderación y anuncios).
- Perfil → Configuración / Facturación / Notificaciones / Ayuda.
- Cursos → curso → lección → certificado (bloqueo secuencial intacto).
- Auth: registro ↔ login ↔ olvidé contraseña ↔ verificación ↔ `/auth/confirm` → `/account-status`.
- Legal: `/privacidad`, `/terminos` + nuevas `/cookies`, `/politica-de-anuncios`,
  `/terminos-anunciantes`, `/reglas-comunidad` (todas accesibles desde footers).
- `app/app/admin/moderation` se conserva (modera contenido heredado); su enlace de vuelta
  y el de `admin/ads` funcionan.

## Verificación

`npm run lint` ✅ · `npm test` (50/50) ✅ · `npm run build` — ver CHANGELOG.
