# Expansión Internacional — Fase 2: Estrategia de entornos y despliegue seguro

Fecha: 2026-07-10 · Rama: `international-expansion`

## Estado actual (verificado, no asumido)

| Entorno | App | Supabase | Stripe | Resend |
|---|---|---|---|---|
| Local dev | `npm run dev` | ⚠️ **PRODUCCIÓN** (`pqmekjbqbyitkhsgizab`) | TEST (`acct_1ThDX7…`) | key send-only real (sandbox sender) |
| Tests | `npm test` (vitest) | no toca red (lógica pura) | — | — |
| Preview | Vercel preview por rama (esta rama ya genera previews) | ⚠️ producción | ⚠️ LIVE (hereda env de Vercel) | real |
| Producción | ximo.com.mx | producción | LIVE (`acct_1ThDWt3…`) | real |

Verificado hoy además: la `SUPABASE_SERVICE_ROLE_KEY` solo se usa en `lib/supabase/{env,server}.ts` (nunca en código cliente) ✓; secretos de webhook TEST y LIVE ya son distintos ✓.

## Gaps críticos y acciones

1. **Local/preview usan la base de PRODUCCIÓN.** Acción (fundador, ~10 min): crear un segundo proyecto Supabase gratuito "ximo-staging", correr las migraciones 001–009 + `make_admin.sql`, y con eso:
   - `.env.local` pasa a apuntar a staging (datos personales de prod fuera del dev local, como exige el plan).
   - En Vercel, definir las env de **Preview** con las credenciales de staging + Stripe TEST (hoy Preview hereda las de producción). Vercel permite valores por entorno (Production/Preview/Development) en cada variable.
2. **Seed sanitizado:** crear `scripts/seed-staging.mjs` con datos ficticios (pendiente; sin datos reales copiados).
3. **Backups antes de migraciones:** política obligatoria (abajo) + confirmar plan de Supabase (Free no tiene PITR).

## Política de migraciones (vigente desde ya en esta rama)

- Toda migración nueva vive en `supabase/migrations/NNN_*.sql` con **sección `-- DOWN` comentada** al final cuando la reversión sea técnicamente posible (drops destructivos documentan el porqué de su irreversibilidad).
- Antes de aplicar en producción: respaldo manual (Dashboard → Database → Backups, o `pg_dump` con la connection string) y anotar el timestamp en el PR.
- Las migraciones se aplican primero en staging y se corre `npm test` + smoke E2E antes de tocar producción.

## Rollback (runbook)

- **App:** Vercel → Deployments → deployment anterior con estado READY → ⋯ → *Promote to Production* (o `vercel rollback` con CLI). Los deployments previos quedan listados con `isRollbackCandidate`.
- **Env vars:** cada cambio de env se anota en el PR correspondiente; revertir = restaurar el valor anotado y redeploy.
- **Kill switches (sin redeploy de código):** ver abajo — apagar `INTL_EXPANSION_ENABLED` revierte TODO el comportamiento internacional al estado actual MX-only.
- **DB:** restaurar respaldo pre-migración (por eso es obligatorio) o aplicar la sección DOWN de la migración.

## Kill switches (implementados en `lib/intl/killSwitch.ts`, con pruebas)

Todos leen env vars server-side y **fallan a seguro** (sin env ⇒ todo apagado ⇒ la app se comporta exactamente como hoy):

| Env var | Efecto |
|---|---|
| `INTL_EXPANSION_ENABLED` | Interruptor maestro. Apagado = cero comportamiento internacional. |
| `INTL_PAYMENTS_ENABLED` | Pagos fuera de MX (subordinado al maestro). |
| `INTL_ADS_ENABLED` | Flujos de anunciantes fuera de MX (subordinado). |
| `INTL_COMMUNITY_LINK_ENABLED` | Entrada a comunidad/Discord fuera de MX (subordinado). |
| `INTL_PAUSED_COUNTRIES` | Pausa de emergencia por país, CSV ISO-2 (ej. `AR,CL`). `MX` se ignora: la operación viva actual no se apaga por env. |

Reglas de uso (obligatorias para las fases siguientes):
- La decisión final de disponibilidad de cualquier función pagada se verifica **server-side** con estos switches + el estado de lanzamiento del país (config de la Fase 4). Nunca solo con flags de cliente ni botones ocultos.
- Todo país nuevo nace con pagos en OFF; `paid_launch_enabled` requiere todas las compuertas del plan satisfechas.

## Convenciones de commits en esta rama

Commits incrementales por unidad de trabajo (`intl: …`), nunca un mega-commit. Preview de Vercel por push para inspección visual. Merge a main solo tras pasar regresión completa (tests + build + smoke E2E del flujo MX actual, que no debe cambiar).
