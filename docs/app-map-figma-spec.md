# Ximo — App Map & Figma-Ready Design Specification

A complete visual scheme of how the app works and what it is for. Two parts:

1. **Live FigJam boards** (auto-generated) — abre y reclama cada uno en tu cuenta
   *(el asiento de Figma actual es "View"; al abrir el enlace lo reclamas/editas):*
   - **Mapa general de la app:** https://www.figma.com/board/Ny50Rjo9Q5htqL1YZqW2cm
   - **Flujo detallado — Auth y Acceso** (cada botón de registro/login/recuperación/suscripción y su ruta): https://www.figma.com/board/dS3iCNq822aoDfnGUmZwSQ
   - **Flujo detallado — Recruiting y contenido** (botones CRUD de Tareas, Universidades, Coaches, Correos, Documentos, Comunidad): https://www.figma.com/board/XZxvuv6VYuReZcZC8OhJOr
   - **Flujo detallado — Desarrollo, oportunidades y cuenta** (Progreso, Cursos, SAT/TOEFL, Promocionar, Perfil, Settings, Billing, Notificaciones, Ayuda, Admin): https://www.figma.com/board/BPcuNbSSDxSSIT0OruwKZN
2. **This implementation guide** — every frame, screen, section, component, button,
   link, and flow arrow specified so a designer can rebuild the high-fidelity UI 1:1.

Pair both with [architecture-graph.md](architecture-graph.md) (Mermaid flows).

> **Purpose of the app (one line):** Ximo organiza el proceso de reclutamiento
> universitario deportivo de atletas mexicanos en un solo lugar.

---

## How to build this in Figma

- **Pages (Figma pages):** `01 Public` · `02 Auth` · `03 App (gated)` · `04 Admin` · `05 Components` · `06 Flows`.
- **Frame size:** Desktop `1440×1024`, Mobile `390×844`. Build desktop first; the app is responsive (Tailwind `sm/lg`).
- **Grid:** 12-col, 72px margin desktop / 16px mobile, 24px gutter.
- **Naming:** `Screen / <Section> / <Name>` for frames; `Comp / <Name>` for components.
- **Flow arrows:** use FigJam or Prototype connections; arrow label = the button/trigger.
- **Tokens (from `app/globals.css`):** colores `--teal` (acento), `--gold` (premium), `--text`, `--surface`; tipografías Geist (texto), Argent/Fraunces (display serif); estilo "liquid glass" en botones (`.ximo-glass-btn`).

---

## Color & component legend
- 🟦 **Teal** = acción primaria · 🟨 **Gold** = premium/destacado · ⬜ **Surface** = tarjetas.
- Componentes base: `Comp/Emblem`, `Comp/GlassButton (teal|gold|dark)`, `Comp/PageHeader`, `Comp/GlassPanel`, `Comp/StatusBadge`, `Comp/InnerTile`, `Comp/FaqItem`, `Comp/Sidebar`, `Comp/ScrollReveal (estado)`.

---

## PAGE 01 — Public (pre-launch)

| Frame | Sección / contenido | Botones → destino |
|---|---|---|
| `Screen/Public/Waitlist` (`/`) | Hero (badge "ximo Academy", título, subtítulo) · 3 tarjetas de valor · Sección waitlist con **iframe Tally** · Footer legal | "Unirme a la primera generación" → ancla `#waitlist` · "Ver cómo nace ximo" → `/build-log` · Footer → `/terminos`, `/privacidad`, `mailto` |
| `Screen/Public/BuildLog` (`/build-log`) | Intro "Detrás de ximo" · 4 tarjetas de plataforma (Instagram, TikTok, YouTube, Zoop) · Bloque "Acceso fundador" | Tarjetas → enlaces externos · "Volver al inicio" → `/` |
| `Screen/Public/Terminos` (`/terminos`) | LegalShell: título, "última actualización", secciones numeradas (incluye **Versión demo**) | Footer → `/privacidad`, `/` |
| `Screen/Public/Privacidad` (`/privacidad`) | LegalShell: Aviso de Privacidad LFPDPPP (responsable, datos, finalidades, ARCO, transferencias, autoridad) | Footer → `/terminos`, `/` |

## PAGE 02 — Auth

| Frame | Sección / contenido | Botones → destino |
|---|---|---|
| `Screen/Auth/Register` (`/register`) | Panel izq (marca, beneficios) · Form: nombre, correo, contraseña, deporte (fijo Natación), país, graduación · **Nota demo** · **Casilla obligatoria Aviso de Privacidad** · CTA | "Crear cuenta" → signUpAction → `/subscribe` o `/verify-email` · "Ya tengo cuenta" → `/login` · links a `/privacidad`,`/terminos` |
| `Screen/Auth/Login` (`/login`) | AuthShell: form correo + contraseña · nota de validación de suscripción | "Entrar" → `/account-status` · "¿Olvidaste tu contraseña?" → `/forgot-password` · "Crear cuenta" → `/register` |
| `Screen/Auth/Forgot` (`/forgot-password`) | Form correo → envía enlace | "Enviar enlace" · volver a `/login` |
| `Screen/Auth/Reset` (`/reset-password`) | Form nueva contraseña + confirmar | "Actualizar" → `/login?reset=1` |
| `Screen/Auth/Verify` (`/verify-email`) | Mensaje "revisa tu correo" + reenviar | "Reenviar" |
| `Screen/Auth/AccountStatus` (`/account-status`) | Pantalla "validando acceso" → enruta según estado | auto → `/app` o `/subscribe` o `/login` |
| `Screen/Auth/Subscribe` (`/subscribe`) | **Demo:** tarjeta "Acceso gratuito" + lista de features + "Entrar al demo gratis". **Pago (post-demo):** tarjetas mensual/anual con precios Stripe en vivo + badge "X meses gratis" | Demo → `activate_subscription` → `/app` · Pago → Stripe Checkout |

