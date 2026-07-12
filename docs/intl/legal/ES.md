# España (ES) — Investigación legal (expansión Ximo)

Estado: legal_research_complete (primera pasada) · Última verificación: 2026-07-12 · Revisor humano: PENDIENTE (bloqueante para paid_launch)

> Primera pasada generada con IA con fuentes oficiales verificadas por búsqueda el
> 2026-07-12. NO habilitar cobros sin revisión de abogado licenciado en España y
> fiscalista (IVA UE). Los puntos marcados "verificación puntual pendiente" citan la
> norma correcta pero falta confirmar artículo/fecha exacta contra el texto oficial.

## Conclusiones registradas

| Campo | Valor |
|---|---|
| Tema | Protección de datos personales |
| Ley | Reglamento (UE) 2016/679 (RGPD, aplicación directa) + Ley Orgánica 3/2018 (LOPDGDD) |
| Autoridad | AEPD (Agencia Española de Protección de Datos) |
| Fuente oficial | https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673 (texto consolidado BOE) |
| Vigencia | LO 3/2018 en vigor desde 2018-12-07; sigue vigente en 2026. Reforma puntual: la Ley 10/2025 (servicios de atención a la clientela) modificó el art. 23 LOPDGDD, con plazo de adaptación hasta 2026-12-28 — verificación puntual pendiente del texto en BOE. |
| Aplicabilidad | Ximo trata datos de atletas (incl. menores) residentes en España ⇒ RGPD aplica por oferta de servicios a residentes UE (art. 3.2 RGPD) aunque el operador sea mexicano. Requiere: base de licitud, aviso conforme arts. 13-14 RGPD, registro de actividades, y probablemente REPRESENTANTE EN LA UE (art. 27 RGPD) al ofrecer servicios de forma estable — punto crítico para abogado. |
| Requisito técnico | Consentimiento verificable, derechos RGPD (acceso/rectificación/supresión/portabilidad/oposición), privacidad desde el diseño. El registro versionado de consentimiento ya implementado ayuda. |
| Riesgo | Alto sin representante UE ni análisis de transferencias internacionales (datos ES → Supabase/Vercel/Stripe en EE. UU.: cláusulas contractuales tipo / DPF — revisar subencargados). |
| ¿Abogado local requerido? | Sí |

| Campo | Valor |
|---|---|
| Tema | Menores de edad (consentimiento de datos) |
| Ley | LOPDGDD art. 7: el consentimiento del menor solo es válido desde los **14 años**; por debajo, consentimiento del titular de la patria potestad o tutela |
| Fuente oficial | https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673 |
| Aplicabilidad | El público objetivo de Ximo incluye menores de 18 (atletas de prepa). Para España: flujo de consentimiento de tutores obligatorio para <14 con datos basados en consentimiento; recomendable para 14-17 en pagos (capacidad contractual limitada — mayoría de edad 18, Código Civil). El programa ya exige minors_flow_approved antes del launch. |
| Requisito técnico | Verificación de edad en registro (hoy NO existe — solo año de graduación) + flujo de tutores. Bloqueante para free_beta si hay menores de 14. |
| Riesgo | Alto (menores + AEPD activa en la materia) |

| Campo | Valor |
|---|---|
| Tema | Consumidor: desistimiento, renovaciones automáticas, cancelación |
| Ley | TRLGDCU (Real Decreto Legislativo 1/2007) arts. 102-107 (desistimiento 14 días en contratos a distancia); Directiva 2011/83/UE; Ley 10/2025 de servicios de atención a la clientela (proceso de baja sencillo, aviso de renovación) |
| Fuente oficial | https://www.dsca.gob.es/en/consumo/nota-informativa-nueva-regulacion-suscripciones-ley-servicios-atencion-clientela (Ministerio de Derechos Sociales y Consumo) |
| Aplicabilidad | La suscripción de Ximo es renovación automática ⇒ obligación de baja tan fácil como el alta, aviso previo de renovación, y desistimiento de 14 días incluso en cada renovación (jurisprudencia TJUE sobre periodos de prueba → verificación puntual pendiente). Excepción de desistimiento para contenido digital ejecutado con consentimiento expreso y renuncia (art. 103.m TRLGDCU) — decidir con abogado si se usa. |
| Novedad 2026 | Desde 2026-06-19 se exige una "función de desistimiento" (botón) en contratos a distancia; si el consumidor no la encuentra, el plazo se amplía de 14 días a 12 meses y hay multas de hasta 4% de facturación — VERIFICAR transposición exacta en BOE antes de construir (fuente secundaria: marketing4ecommerce.net). |
| Riesgo | Medio-alto (es lo que más multas genera en suscripciones B2C) |

| Campo | Valor |
|---|---|
| Tema | IVA / impuestos digitales |
| Régimen | Servicios digitales B2C a consumidores en España desde un operador NO establecido en la UE ⇒ IVA español (21% general) del Estado de consumo, declarable vía ventanilla única **OSS régimen exterior de la Unión**, eligiendo un Estado de identificación (España posible) |
| Autoridad | AEAT |
| Fuente oficial | https://sede.agenciatributaria.gob.es/Sede/iva/iva-comercio-electronico/cuestiones-generales.html · https://europa.eu/youreurope/business/taxation/vat/one-stop-shop/index_es.htm |
| Aplicabilidad | Antes de cobrar a residentes en España, el operador mexicano debe registrarse en OSS no-UE y liquidar IVA trimestral. Stripe MX además debe poder presentar EUR o divulgarse la moneda real del cargo. Requiere fiscalista — no activar pagos sin esto. |
| Riesgo | Alto (obligación tributaria directa del operador) |

## Temas del plan aún sin investigar para ES

Cookies (LSSI-CE art. 22 + guía AEPD), email marketing (LSSI-CE art. 21), contratos y firma
electrónica (eIDAS + Ley 6/2020), obligaciones de plataformas/UGC (DSA — Reglamento (UE)
2022/2065, aplica ya), servicios educativos y claims de becas, accesibilidad (Ley 11/2023),
retención de registros, autoridad de quejas de consumo (CC. AA.), ley aplicable (Roma I —
el consumidor conserva la protección de su residencia), representante local, registro mercantil.

## Próximo paso

Verificación puntual del botón de desistimiento 2026 en BOE, decisión sobre representante
UE (art. 27 RGPD), y revisión completa por abogado español antes de cualquier cobro.
