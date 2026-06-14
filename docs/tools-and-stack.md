# Ximo — Tools, Frameworks & Services

For each tool: **why used**, **why it fits Ximo**, **why chosen over alternatives**,
and a verdict: **Keep / Replace / Improve**.

## Core framework

### Next.js 16 (App Router, Server Actions, Turbopack)
- **Why:** Un solo proyecto para frontend + backend (Server Components, Server Actions, Route Handlers).
- **Fit:** Equipo chico/solo; menos piezas que mantener; SSR rápido y SEO para la landing.
- **Vs. alternativas:** React SPA + API Express aparte (más infra y código); Remix (similar, menor ecosistema); Astro (menos apto para app con mucho estado).
- **Verdict:** **Keep.** Es la base correcta. *Nota:* esta versión renombra `middleware`→`proxy`; documentado en AGENTS.md.

### React 19 + TypeScript
- **Why:** UI por componentes; tipos que previenen errores.
- **Fit:** App con muchas pantallas y formularios; el tipado paga a largo plazo.
- **Vs.:** Vue/Svelte (válidos, menor integración con Next); JS sin tipos (más bugs).
- **Verdict:** **Keep.**

## Estilos

### Tailwind v4 + design system propio (`app/globals.css`)
- **Why:** Estilizado rápido y consistente; tokens y efecto "liquid glass" propios.
- **Fit:** Identidad visual fuerte (teal/dorado, serif Argent) sin librería de UI pesada.
- **Vs.:** MUI/Chakra (imponen su estética, bundle grande); CSS plano (menos consistente).
- **Verdict:** **Keep.** *Improve:* extraer tokens repetidos a variables/clases para reducir estilos inline.

## Backend de datos

### Supabase (PostgreSQL + Auth + Storage + RLS)
- **Why:** Base de datos relacional + autenticación + almacenamiento + seguridad por fila, gestionado.
- **Fit:** Datos muy relacionales (atleta→universidades→coaches→correos); RLS da multi-tenant seguro sin escribir un backend de permisos.
- **Vs.:** Firebase (NoSQL, peor para datos relacionales); backend propio con Postgres (más trabajo de auth/infra); PlanetScale (sin auth/storage integrados).
- **Verdict:** **Keep.** La elección más fuerte del stack. *Improve:* aplicar migraciones desde CI y añadir índices (ver performance doc).

## Pagos

### Stripe (suscripciones + webhook)
- **Why:** Cobros recurrentes, checkout hospedado, portal de cliente.
- **Fit:** Modelo de suscripción mensual/anual; Stripe opera en México (MXN/USD).
- **Vs.:** Mercado Pago/Conekta (fuertes en MX para OXXO/SPEI, considerar a futuro para pago local); PayPal (peor para suscripciones SaaS).
- **Verdict:** **Keep** para tarjeta. *Improve a futuro:* evaluar Mercado Pago/Conekta para métodos locales (OXXO/SPEI) si el público lo pide.

## Correo

### Resend
- **Why:** Correo transaccional simple por API.
- **Fit:** Recordatorios y avisos; volumen bajo al inicio.
- **Vs.:** SendGrid/Postmark (válidos, más config); SES (más barato a escala, más setup).
- **Verdict:** **Keep** ahora. *Improve a escala:* reconsiderar SES por costo si el volumen crece mucho.

## Hosting

### Vercel
- **Why:** Deploy automático de Next.js desde GitHub; funciones serverless; CDN.
- **Fit:** Cero-config con Next; preview por rama; ideal para lanzar rápido.
- **Vs.:** Netlify (similar); Cloudflare Pages/Workers (más barato a escala, más fricción con Next); VPS propio (más control, más mantenimiento).
- **Verdict:** **Keep** para demo/lanzamiento. *Watch:* costos de ancho de banda a escala (ver infrastructure doc).

## Testing / tooling
- **Vitest** — unit tests rápidos. **Keep.**
- **ESLint + eslint-config-next** — calidad/consistencia. **Keep.** *Improve:* limpiar las ~98 advertencias gradualmente.
- **Scripts QA propios** (`scripts/`) — E2E de pagos, crawler de links, timing. **Keep** (gran valor de QA).

## Dependencias (package.json) — todas en uso
`@supabase/ssr`, `@supabase/supabase-js`, `next`, `react`, `react-dom`, `resend`,
`stripe` (prod) — sin paquetes muertos detectados. Dev: tailwind/postcss, types,
eslint, typescript, vitest. **Veredicto general: sin dependencias que eliminar.**

## Resumen de veredictos
| Herramienta | Veredicto |
|---|---|
| Next.js, React, TypeScript | Keep |
| Tailwind + design system | Keep · Improve (tokens) |
| Supabase | Keep (núcleo) · Improve (índices/CI) |
| Stripe | Keep · Improve (métodos locales MX a futuro) |
| Resend | Keep · Improve (SES a escala) |
| Vercel | Keep · Watch (ancho de banda) |
| Vitest / ESLint / scripts QA | Keep |
