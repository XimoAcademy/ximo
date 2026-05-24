// Later: replace static posts with Supabase real-time feed
// Later: protect route with auth
import { Badge, Card, SectionHeader } from "../components/ui";

type Post = {
  id: number;
  user: string;
  initials: string;
  color: string;
  tag: "Meta" | "Duda" | "Avance" | "Logro" | "Recruiting" | "Entrenamiento";
  time: string;
  text: string;
  likes: number;
  comments: number;
  answered?: boolean;
  official?: boolean;
  replies?: { user: string; initials: string; text: string }[];
};

const TAG_STYLES: Record<string, string> = {
  Meta: "bg-[#1D4ED8]/10 text-[#1D4ED8] border border-[#1D4ED8]/20",
  Duda: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
  Avance: "bg-[#059669]/10 text-[#059669] border border-[#059669]/20",
  Logro: "bg-[#C9A84C]/12 text-[#7a5f1f] border border-[#C9A84C]/30",
  Recruiting: "bg-purple-500/10 text-purple-700 border border-purple-500/20",
  Entrenamiento: "bg-[#0B1F33]/8 text-[#0B1F33] border border-[#0B1F33]/12",
};

const posts: Post[] = [
  {
    id: 1,
    user: "ximo Academy",
    initials: "XI",
    color: "bg-[#C9A84C]/20 text-[#7a5f1f]",
    tag: "Avance",
    time: "Hace 2 horas",
    official: true,
    text: "Acabamos de mejorar la sección de Coaches: ahora puedes ver el estilo de cada entrenador y si tienen apertura activa. Revísalo y cuéntanos qué opinas 👇",
    likes: 34,
    comments: 12,
  },
  {
    id: 2,
    user: "Carlos Nado",
    initials: "CN",
    color: "bg-[#1D4ED8]/12 text-[#1D4ED8]",
    tag: "Duda",
    time: "Hace 3 horas",
    text: "Hola comunidad. Mi tiempo en 50 libre es 26.8 SCY. ¿Es realista apuntar a D1? Estoy en clase 2026.",
    likes: 8,
    comments: 5,
    answered: true,
    replies: [
      { user: "Manny", initials: "MZ", text: "Depende del programa. D1 bajo requiere ~24.5 para hombres, pero D1 no competitivo puede aceptar 26.x. Revisa los tiempos de corte de cada equipo." },
      { user: "Fer Swim", initials: "FS", text: "Yo empecé con 26.5 y bajé a 25.1 en dos temporadas. Lo importante es la tendencia, no solo el tiempo actual." },
    ],
  },
  {
    id: 3,
    user: "Fer Swim",
    initials: "FS",
    color: "bg-emerald-500/12 text-emerald-700",
    tag: "Logro",
    time: "Hace 5 horas",
    text: "¡Nuevo PB en 50 libre: 25.1 SCY en el meet de hoy! Semanas de trabajo específico de salida dieron resultado. El proceso funciona 🔥",
    likes: 22,
    comments: 9,
  },
  {
    id: 4,
    user: "Valeria",
    initials: "VA",
    color: "bg-purple-500/12 text-purple-700",
    tag: "Recruiting",
    time: "Hace 1 día",
    text: "¿Alguien sabe cómo escribir un buen correo de seguimiento después de que el coach ya respondió pero no avanzó? No quiero ser pesada.",
    likes: 14,
    comments: 7,
    answered: true,
    replies: [
      { user: "Manny", initials: "MZ", text: "Espera 2 semanas, luego envía una actualización concreta: un tiempo nuevo, un meet próximo o algo relevante. No preguntes si 'sigue interesado'. Muestra progreso." },
    ],
  },
  {
    id: 5,
    user: "Diego",
    initials: "DM",
    color: "bg-[#0B1F33]/8 text-[#0B1F33]",
    tag: "Logro",
    time: "Hace 1 día",
    text: "¡Un coach de D2 me respondió hoy! Primera señal real de interés. Llevo 3 semanas usando la plantilla de correos de ximo. Si funciona 🙌",
    likes: 31,
    comments: 14,
  },
  {
    id: 6,
    user: "Manny",
    initials: "MZ",
    color: "bg-[#C9A84C]/12 text-[#7a5f1f]",
    tag: "Meta",
    time: "Hace 2 días",
    text: "Meta para esta temporada: bajar el 100 mariposa a 58.0 SCY. Empiezo bloque de fuerza específica esta semana. ¿Alguien más trabajando mariposa?",
    likes: 11,
    comments: 6,
  },
];

