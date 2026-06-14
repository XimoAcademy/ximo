# Ximo — Future Storage & Server / Scaling Plan

Web-researched recommendation for storage, processing power and scaling, matched to
what Ximo actually is: a Next.js + Supabase + Stripe subscription app for Mexican
athletes. Sources at the bottom.

## What Ximo needs as it grows
- **PostgreSQL** relacional (datos muy relacionados) — no NoSQL.
- **Auth** integrada y **Storage** de archivos (avatares, documentos, media de anuncios, videos de cursos).
- **Hosting** de Next.js (serverless) con buen DX y deploy desde GitHub.
- **Costo predecible**, **seguridad fuerte**, y **ruta de migración** clara.

## Recommended path (stay on the current stack, scale it)

### Etapa 1 — Demo / lanzamiento (HOY)
- **Supabase Free/Pro** + **Vercel Hobby/Pro**.
- Supabase Free: 500 MB DB, 1 GB storage, 50k usuarios activos/mes — suficiente para demo.
- Subir a **Supabase Pro ($25/mes)** al lanzar: 8 GB disco incluido, backups, sin pausa por inactividad, soporte de PITR.
- **Acción:** aplicar índices (`008_perf_indexes.sql`) y caché (ver performance doc).

### Etapa 2 — Crecimiento (miles de usuarios)
- **Supabase Pro** con facturación por uso: disco extra ~$0.125/GB-mes, egress 250 GB incluidos luego ~$0.09/GB.
- **Vercel Pro (~$20/asiento)**: 1 TB de ancho de banda incluido; vigilar overage ($0.15/GB).
- Añadir **caché (Upstash Redis)** y **colas (Upstash QStash)** para correos/jobs.
- **Storage de archivos:** Supabase Storage es suficiente; para videos de cursos pesados, considerar **Cloudflare R2** (egress gratis) o **Bunny CDN** para servir video barato.

### Etapa 3 — Escala (decenas de miles+)
- **Supabase Team ($599/mes)** o **dedicado/Enterprise**: réplicas de lectura, replicación regional, cómputo dedicado.
- **CDN/WAF** delante (Cloudflare) para ancho de banda y seguridad.
- Mantener Postgres pero separar cargas pesadas a colas/workers.

## Comparativa de opciones

| Necesidad | Recomendado | Alternativas | Por qué el recomendado |
|---|---|---|---|
| DB + Auth + Storage | **Supabase** | Firebase (NoSQL), Neon/PlanetScale (sólo DB), backend propio | Postgres relacional + auth + storage + RLS en uno; encaja con datos relacionales de Ximo |
| Hosting app | **Vercel** | Netlify, Cloudflare Pages, VPS | Cero-config con Next.js, deploy desde GitHub, CDN; mejor DX para lanzar |
| Caché | **Upstash Redis** | Redis Cloud, Momento | Serverless, pago por uso, encaja con Vercel |
| Colas/jobs | **Upstash QStash / Vercel Cron** | BullMQ+Redis, AWS SQS | Sin servidor que mantener |
| Video/archivos a escala | **Cloudflare R2 / Bunny** | S3+CloudFront, Supabase Storage | Egress barato/gratis para servir media |
| Pago local MX (futuro) | **Mercado Pago / Conekta** | PayPal | OXXO/SPEI, conversión local |

## Lógica de costo
- **Hoy:** ~$0 (free tiers). **Lanzamiento:** ~$25 (Supabase Pro) + ~$20 (Vercel Pro) ≈ **$45/mes**.
- El costo crece con **tamaño de DB, storage y ancho de banda**, no con "número de features" — predecible.
- A escala: **Reserved Instances / planes anuales** dan 30–70% de descuento; mover video a R2/Bunny corta el mayor costo de egress.

## Ruta de migración (si algún día se sale de Supabase/Vercel)
1. Supabase es **PostgreSQL estándar** → exportable a cualquier Postgres gestionado (RDS, Cloud SQL, Neon) con `pg_dump`.
2. Next.js corre en cualquier lado (Node) → portable a Render, Railway, Fly.io o un contenedor.
3. Storage (S3-compatible) → migrable a R2/S3 con copia de objetos.
> Conclusión: el stack actual **no genera lock-in fuerte**; se puede escalar dentro de Supabase/Vercel por mucho tiempo y migrar pieza por pieza si hiciera falta.

## Recomendación final
**Quedarse en Supabase + Vercel y escalar por etapas.** Es la opción que mejor encaja
con Ximo: rápida de operar, segura (RLS), predecible en costo, y con salida limpia.
Optimizar primero con índices y caché (gratis) antes de pagar más infraestructura.

---

### Fuentes
- [Supabase Pricing (UI Bakery)](https://uibakery.io/blog/supabase-pricing) · [Supabase pricing real costs (DesignRevision)](https://designrevision.com/blog/supabase-pricing) · [Supabase pricing guide (Cotera)](https://cotera.co/articles/supabase-pricing-guide)
- [Vercel pricing 2026 at scale (Waymaker)](https://www.waymakeros.com/learn/vercel-pricing-2026-real-cost-at-scale) · [Vercel cost optimization (FocusReactive)](https://focusreactive.com/vercel-cost-optimization/)
- [Best SaaS hosting 2026 (HostAdvice)](https://hostadvice.com/vps/saas-hosting/) · [Scalable backend hosting (Back4App)](https://www.back4app.com/scalable-backend-hosting-for-web-apps)
