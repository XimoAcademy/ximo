// Client-safe email constants & templates (no server imports).

export const EMAIL_STATUSES = ["Borrador", "Enviado", "Respondido", "Follow-up", "Sin respuesta"] as const;

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "primer-contacto",
    name: "Primer contacto con coach",
    subject: "Nadador mexicano interesado en su programa — Clase 20XX",
    body: `Estimado/a Coach [Apellido]:

Mi nombre es [Tu nombre], soy nadador/a mexicano/a de la generación 20XX. Sigo su programa y me gustaría ser considerado/a para su equipo.

Mis mejores tiempos (curso corto):
- 50 libre: [tiempo]
- 100 libre: [tiempo]
- [prueba]: [tiempo]

Datos académicos: GPA [x.x], SAT [puntaje], TOEFL [puntaje].

Adjunto mi video y perfil atlético. ¿Sería posible una breve llamada para conocer más sobre su programa?

Gracias por su tiempo,
[Tu nombre]`,
  },
  {
    id: "follow-up",
    name: "Follow-up sin respuesta",
    subject: "Seguimiento — [Tu nombre], nadador/a Clase 20XX",
    body: `Estimado/a Coach [Apellido]:

Quería dar seguimiento a mi correo del [fecha]. Sigo muy interesado/a en su programa.

Desde entonces mejoré mis tiempos:
- [prueba]: [tiempo nuevo]

Quedo atento/a a cualquier información que pueda compartir. Gracias por su tiempo.

Saludos,
[Tu nombre]`,
  },
  {
    id: "actualizacion-tiempos",
    name: "Actualización de tiempos",
    subject: "Tiempos actualizados — [Tu nombre]",
    body: `Estimado/a Coach [Apellido]:

Le comparto mis tiempos más recientes de [competencia]:
- [prueba]: [tiempo]
- [prueba]: [tiempo]

Adjunto el video de la competencia. Sigo trabajando para acercarme a los estándares de su equipo.

Saludos cordiales,
[Tu nombre]`,
  },
  {
    id: "beca-costo",
    name: "Pregunta sobre beca / costo",
    subject: "Consulta sobre becas para atletas internacionales",
    body: `Estimado/a Coach [Apellido]:

Gracias por el interés en mi perfil. Como atleta internacional, me gustaría entender mejor las opciones de beca atlética y el costo total estimado por año.

¿Podría orientarme sobre el apoyo disponible y los siguientes pasos?

Agradezco mucho su tiempo,
[Tu nombre]`,
  },
  {
    id: "agradecimiento-llamada",
    name: "Agradecimiento tras llamada",
    subject: "Gracias por la llamada de hoy",
    body: `Estimado/a Coach [Apellido]:

Gracias por la llamada de hoy. Me dio mucho gusto conocer más sobre su programa y el equipo.

Como acordamos, [próximo paso]. Quedo atento/a.

Saludos,
[Tu nombre]`,
  },
];
