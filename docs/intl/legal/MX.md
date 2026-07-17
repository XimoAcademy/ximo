# México (MX) — Investigación legal (expansión Ximo)

Estado: legal_research_complete (parcial) · Última verificación: 2026-07-10 · Revisor humano: PENDIENTE (bloqueante para paid_launch)

> Primera pasada generada con IA. México ya opera en modo demo gratuito; el propio
> producto divulga en /terminos y en LegalShell que habrá revisión por abogado antes
> del lanzamiento comercial. Ese candado se preserva.

## Conclusiones registradas (lo ya implementado y verificable en el producto)

| Campo | Valor |
|---|---|
| Tema | Protección de datos personales (sector privado) |
| Ley | Ley Federal de Protección de Datos Personales en Posesión de los Particulares — ley de reemplazo 2025 (NO el estatuto 2010, derogado) |
| Autoridad | Secretaría Anticorrupción y Buen Gobierno (el INAI se disolvió en 2025) |
| Fuente oficial | DOF — pendiente de fijar URL exacta del decreto 2025 en la próxima pasada de research |
| Aplicabilidad | Aviso de privacidad (/privacidad la cita y nombra a la autoridad), consentimiento expreso en registro (checkbox obligatorio; `privacy_accepted_at` + versión en auth metadata), opt-in de marketing separado |
| Requisito técnico | Registro de aceptación versionado (implementado); derechos ARCO vía correo de privacidad (parcial: falta contacto de privacidad formal — ver bloqueantes corporativos) |
| Pendiente | Verificación de artículo/fechas exactas de publicación y vigencia; revisión de abogado licenciado |
| Riesgo | Medio mientras sea demo gratuito; alto para cobro sin revisión humana |
| ¿Abogado local requerido? | Sí (el producto ya lo divulga) |

| Campo | Valor |
|---|---|
| Tema | Facturación / CFDI |
| Estado | /terminos aclara que los recibos demo de $0.00 NO son CFDI. Antes de cobros reales: alta de datos fiscales (RFC/domicilio "a solicitud" es placeholder) y emisión CFDI — requiere fiscalista. |

| Campo | Valor |
|---|---|
| Tema | Menores de edad |
| Estado | Registro sin verificación de edad; aviso de menores en /privacidad. La política de tutores por edad es tema abierto del programa (minors_flow_approved pendiente para TODOS los países, MX incluido). |

## Temas del plan aún sin investigar para MX

Renovaciones automáticas y cancelación (PROFECO/LFPC), retracto, divulgación de precios,
email marketing (LFPDPPP + LFPC), cookies (no hay ley específica; criterio autoridad),
plataformas/UGC, reglas de servicios educativos y claims de becas/recruiting, regulación
de pagos, IVA sobre servicios digitales propios (vs. régimen de plataformas extranjeras),
retención de registros, accesibilidad, autoridad de quejas (PROFECO).

## Próximo paso

Pasada de verificación con fuentes oficiales (DOF, PROFECO, SAT) fecha por fecha, y
llenado del registro completo por tema usando _TEMPLATE.md.
