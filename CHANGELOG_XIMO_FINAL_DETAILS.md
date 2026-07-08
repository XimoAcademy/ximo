# CHANGELOG — Ximo: detalles finales (auditoría + flujo de anuncios + legal MX)

Fecha: 2026-07-07 · Rama: `main` (sin commit; working tree)

## 1. Auditoría de textos (TEXT_AUDIT.md)
- Eliminado todo copy tipo "garantizada/garantiza" fuera de contexto legal; el flujo de
  anuncios ya no promete publicación ni alcance; cifras de alcance marcadas como estimación.
- FAQ de ayuda corregida (fase demo, no "no hay plan gratuito").
- Etiquetado "Publicidad" en anuncios (marcas, preview) + aviso al consumidor.

## 2. Enlaces externos (EXTERNAL_LINKS_AUDIT.md)
- Inventario completo; recursos SAT/TOEFL verificados vivos y gratuitos/oficiales.
- `rel="noopener noreferrer"` en todos los `target="_blank"`; pistas "Sitio externo ↗".
- Discord configurable vía `NEXT_PUBLIC_DISCORD_INVITE_URL`.

## 3. Enlaces internos (INTERNAL_LINKS_AUDIT.md)
- `/app/marcas` añadida al sidebar (estaba huérfana).
- Bug real corregido: la cola admin de anuncios consultaba columnas inexistentes y siempre
  quedaba vacía (migración 009 la arregla).
- CTAs de pago de campaña ya no aparecen para anuncios sin aprobar.

## 4. Comunidad → Discord
- `/app/comunidad` es ahora "Comunidad Ximo en Discord": QR centrado (placeholder hasta
  subir `/public/discord-qr.png`), botón "Entrar al Discord de Ximo" (deshabilitado como
  "Discord invite pendiente" sin env var), aviso de plataforma externa y enlace a reglas.
- Eliminado el social interno: `comunidad/nuevo`, `comunidad/post/[id]`, `comunidad/temas`,
  `Composer`, `PostCard`, `comunidad/actions.ts`, `lib/data/community*.ts`.
- `admin/moderation` se conserva para contenido heredado (candidato a retirar después).
- Las tablas de posts/comentarios en la BD no se tocaron (solo dejó de usarse la UI).

## 5. Legal México
- Nuevas páginas: `/cookies`, `/politica-de-anuncios`, `/terminos-anunciantes`,
  `/reglas-comunidad` (contenido original en español, LFPDPPP/PROFECO-aware).
- `/privacidad` ampliada: responsable "Ximo Academy" + contacto, placeholder
  `[Agregar domicilio fiscal/RFC antes de lanzamiento]`, categorías de datos completas
  (cuenta, perfil de atleta, académico/recruiting, actividad, publicidad, pagos, técnicos),
  sección de datos sensibles (no se recaban; consentimiento expreso si algún día aplica),
  finalidades primarias vs. marketing opt-in, encargados + plataformas externas (Discord),
  conservación/eliminación, ARCO vía ximoacademy@gmail.com, cambios notificados.
- `/terminos` actualizado: Ximo no es agencia/escuela/asesor/reclutador garantizado; sin
  garantía de becas/admisiones/patrocinios/desempeño de anuncios; responsabilidad del
  usuario sobre datos y derechos de contenido; Discord externo; aviso previo a cobros.
- Registro: checkbox "He leído y acepto el Aviso de Privacidad y los Términos de Ximo",
  **checkbox de marketing opcional y separado** (guardado en metadata `marketing_opt_in`),
  nota para menores con el texto requerido.
- Footers (landing + LegalShell) enlazan las 6 páginas legales.

## 6–7. Cursos listos para video + quizzes
- `courseData.ts`: `Lesson` ahora acepta `order`, `videoUrl`, `thumbnail`,
  `status` ("coming_soon"/"published"), `resources`, `quizId` + helper `sortedLessons()`.
  TODOs indican dónde pega Manuel cada video (bucket `lesson-videos` o YouTube/Vimeo).
- `quizData.ts` nuevo: tipos `Quiz`/`QuizQuestion` (quizId, lessonId, questions, options,
  correctAnswer, explanation, passingScore), registro vacío con ejemplo comentado.
- `LessonPlayer`: reproduce video real cuando `status="published"` (YouTube/Vimeo → iframe,
  mp4 → `<video controls poster>`); placeholder honesto si no; recursos desde el registro
  (con "sitio externo" cuando aplica); quiz UI solo si existen datos de quiz, con
  calificación local y "Reintentar". Bloqueo/desbloqueo secuencial intacto.

## 8. Logo en loaders
- `app/app/loading.tsx`: medallón 128→138 px (llena el anillo interior ≈142 px).
- `app/loading/page.tsx`: medallón 176→`clamp(160px, 90%, 192px)` (anillo ≈196 px),
  centrado y responsivo, sin distorsión (mismo recorte del emblema).

## 9. Racha diaria
- La lógica ya era correcta (día calendario de Ciudad de México, YYYY-MM-DD, idempotente,
  sin ventana móvil de 24 h; activación al abrir la app vía layout). Se extrajo la función
  pura `advanceStreak()` y se añadieron 13 pruebas (`lib/data/streak.test.ts`).
- La migración `007_daily_streak.sql` ya está aplicada en producción.

