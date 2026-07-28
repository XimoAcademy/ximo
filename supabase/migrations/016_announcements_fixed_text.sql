-- ════════════════════════════════════════════════════════════════════════
-- 016 — El aviso de directo tiene texto fijo.
--
-- El admin solo elige fecha y hora. El título, la descripción y el link de
-- Discord dejan de usarse: el texto es siempre el mismo y vive en
-- lib/announcements/text.ts. Los atletas ya saben cómo entrar a la
-- comunidad, así que el aviso no lleva enlace.
--
-- Estas columnas NO se eliminan, solo se vuelven opcionales:
--   * Sin NOT NULL, el código nuevo puede insertar sin ellas y el anterior
--     sigue funcionando — así el despliegue y la migración pueden ocurrir en
--     cualquier orden sin romper nada (con DROP habría una ventana en la que
--     el código viejo consultaría columnas inexistentes).
--   * Una vez confirmado que todo va bien en producción, se pueden eliminar
--     en una migración de limpieza aparte.
--
-- Lo mismo aplica a notifications.action_url, creada en la 015 solo para el
-- botón "Unirse" que ya no existe. Queda sin uso, siempre null.
--
-- Idempotente. Probar primero en ximo-staging.
-- ════════════════════════════════════════════════════════════════════════

alter table public.live_announcements alter column title drop not null;
alter table public.live_announcements alter column description drop not null;
alter table public.live_announcements alter column discord_link drop not null;

comment on column public.live_announcements.title is
  'SIN USO desde la 016 — el texto del aviso es fijo (lib/announcements/text.ts).';
comment on column public.live_announcements.description is
  'SIN USO desde la 016 — el texto del aviso es fijo (lib/announcements/text.ts).';
comment on column public.live_announcements.discord_link is
  'SIN USO desde la 016 — el aviso no lleva enlace; los atletas ya conocen la comunidad.';
comment on column public.notifications.action_url is
  'SIN USO desde la 016 — se creó para el botón "Unirse", retirado junto con el enlace.';