const hotTopics = [
  { label: "Tiempos D1 realistas 2025", count: 23 },
  { label: "Correo de follow-up", count: 18 },
  { label: "Becas parciales vs completas", count: 14 },
  { label: "Preparación SAT para atletas", count: 11 },
  { label: "Visitas oficiales vs no oficiales", count: 9 },
];

const topAthletes = [
  { name: "Manny", initials: "MZ", badge: "🔥", metric: "12d racha", highlight: true },
  { name: "Fer Swim", initials: "FS", badge: "⭐", metric: "10d racha", highlight: false },
  { name: "Carlos Nado", initials: "CN", badge: "💪", metric: "9d racha", highlight: false },
  { name: "Valeria", initials: "VA", badge: "📈", metric: "7d racha", highlight: false },
  { name: "Diego", initials: "DM", badge: "🎯", metric: "5d racha", highlight: false },
];

export default function ComunidadPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
      {/* Left: feed */}
      <div className="space-y-4">
        {/* Page header */}
        <div>
          <h1 className="text-xl font-black tracking-tight text-[#0B1F33] sm:text-2xl">Comunidad</h1>
          <p className="mt-1 text-sm text-[#5E7080]">Atletas compartiendo metas, avances y dudas reales.</p>
        </div>

        {/* Composer */}
        <Card className="p-4">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C9A84C]/15 text-xs font-black text-[#7a5f1f]">
              MZ
            </div>
            <div className="flex-1">
              <div className="w-full rounded-xl border border-[#0B1F33]/10 bg-[#F5F5F0] px-4 py-3 text-sm text-[#5E7080] cursor-text">
                Comparte una meta, duda o avance…
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["Meta", "Duda", "Avance", "Logro", "Recruiting", "Entrenamiento"] as const).map((tag) => (
                  <button key={tag} type="button"
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition-opacity hover:opacity-80 ${TAG_STYLES[tag]}`}>
                    {tag}
                  </button>
                ))}
                <button type="button"
                  className="ml-auto rounded-xl bg-[#0B1F33] px-4 py-1.5 text-[11px] font-bold text-white hover:bg-[#112538] transition-colors">
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Feed */}
        {posts.map((post) => (
          <Card key={post.id} className="p-4 sm:p-5">
            <div className="flex gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-black ${post.color}`}>
                {post.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-[#0B1F33]">{post.user}</p>
                  {post.official && (
                    <span className="rounded-full bg-[#C9A84C] px-2 py-0.5 text-[9px] font-black text-[#0B1F33]">OFICIAL</span>
                  )}
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${TAG_STYLES[post.tag]}`}>{post.tag}</span>
                  <span className="text-[10px] text-[#5E7080] ml-auto">{post.time}</span>
                </div>
                <p className="text-sm text-[#0D1B2A] leading-relaxed">{post.text}</p>

                {/* Reactions */}
                <div className="mt-3 flex items-center gap-4">
                  <button type="button" className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold text-[#5E7080] hover:bg-[#F5F5F0] transition-colors">
                    ♥ {post.likes}
                  </button>
                  <button type="button" className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold text-[#5E7080] hover:bg-[#F5F5F0] transition-colors">
                    💬 {post.comments}
                  </button>
                  {post.answered && (
                    <span className="ml-auto flex items-center gap-1 rounded-full border border-[#059669]/25 bg-[#059669]/8 px-2.5 py-1 text-[10px] font-bold text-[#059669]">
                      ✓ Respondido por la comunidad
                    </span>
                  )}
                </div>

                {/* Replies */}
                {post.replies && post.replies.length > 0 && (
                  <div className="mt-3 space-y-2 border-l-2 border-[#0B1F33]/8 pl-3">
                    {post.replies.map((reply) => (
                      <div key={reply.user} className="flex gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#0B1F33]/8 text-[9px] font-black text-[#0B1F33]">
                          {reply.initials}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-[#0B1F33]">{reply.user}</p>
                          <p className="text-[11px] text-[#5E7080] leading-relaxed">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}

        <div className="rounded-2xl border border-dashed border-[#0B1F33]/12 bg-white/40 px-4 py-3 text-center text-xs text-[#5E7080]">
          Cargando más publicaciones… · Beta privada · Solo atletas fundadores
        </div>
      </div>

      {/* Right: sidebar */}
      <div className="space-y-5">
        {/* Rankings */}
        <Card className="p-4">
          <SectionHeader title="Ranking positivo" subtitle="Racha más larga esta semana" />
          <div className="space-y-2">
            {topAthletes.map((athlete, i) => (
              <div key={athlete.name}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${
                  athlete.highlight
                    ? "bg-[#C9A84C]/10 border border-[#C9A84C]/25"
                    : "border border-[#0B1F33]/6"
                }`}>
                <span className="w-5 text-center text-[11px] font-black text-[#5E7080]">#{i + 1}</span>
                <span className="text-base">{athlete.badge}</span>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0B1F33]/8 text-[10px] font-black text-[#0B1F33]">
                  {athlete.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-[#0B1F33] truncate">
                    {athlete.name}
                    {athlete.highlight && <span className="ml-1 text-[#C9A84C]">(tú)</span>}
                  </p>
                  <p className="text-[10px] text-[#5E7080]">{athlete.metric}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[10px] text-[#5E7080] leading-relaxed">
            Rankings basados en consistencia, avances compartidos y respuestas útiles. No en comparación de tiempos.
          </p>
        </Card>

        {/* Hot topics */}
        <Card className="p-4">
          <SectionHeader title="Temas activos" subtitle="Más discutidos esta semana" />
          <div className="space-y-2">
            {hotTopics.map((topic, i) => (
              <div key={topic.label} className="flex items-center gap-2.5 rounded-xl border border-[#0B1F33]/6 px-3 py-2">
                <span className="text-[10px] font-black text-[#5E7080] w-4">#{i + 1}</span>
                <p className="flex-1 text-[11px] font-semibold text-[#0B1F33] leading-snug">{topic.label}</p>
                <span className="rounded-full bg-[#0B1F33]/6 px-2 py-0.5 text-[10px] font-bold text-[#5E7080]">{topic.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Community streak */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-[#0B1F33] to-[#112538] p-4">
            <p className="text-xs font-black text-white">🔥 Racha comunitaria</p>
            <p className="mt-0.5 text-[10px] text-white/45">La comunidad lleva 7 días activos seguidos</p>
          </div>
          <div className="p-4">
            <p className="text-[11px] text-[#5E7080] leading-relaxed">
              "Pequeñas acciones diarias crean oportunidades reales."
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#0B1F33]/8">
              <div className="h-full w-[23%] rounded-full bg-gradient-to-r from-[#C9A84C] to-[#e8c76a]" />
            </div>
            <p className="mt-1.5 text-[10px] text-[#5E7080]">7 de 30 días · ¡Sigan así!</p>
          </div>
        </Card>

        {/* Atletas fundadores badge */}
        <Card className="p-4 text-center">
          <p className="text-2xl mb-1">🏊</p>
          <p className="text-xs font-black text-[#0B1F33]">Atletas fundadores</p>
          <p className="mt-1 text-[10px] text-[#5E7080] leading-relaxed">
            Eres parte del primer grupo que construye ximo. Tu participación da forma a la plataforma.
          </p>
          <span className="mt-2 inline-flex items-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/12 px-3 py-1 text-[10px] font-bold text-[#C9A84C]">
            Fundador · Clase 2027
          </span>
        </Card>
      </div>
    </div>
  );
}
