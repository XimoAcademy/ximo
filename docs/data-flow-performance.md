# Ximo — Data Flow & Speed Optimization

Goal: avoid slow, repeated data fetching and keep the app fast as it grows.

## Current data flow (today)
- **Server Components** leen datos en cada request vía `lib/data/*` (Supabase).
- **Server Actions** escriben y luego `revalidatePath(...)` refresca la página.
- El **dashboard** hace varias consultas `count` en paralelo (`Promise.all`) — bien.
- **Sin caché explícita** ni índices definidos en migraciones → a escala, las listas y conteos se vuelven lentos.
- Observación real: el primer render tras inactividad tarda ~2–2.5s (arranque en frío de funciones serverless en Vercel); las siguientes ~250–500ms.

## Cuellos de botella esperados al crecer
1. Conteos del dashboard (`select count` por tabla) sin índice por `user_id`.
2. Feed de comunidad y listas (tareas, universidades) ordenadas sin índice.
3. Llamadas repetidas a `getDisplayPrices()` de Stripe (ya mitigado con caché en memoria de 1h).
4. Cold starts de serverless.

## Plan recomendado (de mayor a menor impacto, bajo riesgo)

### 1. Índices en PostgreSQL (lo primero — barato y grande)
Crear índices para los patrones de acceso reales:
```sql
-- por usuario (todas las tablas dueñas)
create index if not exists tasks_user_idx        on public.tasks(user_id);
create index if not exists universities_user_idx on public.universities(user_id);
create index if not exists coaches_user_idx      on public.coaches(user_id);
create index if not exists documents_user_idx    on public.documents(user_id);
create index if not exists emails_user_idx       on public.emails(user_id);
create index if not exists progress_user_idx     on public.progress_entries(user_id);
-- feed de comunidad: aprobados, recientes primero
create index if not exists posts_feed_idx on public.community_posts(moderation_status, created_at desc);
-- tareas pendientes ordenadas por fecha
create index if not exists tasks_due_idx on public.tasks(user_id, status, due_date);
```
**Por qué:** convierte escaneos de tabla en búsquedas por índice; es la mejora #1 de Postgres y casi sin riesgo.

### 2. Caché de Next.js para datos poco cambiantes
- Directorio NCAA, cursos y lecciones cambian poco → cachear con `unstable_cache`/`revalidate` (p. ej. 1h) en vez de leer en cada request.
- Precios de Stripe: ya cacheados 1h (mantener).
**Por qué:** evita recomputar/refetch lo que rara vez cambia.

### 3. Conteos del dashboard más baratos
- Opción A: una sola RPC que devuelva todos los conteos en una consulta.
- Opción B: tabla/vista materializada de "stats por usuario" actualizada por trigger.
**Por qué:** 1 ida a la base en vez de 6.

### 4. Tiempo real sólo donde aporta
- Comunidad/notificaciones pueden usar **Supabase Realtime** (suscripciones) en lugar de recargar.
**Por qué:** UX viva sin polling.

### 5. Trabajos en segundo plano / colas (a futuro)
- Correos (recordatorios), procesamiento de media y futuras tareas pesadas → cola.
- Tool sugerido: **Upstash QStash** o **Vercel Queues/Cron** (ya se usa Cron para recordatorios).
**Por qué:** no bloquear la request del usuario con trabajo lento.

### 6. Precarga y percepción
- `loading.tsx` por segmento (ya existe en `/app`) para feedback inmediato.
- Prefetch de links del sidebar (Next lo hace por defecto en `<Link>`).
- Paginar listas grandes (feed) en vez de traer todo.

### 7. Cold starts
- Mantener funciones ligeras; a escala, considerar región fija cercana a usuarios (MX → `iad1`/`sfo1`) y plan Vercel Pro.

## Qué elegir primero (recomendación)
**Empezar por #1 (índices) y #2 (caché de datos estáticos).** Son los de mayor
impacto, menor riesgo y no cambian la arquitectura. #3–#6 se agregan conforme crezca
el tráfico. Esto mantiene el flujo de datos rápido sin sobre-ingeniería.

> Implementación sugerida: añadir los índices como `supabase/migrations/008_perf_indexes.sql`
> y aplicarlos en el SQL Editor. (No se aplican automáticamente.)
