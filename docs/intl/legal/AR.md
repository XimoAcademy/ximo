# Argentina (AR) — Investigación legal (expansión Ximo)

Estado: legal_research_complete (primera pasada) · Última verificación: 2026-07-12 · Revisor humano: PENDIENTE (bloqueante para paid_launch)

> Primera pasada generada con IA con fuentes oficiales verificadas por búsqueda el
> 2026-07-12. NO habilitar cobros sin abogado argentino y fiscalista. Hay PROYECTOS
> de reforma de la ley de datos (25 años de la 25.326) — son proyectos, no ley:
> no construir sobre ellos.

## Conclusiones registradas

| Campo | Valor |
|---|---|
| Tema | Protección de datos personales |
| Ley | Ley 25.326 (2000) + Decreto 1558/2001; disposiciones/resoluciones de la AAIP |
| Autoridad | Agencia de Acceso a la Información Pública (AAIP) |
| Fuente oficial | https://servicios.infoleg.gob.ar/infolegInternet/anexos/60000-64999/64790/texact.htm (InfoLeg, texto actualizado) · https://www.argentina.gob.ar/aaip/datospersonales |
| Vigencia | Vigente en 2026. EN TRÁMITE: proyectos de reforma integral (Diputados/Senado, inspirados en el anteproyecto AAIP alineado a RGPD; fuente: https://iapp.org/news/a/novedades-legislativas-en-argentina-sobre-protecci-n-de-datos-personales-e-inteligencia-artificial — secundaria). NO tratar como vigentes. |
| Aplicabilidad | Consentimiento libre, expreso e informado (art. 5); derechos de acceso/rectificación/supresión; Argentina exige INSCRIPCIÓN de bases de datos ante el Registro Nacional (verificar si aplica a responsable extranjero sin establecimiento — punto para abogado). Transferencias internacionales: prohibidas a países sin nivel adecuado salvo consentimiento/cláusulas (art. 12; México y EE. UU. NO están en la lista de adecuación de la AAIP — se requieren cláusulas modelo AAIP o consentimiento informado). |
| Requisito técnico | El consentimiento versionado ya implementado ayuda; falta cláusula específica de transferencia internacional en el aviso para AR. |
| Riesgo | Medio (demo) / Alto (cobros) |
| ¿Abogado local requerido? | Sí |

| Campo | Valor |
|---|---|
| Tema | Menores de edad |
| Ley | La Ley 25.326 no fija edad digital de consentimiento; rige el Código Civil y Comercial: mayoría de edad 18; adolescentes 13-17 con capacidad progresiva; actos jurídicos patrimoniales requieren representantes. Criterios AAIP sobre datos de menores (verificación puntual pendiente de la resolución/guía aplicable). |
| Aplicabilidad | Flujo de tutores necesario para menores; para PAGOS de menores, contrato con el representante legal (18 = mayoría). Igual que el resto del programa: minors_flow_approved bloqueante. |
| Riesgo | Alto |

| Campo | Valor |
|---|---|
| Tema | IVA / impuestos digitales |
| Régimen | Servicios digitales prestados por sujetos del exterior y consumidos en Argentina: IVA 21% (Ley 27.430, vigente desde 2018). Mecánica habitual: PERCEPCIÓN por el intermediario de pago (tarjeta) cuando el prestador está en el listado de ARCA (ex AFIP); alternativamente ingreso directo por el prestador. Además pueden aplicar percepciones adicionales cambiarias vigentes al momento del cobro e Ingresos Brutos provinciales sobre servicios digitales del exterior (varias provincias) — verificar estado exacto con fiscalista al momento del launch (cambia seguido). |
| Autoridad | ARCA (ex AFIP) |
| Fuente oficial | https://www.afip.gob.ar/iva/servicios-digitales/ |
| Aplicabilidad | Precio mostrado vs. cargos finales: el cliente argentino puede ver recargos de impuestos/percepciones sobre el precio en el resumen de su tarjeta ⇒ obligación de divulgación clara (moneda real MXN + posibles percepciones locales). |
| Riesgo | Alto (y volátil — régimen cambiario/impositivo argentino cambia con frecuencia) |

| Campo | Valor |
|---|---|
| Tema | Protección al consumidor |
| Ley | Ley 24.240 de Defensa del Consumidor (con reformas, p. ej. Ley 26.361); botón de arrepentimiento y revocación de aceptación en contratos a distancia: 10 días corridos (art. 34) + Resolución 424/2020 (botón de arrepentimiento obligatorio en sitios) — verificación puntual pendiente del texto vigente de la resolución |
| Fuente oficial | https://servicios.infoleg.gob.ar/infolegInternet/anexos/0-4999/638/texact.htm |
| Aplicabilidad | Suscripción B2C ⇒ revocación 10 días con reembolso; "botón de arrepentimiento" visible en el sitio; información en español y precio total. EN TRÁMITE: proyectos de reforma integral de la 24.240 que presumen relación de consumo con plataformas extranjeras y exigirían domicilio legal/responsable en el país — monitorear, no vigente. |
| Riesgo | Medio-alto |

## Temas del plan aún sin investigar para AR

Notificación de brechas (no obligatoria en la 25.326; recomendaciones AAIP), email marketing
(Ley 25.326 art. 27 + registro "No Llame" Ley 26.951 — alcance a email por verificar),
contratos/firma electrónica (Ley 25.506), facturación local, establecimiento permanente,
defensa del consumidor provincial, accesibilidad, ley aplicable y jurisdicción (el consumidor
argentino litiga en su domicilio — cláusulas de arbitraje extranjero probablemente nulas).

## Próximo paso

Fiscalista argentino ANTES de decidir si conviene cobrar a AR desde Stripe MX (carga
impositiva total sobre el usuario puede hacer el precio poco competitivo); abogado para
transferencias internacionales (cláusulas AAIP) y botón de arrepentimiento.
