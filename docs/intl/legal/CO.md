# Colombia (CO) — Investigación legal (expansión Ximo)

Estado: legal_research_complete (primera pasada) · Última verificación: 2026-07-12 · Revisor humano: PENDIENTE (bloqueante para paid_launch)

> Primera pasada generada con IA con fuentes oficiales verificadas por búsqueda el
> 2026-07-12. NO habilitar cobros sin abogado colombiano y fiscalista. Hay una
> REFORMA EN TRÁMITE de la ley de datos — es PROYECTO, no ley vigente: no construir
> sobre ella, solo monitorearla.

## Conclusiones registradas

| Campo | Valor |
|---|---|
| Tema | Protección de datos personales |
| Ley | Ley Estatutaria 1581 de 2012 + Decreto 1377 de 2013 (compilado en Decreto 1074 de 2015) |
| Autoridad | Superintendencia de Industria y Comercio (SIC) — Delegatura de Protección de Datos |
| Fuente oficial | http://www.secretariasenado.gov.co/senado/basedoc/ley_1581_2012.html (texto con vigencia) |
| Vigencia | Vigente en 2026. EN TRÁMITE: Proyecto de Ley Estatutaria 214 de 2025 (Cámara) que la modernizaría (fuente: https://sedeelectronica.sic.gov.co/noticias/gobierno-nacional-impulsa-reforma-clave-de-la-ley-de-proteccion-de-datos-personales-en-colombia). NO tratar como vigente. |
| Aplicabilidad | La Ley 1581 aplica al tratamiento en territorio colombiano o cuando al responsable extranjero le sea aplicable por tratados/normas (alcance extraterritorial DEBATIDO — la SIC ha sostenido aplicación a responsables extranjeros que tratan datos de residentes; punto para abogado). Exige: autorización previa, expresa e informada; política de tratamiento; canal de consultas/reclamos; registro nacional de bases de datos (RNBD) solo para sociedades colombianas — verificar si aplica a extranjero. |
| Requisito técnico | Autorización con evidencia (implementado el registro versionado); finalidades explícitas; procedimiento de consultas (10 días hábiles) y reclamos (15 días hábiles) — hoy no hay SLA de respuesta implementado, es operativo. |
| Riesgo | Medio (demo gratis) / Alto (cobros sin revisión) |
| ¿Abogado local requerido? | Sí |

| Campo | Valor |
|---|---|
| Tema | Menores de edad |
| Ley | Ley 1581 de 2012 art. 7: PROHIBIDO el tratamiento de datos de niños, niñas y adolescentes salvo datos de naturaleza pública; la Corte Constitucional (Sentencia C-748 de 2011) lo moduló: procede cuando responda al interés superior del menor y se asegure el respeto de sus derechos, con autorización del representante legal | 
| Fuente oficial | http://www.secretariasenado.gov.co/senado/basedoc/ley_1581_2012.html |
| Aplicabilidad | CRÍTICO para Ximo: el producto trata datos de menores deportistas. En Colombia esto exige autorización del representante legal + valoración del interés superior — flujo de tutores OBLIGATORIO antes incluso de free_beta (más estricto que México/España). El proyecto de reforma 2025 añadiría prohibición de perfilamiento comercial de menores. |
| Requisito técnico | Verificación de edad + consentimiento del representante legal (no existe hoy). |
| Riesgo | Alto |

| Campo | Valor |
|---|---|
| Tema | IVA / impuestos digitales |
| Régimen | Servicios digitales prestados desde el exterior a residentes colombianos: IVA 19% desde 2018. El prestador extranjero debe inscribirse en el RUT, obtener firma electrónica y declarar con el Formulario 325 (periodicidad bimestral) — o el IVA puede recaudarse vía retención por emisores de tarjetas si el prestador opta/incumple. |
| Autoridad | DIAN |
| Fuente oficial | https://www.dian.gov.co/Paginas/Prestadores-de-servicios-desde-el-exterior.aspx |
| Aplicabilidad | Antes de cobrar a residentes en Colombia, decidir con fiscalista: registro voluntario en RUT+F.325 vs. mecanismo de retención. Divulgar moneda real del cargo (Stripe MX difícilmente liquida COP). |
| Riesgo | Alto (obligación tributaria directa) |

| Campo | Valor |
|---|---|
| Tema | Protección al consumidor / e-commerce |
| Ley | Ley 1480 de 2011 (Estatuto del Consumidor): art. 47 derecho de RETRACTO de 5 días hábiles en ventas a distancia; información en castellano; reversión de pago (art. 51) para pagos electrónicos |
| Fuente oficial | http://www.secretariasenado.gov.co/senado/basedoc/ley_1480_2011.html — verificación puntual pendiente de artículos exactos contra el texto |
| Aplicabilidad | Suscripción digital ⇒ retracto de 5 días hábiles con reembolso; términos en español ya cumplido; definir flujo de reversión de pagos. La SIC también es autoridad de consumo. |
| Riesgo | Medio |

## Temas del plan aún sin investigar para CO

Transferencias internacionales (países con nivel adecuado según SIC — Circular Externa 005/2017,
verificar lista vigente y si México/EE. UU. califican), notificación de brechas al RNBD,
email marketing y habeas data comercial (Ley 2300 de 2023 "ley de canales apropiados" —
VERIFICAR alcance: limita horarios/canales de contacto comercial), renovaciones automáticas,
facturación electrónica DIAN, establecimiento permanente / tributación de renta (Presencia
Económica Significativa desde 2024 — verificar umbrales), representante local, accesibilidad.

## Próximo paso

Monitorear el PL 214/2025; consulta con abogado colombiano sobre extraterritorialidad de la
Ley 1581 y el flujo de menores; fiscalista para PES + IVA antes de cualquier cobro.
