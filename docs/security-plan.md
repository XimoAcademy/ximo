# Ximo — Security Plan

Based on the current stack (Next.js + Supabase + Stripe + Vercel). Split into
**what already exists** and a **prioritized hardening plan**.

## What's already in place ✅
- **Row Level Security (RLS)** en todas las tablas — cada usuario sólo ve/edita lo suyo (verificado en QA).
- **Guard triggers** — el usuario no puede auto-asignarse `admin` ni auto-activar suscripción.
- **Service role sólo en servidor** — la llave que ignora RLS nunca llega al navegador.
- **Webhook de Stripe firmado + idempotente** — verifica firma y deduplica eventos.
- **Moderación de contenido** — las publicaciones pasan por revisión antes de mostrarse.
- **Secrets fuera del repo** — `.env.local` en `.gitignore`; verificado que no hay llaves en el código.
- **Confirmación de correo + reset de contraseña** seguros (no filtran si el correo existe).
- **Consentimiento de privacidad** registrado en el alta (LFPDPPP).

## Hardening plan (priorizado)

### P0 — Antes/junto al lanzamiento de pago
1. **Rate limiting** en endpoints sensibles (login, registro, reset, webhook, formularios).
   - Tool: **Upstash Redis + @upstash/ratelimit** (serverless, encaja con Vercel) o el rate-limit nativo de Supabase Auth (ya cubre auth básico).
   - Por qué: frena fuerza bruta y abuso de formularios.
2. **Cabeceras de seguridad** (en `next.config.ts`): `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`.
   - Por qué: mitiga XSS, clickjacking, sniffing. Bajo esfuerzo, alto impacto.
3. **Validación de entradas con esquema** (Zod) en cada Server Action.
   - Por qué: hoy la validación es manual; Zod la hace consistente y tipada.
4. **Verificación de webhooks** ya existe — mantener y monitorear reintentos.

### P1 — Robustez
5. **WAF / protección de bots:** activar **Vercel Firewall/Attack Challenge Mode** y/o **Cloudflare** delante del dominio.
   - Por qué: bloquea DDoS y scraping; escalable.
6. **MFA/2FA opcional** para cuentas (Supabase Auth soporta TOTP).
7. **Captcha** en registro/login (hCaptcha/Turnstile) si aparece abuso.
8. **Storage:** confirmar políticas por bucket (privados realmente privados — ya verificado), límites de tamaño y tipos MIME en subidas.

### P2 — Operación y cumplimiento
9. **Logging & monitoring:** **Sentry** (errores), **Vercel Analytics/Logs**, alertas en Stripe (pagos fallidos) y Supabase (uso/errores).
10. **Auditoría de accesos admin** — registrar acciones de moderación/aprobación.
11. **Backups de base de datos** — habilitar PITR (Point-in-Time Recovery) en Supabase Pro.
12. **Rotación de llaves** y principio de menor privilegio; nunca llaves Live en el chat/cliente.
13. **Cumplimiento LFPDPPP** — derechos ARCO ya implementados (export/borrar); mantener el registro de consentimiento versionado.

## Capas de seguridad (resumen visual)
```
Internet
  │  Cloudflare/Vercel Firewall (WAF, anti-DDoS, bots)        ← P1
  ▼
Vercel Edge (HTTPS, security headers)                          ← P0 #2
  │  proxy.ts (sesión), rate limiting                          ← P0 #1
  ▼
Server Actions / Route Handlers (validación Zod, auth check)   ← P0 #3
  │  service role sólo server-side
  ▼
Supabase: RLS por fila + guard triggers + Storage policies     ← ya existe
  │  PITR backups                                              ← P2 #11
  ▼
Observabilidad: Sentry + logs + alertas Stripe/Supabase        ← P2 #9
```

## Herramientas recomendadas (fuertes y escalables)
| Necesidad | Recomendación | Por qué |
|---|---|---|
| Rate limiting | Upstash Redis + @upstash/ratelimit | Serverless, encaja con Vercel, barato |
| WAF / anti-DDoS | Cloudflare o Vercel Firewall | Escala, estándar de industria |
| Validación | Zod | Tipado, consistente con TS |
| Errores/monitoring | Sentry | Estándar, alertas tempranas |
| Bot/captcha | Cloudflare Turnstile | Gratis, sin fricción |
| Secrets | Vercel Env + rotación | Ya en uso; formalizar rotación |
| Backups | Supabase PITR (Pro) | Recuperación ante desastres |
