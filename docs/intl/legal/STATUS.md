# Tracker legal por país — Expansión Ximo

Estados posibles (del plan): research_required → legal_research_complete → legal_draft_complete →
local_counsel_review_required → local_counsel_approved → privacy_approved → minors_flow_approved →
tax_review_required → tax_approved → payments_tested → provider_approved → content_localized →
support_ready → security_approved → free_beta_enabled → paid_launch_enabled · paused · unavailable

**Cuba y Venezuela: excluidos permanentemente (no agregar, no publicitar, no activar).**
Elegibilidad SIEMPRE por país de residencia actual + estado de lanzamiento, nunca por nacionalidad.

| País | ISO | Locale | Moneda candidata* | Estado | Ancla normativa inicial (verificar vigencia) |
|---|---|---|---|---|---|
| Argentina | AR | es-AR | ARS | legal_research_complete (1ª pasada — [AR.md](AR.md)) | Ley 25.326 de datos personales y reglamentos |
| Bolivia | BO | es-BO | BOB | research_required | SIN ley integral privada confirmada; verificar marco constitucional/sectorial (no inventarla) |
| Chile | CL | es-CL | CLP | research_required | Marco vigente + Ley 21.719 (entra en vigor 2026-12-01): construir para ambos regímenes |
| Colombia | CO | es-CO | COP | legal_research_complete (1ª pasada — [CO.md](CO.md)) | Ley 1581 de 2012 + decretos; verificar reformas pendientes |
| Costa Rica | CR | es-CR | CRC | research_required | Ley 8968 y reglamento vigente |
| Ecuador | EC | es-EC | USD | research_required | Ley Orgánica de Protección de Datos Personales y reglamento |
| El Salvador | SV | es-SV | USD | research_required | Decreto Legislativo 144 (Ley de Protección de Datos); verificar reglamento e implementación |
| España | ES | es-ES | EUR | legal_research_complete (1ª pasada — [ES.md](ES.md)) | RGPD + LO 3/2018; cookies/comunicaciones electrónicas; menores: 14 años para consentimiento de datos |
| Guatemala | GT | es-GT | GTQ | research_required | Verificar marco constitucional/civil/consumo/e-commerce; NO asumir ley integral aprobada |
| Guinea Ecuatorial | GQ | es-GQ | XAF | research_required | Ley 1/2016 de datos personales; verificar regulador y exigibilidad real |
| Honduras | HN | es-HN | HNL | research_required | Verificar marco privado vigente (no asumir proyectos); Ley de Comercio Electrónico, Decreto 149-2014 |
| México | MX | es-MX | MXN | **operación actual** | LFPDPPP vigente (ley de reemplazo 2025 + reformas; NO el estatuto 2010) |
| Nicaragua | NI | es-NI | NIO | research_required | Ley 787 y reglamento; verificar aplicación y transferencias |
| Panamá | PA | es-PA | PAB/USD (definir con revisión legal/contable/proveedor) | research_required | Ley 81 de 2019 + Decreto Ejecutivo 285 de 2021 |
| Paraguay | PY | es-PY | PYG | research_required | Ley 7.593/2025; verificar vigencia efectiva, reglamento y transitorios |
| Perú | PE | es-PE | PEN | research_required | Ley 29.733 + DS 016-2024-JUS (nuevo reglamento vigente 2025) |
| Rep. Dominicana | DO | es-DO | DOP | research_required | Ley 172-13; verificar alcance exacto (parte es de datos crediticios) |
| Uruguay | UY | es-UY | UYU | research_required | Ley 18.331 + decretos y guías para entidades extranjeras |

\* Moneda de PRESENTACIÓN candidata del plan. Nunca asumir que la cuenta Stripe mexicana puede presentar/liquidar
esa moneda: verificar por proveedor antes de habilitar cobro; si no se soporta, divulgar moneda real de la
transacción e implicaciones de conversión, o dejar el cobro desactivado para ese país.

## Aprobaciones legales

Cada aprobación registrará: país, tipo de documento, versión, fecha de research, fecha de borrador IA,
estado de revisión interna, nombre y jurisdicción del abogado local, estado y fecha de aprobación,
condiciones, fecha de expiración/próxima revisión, referencia al archivo, versión aprobada en producción.
**Prohibido marcar local_counsel_approved sin registrar quién y cuándo. Prohibido fabricar aprobaciones.**

## Bloqueantes corporativos (requieren al fundador — no inventar)

Identidad legal verificada del operador (razón social/persona física, nombre comercial, RFC, domicilio,
correo de avisos, contacto de soporte y de privacidad, representante autorizado, descriptor bancario,
titular de cuenta bancaria/Stripe/dominio/marca). "Ximo Academy / Ximo" NO se trata como identidad legal
completa sin documentación. Capacidad de firma internacional por confirmar.