## PAGE 03 — App (gated por `requireSubscription`)

Shell común: `Comp/Sidebar` (logo, perfil con avatar, **racha diaria**, grupos de navegación), contenido a la derecha. Grupos del sidebar:

**Principal**
| Frame | Contenido clave | Acciones principales |
|---|---|---|
| `App/Inicio` (`/app`) | Dashboard: saludo, contadores (universidades, coaches, documentos, tareas, progreso), próximas tareas, estado de suscripción | Enlaces a cada sección |
| `App/Comunidad` (`/app/comunidad`) | Feed estilo social, composer, tags, filtros | Publicar (→ moderación) · like · comentar · `/comunidad/nuevo` · `/comunidad/post/[id]` · `/comunidad/temas/[topic]` |
| `App/Tareas` (`/app/tareas`) | Lista de tareas por módulo/prioridad/estado | "+ Nueva tarea" · completar/reabrir/eliminar · `/tareas/[id]` |

**Recruiting**
| `App/Recruiting` (`/app/recruiting`) | Pipeline por etapas | Mover etapa |
| `App/Directorio` (`/app/directorio`) | Directorio NCAA (programas) | `/directorio/[slug]` · agregar a mis universidades |
| `App/Universidades` (`/app/universidades`) | Mis universidades | "+ Agregar" · editar · `/universidades/[id]` |
| `App/Coaches` (`/app/coaches`) | Mis coaches | "+ Agregar coach" · editar · `/coaches/[id]` |
| `App/Correos` (`/app/correos`) | Correos a coaches con plantillas | "+ Redactar" · aplicar plantilla |
| `App/Documentos` (`/app/documentos`) | Documentos del atleta | "+ Agregar" · subir archivo · `/documentos/[id]` |

**Desarrollo**
| `App/Progreso` (`/app/progreso`) | Marcas/tiempos, gráficas SVG, PBs, índice de fortaleza | Registrar marca · toggle curso (SCY/LCM) |
| `App/Cursos` (`/app/cursos`) | Lista de cursos | `/cursos/[courseId]` → `/[lessonId]` → certificado |
| `App/SatToefl` (`/app/sat-toefl`) | Checklists + timeline + recursos externos | Enlaces a Khan/PrepScholar/Magoosh/ETS |

**Oportunidades**
| `App/Promocionar` (`/app/promocionar`) | Onboarding de marca, tipos, formulario de anuncio, simulador de presupuesto | Enviar anuncio → `/revision` · `/campana` (slider presupuesto/duración) · `/preview` |

**Cuenta**
| `App/Settings` (`/app/settings`) | Tema, idioma, notificaciones, cuenta, **exportar datos (ARCO)**, **eliminar cuenta (ARCO)** | Guardar · exportar · eliminar |
| `App/Billing` (`/app/billing`) | Estado de suscripción, plan, detalles | "Gestionar suscripción" (portal Stripe) |
| `App/Notifications` (`/app/notifications`) | Lista + preferencias | Marcar leído · preferencias |
| `App/Perfil` (`/app/perfil`) | Datos deportivos/académicos, avatar | Guardar · cambiar foto · ⚙ → `/app/settings` |
| `App/Help` (`/app/help`) | Temas + FAQ + contacto soporte | `mailto:ximoacademy@gmail.com` |

## PAGE 04 — Admin (solo rol admin)
| `Admin/Moderation` (`/app/admin/moderation`) | Cola de moderación de contenido | Aprobar / ocultar / rechazar |
| `Admin/Ads` (`/app/admin/ads`) | Revisión de anuncios de marca | Aprobar / rechazar |

---

## PAGE 06 — Master user flow (the spine)

```
Waitlist (/)
   └─(lanzamiento)→ Register ──aceptar Aviso──> Sign up
                                  │
                Login ───────────►│
                                  ▼
                           Account-status
                                  ▼
                    ¿suscripción activa? ──No──► Subscribe ──(demo: gratis)──► App
                                  │ Sí                       └─(pago: Stripe)─► App
                                  ▼
                                 App (Inicio)
                                  ├─ Comunidad · Tareas
                                  ├─ Recruiting · Directorio · Universidades · Coaches · Correos · Documentos
                                  ├─ Progreso · Cursos · SAT/TOEFL
                                  ├─ Promocionar marca
                                  └─ Perfil · Billing · Notificaciones · Settings · Help
```

Cada pantalla del grupo App comparte el `Comp/Sidebar`; las acciones de creación abren
formularios in-place (Server Actions) y vuelven a la lista al guardar.
