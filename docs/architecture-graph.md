# Ximo — Internal Connection Graph

Everything connected inside Ximo: frontend, backend, database, auth, APIs, storage,
user flows, security layers, policies, and future infrastructure. Rendered with
Mermaid (GitHub renders these natively).

## 1. System architecture

```mermaid
flowchart TB
  subgraph Client["🌐 Cliente (navegador / móvil)"]
    Visitor["Visitante"]
    Athlete["Atleta autenticado"]
  end

  subgraph Vercel["▲ Vercel (hosting serverless)"]
    direction TB
    Proxy["proxy.ts<br/>(refresca sesión Supabase)"]
    subgraph Next["Next.js 16 App Router"]
      Public["Páginas públicas<br/>/ (waitlist) · /login · /register<br/>/subscribe · /terminos · /privacidad · /build-log"]
      Gated["App protegida /app/*<br/>(layout: requireSubscription + touchDailyStreak)"]
      SA["Server Actions<br/>(app/**/actions.ts)"]
      RH["Route Handlers<br/>/api/webhooks/stripe<br/>/api/cron/reminders · /api/health"]
    end
    Cron["Vercel Cron → /api/cron/reminders"]
  end

  subgraph Supabase["🟢 Supabase"]
    Auth["Auth (sesiones, JWT)"]
    DB[("PostgreSQL + RLS")]
    Storage["Storage buckets<br/>avatars · documents · post-media<br/>lesson-videos · brand-ads"]
    RPC["RPC activate_subscription()"]
  end

  subgraph External["☁️ Servicios externos"]
    Stripe["Stripe (suscripciones)"]
    Resend["Resend (correo)"]
  end

  Visitor --> Public
  Athlete --> Gated
  Client --> Proxy --> Next
  Public --> SA
  Gated --> SA
  SA -->|lee/escribe con RLS| DB
  Gated -->|Server Components| DB
  SA --> Auth
  SA --> Storage
  SA --> RPC --> DB
  Stripe -->|webhook firmado| RH
  RH -->|service role| DB
  Cron --> RH --> Resend
  SA -.->|checkout| Stripe
  Auth --> DB
```

## 2. Authentication & access flow

```mermaid
flowchart TD
  Start([Usuario llega]) --> Reg{¿Tiene cuenta?}
  Reg -->|No| Register["/register<br/>+ casilla Aviso de Privacidad (obligatoria)"]
  Register --> Consent{¿Aceptó aviso?}
  Consent -->|No| RegErr["Error: debe aceptar"] --> Register
  Consent -->|Sí| SignUp["signUpAction → Supabase Auth<br/>(guarda consentimiento + versión)"]
  SignUp --> Confirm{¿Confirmación de correo?}
  Confirm -->|ON| Verify["/verify-email"] --> Login
  Confirm -->|OFF| Sub
  Reg -->|Sí| Login["/login → signInAction"]
  Login --> Status["/account-status (valida acceso)"]
  Status --> Gate{¿Suscripción activa?}
  Gate -->|No| Sub["/subscribe"]
  Sub --> Demo{¿Modo demo?}
  Demo -->|Sí| Free["Entrar al demo gratis<br/>activate_subscription()"]
  Demo -->|No| Pay["Stripe Checkout → webhook"]
  Free --> App
  Pay --> App
  Gate -->|Sí| App["/app (dashboard)"]
```

## 3. Payment flow (post-demo)

```mermaid
sequenceDiagram
  participant U as Usuario
  participant A as App (Server Action)
  participant S as Stripe
  participant W as /api/webhooks/stripe
  participant DB as Supabase (service role)
  U->>A: Clic "Suscribirme"
  A->>S: createCheckoutSession()
  S-->>U: Página de pago hospedada
  U->>S: Paga (tarjeta)
  S->>W: checkout.session.completed (firmado)
  W->>W: Verifica firma + idempotencia
  W->>DB: upsert subscriptions = active
  DB->>DB: trigger espeja a profiles
  U->>A: Vuelve a /subscribe?checkout=success
  A->>DB: Poll estado → active → /app
```

## 4. Security & policy layers

```mermaid
flowchart LR
  subgraph Edge["Borde"]
    P["proxy.ts (sesión)"]
    RL["Rate limit (Supabase Auth + recomendado: capa propia)"]
  end
  subgraph AppLayer["Aplicación"]
    G["requireSubscription (gate)"]
    V["Validación en Server Actions"]
    Mod["Moderación de contenido (lib/moderation)"]
  end
  subgraph DataLayer["Datos"]
    RLS["RLS por fila (cada usuario sólo lo suyo)"]
    TR["Triggers guard (no auto-admin / no auto-activar)"]
    SR["Service role sólo en servidor"]
  end
  subgraph Policies["Políticas"]
    Priv["Aviso de Privacidad (LFPDPPP)"]
    Terms["Términos (demo)"]
    ARCO["Derechos ARCO (export / borrar cuenta)"]
  end
  Edge --> AppLayer --> DataLayer
  Policies -.-> AppLayer
```

## 5. Future infrastructure (scaling path)

```mermaid
flowchart LR
  Now["HOY (demo)<br/>Vercel Hobby/Pro + Supabase Free/Pro"]
  Grow["CRECIMIENTO<br/>Supabase Pro + Vercel Pro<br/>+ caché + índices"]
  Scale["ESCALA<br/>Supabase Team/dedicado<br/>+ CDN + colas/jobs<br/>+ réplicas de lectura"]
  Now --> Grow --> Scale
```

Ver detalle en [infrastructure-scaling.md](infrastructure-scaling.md), seguridad en
[security-plan.md](security-plan.md), y rendimiento en [data-flow-performance.md](data-flow-performance.md).