## 10–13. Flujo de anuncios con revisión manual (cambio central)
Estados nuevos (migración `009_ad_review_flow.sql`):
`pending → approved_pending_payment → paid_ready_to_publish → approved` (o `rejected`).
Solo `approved` es visible para atletas (RLS sin cambios).

- **Asistente de 5 pasos** en `/app/promocionar`: 1) datos del anunciante (marca, contacto,
  correo, teléfono opcional, sitio/red), 2) archivo (tipos y tamaño máx. visibles, preview),
  3) campaña (título, descripción, link destino, rango de presupuesto, audiencia, fechas),
  4) revisión con resumen + "estimación, no resultado garantizado" y sin pago, 5) checkbox
  de derechos (texto exacto requerido) + enlaces legales + "Enviar solicitud a revisión".
- **Envío**: valida, guarda como `pending` y **manda correo con todos los detalles + link del
  archivo a `XIMO_REVIEW_EMAIL` (default ximoacademy@gmail.com)** vía Resend
  (`lib/email/advertiser.ts`; null-safe sin API key). El anunciante no redacta ningún correo.
- **Admin** (`/app/admin/ads`): muestra contacto completo, archivo, presupuesto, audiencia y
  estado. "Aprobar anuncio" → `approved_pending_payment` + correo "Tu anuncio fue aprobado
  en Ximo" con botón de pago (campana con Stripe; si no hay Stripe, usa
  `PAYMENT_LINK_PLACEHOLDER` o texto "te contactaremos", TODO). "Rechazar anuncio" →
  `rejected` + correo "Resultado de revisión de anuncio en Ximo" (sin pago).
- **Pago**: `/app/promocionar/campana` y su acción exigen `approved_pending_payment`
  (antes se podía pagar un anuncio pendiente). El webhook de Stripe ya **no publica**:
  marca `paid_ready_to_publish` y crea la campaña como `scheduled`.
- **Publicación final manual**: botón "Publicar anuncio" (admin) pasa a `approved` y activa
  la campaña. Nada se publica automáticamente; nadie paga sin aprobación.
- Correos promocionales: opt-out existente (Notificaciones) documentado en la política.

## 14. Verificación
- `npm test`: 50/50 ✅ (incluye pruebas nuevas de racha)
- `npm run lint`: ✅ (se corrigió de paso un error preexistente `react-hooks/refs` en
  `SnakeCanvas.tsx` — asignaba un ref dentro de `useMemo`; sin cambio visual)
- `npm run build`: ✅ (todas las rutas nuevas presentes: /cookies, /politica-de-anuncios,
  /terminos-anunciantes, /reglas-comunidad, /app/marcas, /app/comunidad)
- Sin garantías falsas, sin pago simulado como real (Stripe solo si está configurado),
  sin correos fingidos (Resend null-safe: si no hay API key, simplemente no envía).

## Actualización 2026-07-08 — pendientes resueltos en esta sesión

1. ✅ **Migración 009 APLICADA en producción** (vía SQL Editor de Supabase, verificada:
   7 columnas nuevas en `brand_ads`, 2 en `brand_profiles`, constraint de 5 estados).
2. ✅ **Discord listo**: invite oficial `https://discord.gg/fbz3Zyryf9` (verificado vivo,
   servidor "Ximo"). QR real generado y verificado por ida y vuelta en
   `/public/discord-qr.png`. El invite quedó como fallback en el código de
   `/app/comunidad` (y en `.env.local`), así producción funciona sin tocar Vercel;
   `NEXT_PUBLIC_DISCORD_INVITE_URL` sigue pudiendo sobreescribirlo.
3. ⚠️ **Resend — requiere 2 minutos tuyos** (no puedo crear cuentas ni iniciar sesión por ti):
   a) entra a resend.com → "Log in with Google" con ximoacademy@gmail.com; b) crea un
   API key y pégalo en `RESEND_API_KEY` (en `.env.local` y en Vercel), con
   `EMAIL_FROM="Ximo <onboarding@resend.dev>"` para pruebas. **Limitación real**: sin un
   dominio propio verificado, Resend solo entrega a TU correo — suficiente para el aviso
   de "nueva solicitud" a ximoacademy@gmail.com, pero los correos a anunciantes externos
   necesitan un dominio verificado (comprar dominio → DNS en Resend → EMAIL_FROM de ese
   dominio). Todo el código ya está listo; solo falta la llave.
4. ✅ **Privacidad**: el placeholder visible de RFC/domicilio se sustituyó por texto
   presentable ("domicilio y datos fiscales a solicitud vía correo") con TODO en código
   para insertar el domicilio fiscal/RFC reales — dato que solo tú puedes proporcionar.
   Las 6 páginas legales pasaron una revisión final de coherencia LFPDPPP (responsable,
   categorías, finalidades, ARCO, revocación, transferencias, menores, conservación,
   cambios). Nota honesta: esto no sustituye la revisión de un abogado titulado.

## Pendiente restante

- Cuenta Resend + API key (pasos arriba) y, para correos a anunciantes, dominio propio.
- Claves de Stripe LIVE cuando se cobre de verdad (test funciona).
- Verificar a mano TikTok/YouTube del footer.
- Subir videos de lecciones y (opcional) quizzes en `courseData.ts` / `quizData.ts`.
- Revisión de abogado de las páginas legales; añadir RFC/domicilio fiscal real.
- Los cambios siguen SIN commit — revisar `git status` y hacer commit/push para desplegar.
