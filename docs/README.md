# Ximo — Documentation

Project docs and deliverables. Start with the [main README](../README.md) for setup.

## Product & design
- [Problem · Process · Solution](problem-process-solution.md) — el porqué de Ximo (para inversionistas/colaboradores).
- [App Map & Figma-Ready Spec](app-map-figma-spec.md) — cada pantalla, sección, botón y flujo.
- [Function Objectives](function-objectives.md) — objetivo corto de cada función.

## Architecture & engineering
- [Architecture / Connection Graph](architecture-graph.md) — Mermaid: todo lo conectado en la app.
- [Tools & Stack](tools-and-stack.md) — cada herramienta: por qué, ajuste, vs. alternativas, veredicto.
- [Data Flow & Performance](data-flow-performance.md) — plan para mantener la app rápida.
- [Security Plan](security-plan.md) — qué ya existe y plan de endurecimiento priorizado.
- [Infrastructure & Scaling](infrastructure-scaling.md) — almacenamiento/servidor a futuro (investigado).

## Operations
- [Database plan](database-plan.md)
- [Launch checklist](launch-checklist.md)

## Estado actual
- **Demo gratuito** (sin cobros). Registro pide aceptar el Aviso de Privacidad (casilla obligatoria, LFPDPPP) y **no** pide teléfono.
- Pagos integrados con Stripe (modo test); el modo de pago se activa con `NEXT_PUBLIC_DEMO_MODE=false`.
- Migraciones pendientes de aplicar en Supabase: `007_daily_streak.sql` (aplicada), `008_perf_indexes.sql` (opcional, rendimiento).

## Marco legal (México) — referencias del Aviso de Privacidad / consentimiento
- LFPDPPP vigente (publicada el 20 de marzo de 2025, en vigor el 21 de marzo de 2025): el aviso debe estar disponible al recabar datos y el consentimiento debe registrarse (método: casilla/checkbox).
- Fuentes: [Hogan Lovells — nueva LFPDPPP](https://www.hoganlovells.com/es/publications/mexicos-new-federal-data-protection-law-what-it-means-for-companies) · [BASHAM](https://basham.com.mx/en/nueva-ley-federal-de-proteccion-de-datos-personales-en-posesion-de-los-particulares-publicada-en-el-diario-oficial-de-la-federacion/) · [Guía INAI de obligaciones (PDF)](https://home.inai.org.mx/wp-content/uploads/Guia_obligaciones_lfpdppp_junio2016.pdf)
