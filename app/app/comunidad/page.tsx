"use client";

// app/app/comunidad/page.tsx — ximo Academy Community Feed
import Link from "next/link";
import { useState } from "react";
import { Card, SectionHeader } from "../components/ui";

type Tag = "Meta"|"Duda"|"Avance"|"Logro"|"Recruiting"|"Entrenamiento"|"Oficial"|"Marca";
type FeedItem = { kind: "post"; data: Post } | { kind: "brand"; data: BrandCard };

interface Post {
  id: number; user: string; initials: string; color: string;
  sport?: string; tag: Tag; time: string; text: string;
  likes: number; comments: number; answered?: boolean; official?: boolean;
  mediaPlaceholder?: string;
  replies?: { user: string; initials: string; text: string }[];
}

interface BrandCard {
  id: number; brand: string; logo: string; category: string;
  headline: string; description: string; cta: string; format: string;
}

const TAG_STYLES: Record<Tag, string> = {
  Meta:          "bg-[#2F7F86]/10 text-[#1F5F66] border border-[#2F7F86]/20",
  Duda:          "bg-amber-500/10 text-amber-700 border border-amber-500/20",
  Avance:        "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20",
  Logro:         "bg-[#C9A84C]/12 text-[#7a5f1f] border border-[#C9A84C]/25",
  Recruiting:    "bg-purple-500/10 text-purple-700 border border-purple-500/20",
  Entrenamiento: "bg-[#0B1F33]/8 text-[#0B1F33] border border-[#0B1F33]/12",
  Oficial:       "bg-[#C9A84C] text-[#0B1F33]",
  Marca:         "bg-[#2F7F86]/8 text-[#1F5F66] border border-[#2F7F86]/15",
};

const FILTER_TABS = ["Todo","Dudas","Avances","Logros","Recruiting","Entrenamiento","Marcas"] as const;
type FilterTab = typeof FILTER_TABS[number];

const posts: Post[] = [
  { id: 1, user: "ximo Academy", initials: "XI", color: "bg-[#C9A84C]/15 text-[#7a5f1f]",
    tag: "Oficial", time: "Hace 2 h", official: true,
    text: "Mejoramos la sección de Coaches: ahora puedes ver el estilo de cada entrenador y si tiene apertura activa. Revísalo y cuéntanos 👇",
    likes: 34, comments: 12 },
  { id: 2, user: "Manny", initials: "MZ", color: "bg-[#C9A84C]/12 text-[#7a5f1f]",
    sport: "Nadador · 2027", tag: "Duda", time: "Hace 3 h",
    text: "¿Qué es lo más difícil al contactar a un coach por primera vez? Yo creo que es no saber si estás en su rango de tiempos. ¿Qué les ha costado más?",
    likes: 17, comments: 9, answered: true,
    replies: [
      { user: "Fer Swim", initials: "FS", text: "No saber si el nivel es suficiente. Esperé demasiado antes de escribir." },
      { user: "Valeria",  initials: "VA", text: "El idioma. Escribir en inglés formal sin sonar robótico." },
    ] },
  { id: 3, user: "Fer Swim", initials: "FS", color: "bg-emerald-500/12 text-emerald-700",
    sport: "Nadadora · 2026", tag: "Logro", time: "Hace 5 h",
    text: "¡Nuevo PB en 50 libre: 25.1 SCY en el meet de hoy! Semanas de trabajo específico de salida dieron resultado 🔥",
    likes: 22, comments: 9,
    mediaPlaceholder: "🏊  Clip de competencia · 50 libre · Meet GDL Invitational" },
  { id: 4, user: "Carlos Nado", initials: "CN", color: "bg-[#2F7F86]/12 text-[#1F5F66]",
    sport: "Nadador · 2026", tag: "Duda", time: "Hace 6 h",
    text: "Mi tiempo en 50 libre es 26.8 SCY. ¿Es realista apuntar a D1? Estoy en clase 2026.",
    likes: 8, comments: 5, answered: true,
    replies: [
      { user: "Manny",    initials: "MZ", text: "D1 bajo puede aceptar 26.x. La tendencia importa más que el tiempo actual." },
      { user: "Fer Swim", initials: "FS", text: "Empecé con 26.5 y bajé a 25.1 en dos temporadas. El proceso funciona." },
    ] },
  { id: 5, user: "Valeria", initials: "VA", color: "bg-purple-500/12 text-purple-700",
    sport: "Nadadora · 2027", tag: "Recruiting", time: "Hace 1 d",
    text: "¿Cómo escriben un follow-up cuando el coach ya respondió pero sin avance? No quiero parecer pesada pero tampoco que me olvide.",
    likes: 14, comments: 7, answered: true,
    replies: [
      { user: "Manny", initials: "MZ", text: "Espera 2 semanas. Luego envía algo concreto: tiempo nuevo, meet próximo. No preguntes si 'sigue interesado'. Muestra progreso." },
    ] },
  { id: 6, user: "Diego", initials: "DM", color: "bg-[#0B1F33]/8 text-[#0B1F33]",
    sport: "Nadador · 2027", tag: "Logro", time: "Hace 1 d",
    text: "¡Un coach de D2 me respondió hoy! Llevo 3 semanas usando la plantilla de correos de ximo. Sí funciona 🙌",
    likes: 31, comments: 14 },
  { id: 7, user: "Manny", initials: "MZ", color: "bg-[#C9A84C]/12 text-[#7a5f1f]",
    sport: "Nadador · 2027", tag: "Entrenamiento", time: "Hace 2 d",
    text: "Meta esta temporada: bajar el 100 mariposa a 58.0 SCY. Empiezo bloque de fuerza específica esta semana. ¿Alguien trabajando mariposa?",
    likes: 11, comments: 6,
    mediaPlaceholder: "📊  Plan de entrenamiento · Bloque Fuerza Específica · 6 semanas" },
];

const brandCards: BrandCard[] = [
  { id: 101, brand: "Aquasport MX",  logo: "🏊", category: "Equipo deportivo",          format: "Oferta",   headline: "Trajes de competencia para atletas en recruiting", description: "Descuento exclusivo para atletas ximo. Trajes técnicos de alto rendimiento.",     cta: "Ver oportunidad" },
  { id: 102, brand: "GNC Sport",     logo: "💊", category: "Suplementos y recuperación", format: "Producto", headline: "Protocolo de recuperación para alto rendimiento",   description: "Suplementos validados para nadadores, sin sustancias prohibidas.",             cta: "Ver oportunidad" },
  { id: 103, brand: "Arena México",  logo: "⚡", category: "Equipo deportivo",          format: "Producto", headline: "Lentes y gorras de competencia — 2025",             description: "Arena busca atletas ximo para probar su nueva línea antes del lanzamiento.", cta: "Ver oportunidad" },
  { id: 104, brand: "Recov+",        logo: "🧊", category: "Recuperación",              format: "Oferta",   headline: "Herramientas de recuperación activa",               description: "Compresión, foam rolling y protocolos de baño de contraste.",               cta: "Ver oportunidad" },
];

const feed: FeedItem[] = [
  { kind: "post",  data: posts[0] },
  { kind: "post",  data: posts[1] },
  { kind: "brand", data: brandCards[0] },
  { kind: "post",  data: posts[2] },
  { kind: "post",  data: posts[3] },
  { kind: "brand", data: brandCards[1] },
  { kind: "post",  data: posts[4] },
  { kind: "post",  data: posts[5] },
  { kind: "brand", data: brandCards[2] },
  { kind: "post",  data: posts[6] },
  { kind: "brand", data: brandCards[3] },
];

const hotTopics = [
  { label: "Tiempos D1 realistas 2025", count: 23 },
  { label: "Correo de follow-up",        count: 18 },
  { label: "Becas parciales vs completas",count: 14 },
  { label: "SAT para atletas",            count: 11 },
  { label: "Visitas oficiales",           count: 9  },
];

const topAthletes = [
  { name: "Manny",       initials: "MZ", metric: "12d racha", me: true  },
  { name: "Fer Swim",    initials: "FS", metric: "10d racha", me: false },
  { name: "Carlos Nado", initials: "CN", metric: "9d racha",  me: false },
  { name: "Valeria",     initials: "VA", metric: "7d racha",  me: false },
  { name: "Diego",       initials: "DM", metric: "5d racha",  me: false },
];

function TagPill({ tag }: { tag: Tag }) {
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${TAG_STYLES[tag]}`}>{tag}</span>;
}

function PostCard({ post, likes, setLikes }: { post: Post; likes: number; setLikes: (n: number) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="p-4 hover:shadow-[0_4px_18px_rgba(11,31,51,0.09)] transition-shadow">
      <div className="flex gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-black ${post.color}`}>
          {post.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <p className="text-sm font-bold text-[#0B1F33]">{post.user}</p>
            {post.official && <span className="rounded-full bg-[#C9A84C] px-2 py-0.5 text-[9px] font-black text-[#0B1F33] uppercase">Oficial</span>}
            {post.sport && <span className="text-[10px] text-[#5E7080]">{post.sport}</span>}
            <TagPill tag={post.tag} />
            <span className="text-[10px] text-[#5E7080] ml-auto">{post.time}</span>
          </div>
          <p className="text-sm text-[#0D1B2A] leading-relaxed">{post.text}</p>

          {post.mediaPlaceholder && (
            <div className="mt-2.5 rounded-xl border border-[#0B1F33]/8 bg-[#ECEBE4] px-4 py-2.5 text-xs text-[#5E7080]">
              {post.mediaPlaceholder}
            </div>
          )}

          <div className="mt-3 flex items-center gap-0.5 flex-wrap">
            <button type="button" onClick={() => setLikes(likes + 1)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#5E7080] hover:text-[#C9A84C] hover:bg-[#F5F5F0] transition-colors">
              ♥ {likes}
            </button>
            <button type="button" onClick={() => setOpen(!open)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#5E7080] hover:bg-[#F5F5F0] transition-colors">
              💬 {post.comments}
            </button>
            <button type="button"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#5E7080] hover:bg-[#F5F5F0] transition-colors">
              ↗ Compartir
            </button>
            {post.answered && (
              <span className="ml-auto flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                ✓ Respondido
              </span>
            )}
          </div>

          {open && post.replies && (
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
              <div className="flex gap-2 mt-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#C9A84C]/15 text-[9px] font-black text-[#7a5f1f]">MZ</div>
                <div className="flex-1 rounded-lg border border-[#0B1F33]/8 bg-[#F5F5F0] px-3 py-1.5 text-[11px] text-[#5E7080]">
                  Escribe una respuesta…
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function BrandCardFeed({ brand }: { brand: BrandCard }) {
  return (
    <div className="rounded-2xl border border-[#0B1F33]/8 bg-white/95 shadow-[0_1px_10px_rgba(11,31,51,0.05)] p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] font-bold tracking-widest text-[#5E7080] uppercase">Anuncio filtrado para atletas ximo</span>
        <span className="ml-auto rounded-full border border-[#2F7F86]/20 bg-[#2F7F86]/8 px-2 py-0.5 text-[9px] font-bold text-[#2F7F86]">
          ✓ Marca verificada
        </span>
      </div>
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B1F33]/5 text-xl">
          {brand.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <p className="text-sm font-bold text-[#0B1F33]">{brand.brand}</p>
            <span className="rounded-full border border-[#0B1F33]/8 bg-[#F5F5F0] px-2 py-0.5 text-[10px] text-[#5E7080]">{brand.category}</span>
            <span className="rounded-full border border-[#0B1F33]/8 bg-[#F5F5F0] px-2 py-0.5 text-[10px] text-[#5E7080]">{brand.format}</span>
            <span className="rounded-full border border-[#2F7F86]/15 bg-[#2F7F86]/6 px-2 py-0.5 text-[10px] text-[#1F5F66] font-bold">Campaña activa</span>
          </div>
          <p className="text-sm font-semibold text-[#0D1B2A] leading-snug mb-1">{brand.headline}</p>
          <p className="text-xs text-[#5E7080] leading-relaxed mb-3">{brand.description}</p>
          <div className="flex items-center gap-3">
            <button type="button"
              className="rounded-xl bg-[#0B1F33] px-4 py-1.5 text-[11px] font-bold text-white hover:bg-[#07131F] transition-colors">
              {brand.cta} →
            </button>
            <span className="text-[10px] text-[#5E7080]">Revisado por ximo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComunidadPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("Todo");
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>(
    Object.fromEntries(posts.map((p) => [p.id, p.likes]))
  );

  const visibleFeed = feed.filter((item) => {
    if (activeTab === "Todo") return true;
    if (activeTab === "Marcas") return item.kind === "brand";
    if (item.kind === "brand") return false;
    const tagMap: Record<FilterTab, Tag|null> = {
      Todo: null, Dudas: "Duda", Avances: "Avance", Logros: "Logro",
      Recruiting: "Recruiting", Entrenamiento: "Entrenamiento", Marcas: null,
    };
    return (item.data as Post).tag === tagMap[activeTab];
  });

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_264px]">
      {/* Feed */}
      <div className="space-y-4 min-w-0">
        <div>
          <h1 className="text-xl font-black tracking-tight text-[#0B1F33] sm:text-2xl">Comunidad</h1>
          <p className="mt-1 text-sm text-[#5E7080]">Atletas compartiendo metas, avances y dudas reales.</p>
        </div>

        {/* Composer */}
        <Card className="p-4">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C9A84C]/12 text-[11px] font-black text-[#7a5f1f]">MZ</div>
            <div className="flex-1">
              <div className="w-full rounded-xl border border-[#0B1F33]/8 bg-[#F5F5F0] px-4 py-3 text-sm text-[#5E7080] cursor-text">
                Comparte una foto, meta, duda o avance…
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {(["Meta","Duda","Avance","Logro","Recruiting","Entrenamiento"] as Tag[]).map((tag) => (
                  <button key={tag} type="button"
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold hover:opacity-80 transition-opacity ${TAG_STYLES[tag]}`}>
                    {tag}
                  </button>
                ))}
                <button type="button"
                  className="ml-auto rounded-xl bg-[#0B1F33] px-4 py-1.5 text-[11px] font-bold text-white hover:bg-[#07131F] transition-colors">
                  Publicar
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {FILTER_TABS.map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-xl px-3.5 py-2 text-[11px] font-bold transition-colors ${
                activeTab === tab
                  ? "bg-[#0B1F33] text-white"
                  : "bg-white border border-[#0B1F33]/8 text-[#5E7080] hover:border-[#0B1F33]/18"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Feed items */}
        {visibleFeed.map((item) =>
          item.kind === "post" ? (
            <PostCard
              key={`post-${item.data.id}`}
              post={item.data as Post}
              likes={likeCounts[(item.data as Post).id]}
              setLikes={(n) => setLikeCounts((prev) => ({ ...prev, [(item.data as Post).id]: n }))}
            />
          ) : (
            <BrandCardFeed key={`brand-${item.data.id}`} brand={item.data as BrandCard} />
          )
        )}

        {visibleFeed.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#0B1F33]/10 bg-white/40 py-8 text-center text-sm text-[#5E7080]">
            No hay publicaciones en esta categoría todavía.
          </div>
        )}

        <div className="rounded-2xl border border-dashed border-[#0B1F33]/10 bg-white/40 py-3 text-center text-xs text-[#5E7080]">
          Solo atletas fundadores · Beta privada
        </div>
      </div>

      {/* Right sidebar */}
      <div className="space-y-4">
        <Card className="p-4">
          <SectionHeader title="Temas activos" subtitle="Esta semana" />
          <div className="space-y-1.5">
            {hotTopics.map((topic, i) => (
              <div key={topic.label}
                className="flex items-center gap-2.5 rounded-xl border border-[#0B1F33]/6 px-3 py-2 hover:border-[#0B1F33]/14 transition-colors cursor-pointer">
                <span className="text-[10px] font-black text-[#5E7080] w-4">#{i + 1}</span>
                <p className="flex-1 text-[11px] font-semibold text-[#0B1F33] leading-snug">{topic.label}</p>
                <span className="rounded-full bg-[#0B1F33]/5 px-2 py-0.5 text-[10px] font-bold text-[#5E7080]">{topic.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <SectionHeader title="Ranking positivo" subtitle="Racha más larga" />
          <div className="space-y-1.5">
            {topAthletes.map((a, i) => (
              <div key={a.name}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${a.me ? "bg-[#C9A84C]/10 border border-[#C9A84C]/20" : "border border-[#0B1F33]/6"}`}>
                <span className="w-4 text-center text-[10px] font-black text-[#5E7080]">#{i + 1}</span>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#0B1F33]/8 text-[10px] font-black text-[#0B1F33]">
                  {a.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-[#0B1F33] truncate">
                    {a.name} {a.me && <span className="text-[#C9A84C]">(tú)</span>}
                  </p>
                  <p className="text-[10px] text-[#5E7080]">{a.metric}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="bg-[#0B1F33] p-4">
            <p className="text-xs font-black text-white">🔥 Racha comunitaria</p>
            <p className="mt-0.5 text-[10px] text-white/40">7 días activos seguidos</p>
          </div>
          <div className="p-4">
            <p className="text-[11px] text-[#5E7080] leading-relaxed italic">
              "Pequeñas acciones diarias crean oportunidades reales."
            </p>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[#0B1F33]/8">
              <div className="h-full w-[23%] rounded-full bg-gradient-to-r from-[#C9A84C] to-[#e8c76a]" />
            </div>
            <p className="mt-1.5 text-[10px] text-[#5E7080]">7 de 30 días</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <p className="text-base mb-1">🏷</p>
            <p className="text-xs font-black text-[#0B1F33]">¿Representas una marca?</p>
            <p className="mt-1 text-[10px] text-[#5E7080] leading-relaxed">
              Conecta con atletas de forma curada y alineada al deporte.
            </p>
            <Link href="/app/promocionar"
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-[#0B1F33]/10 bg-[#F5F5F0] px-4 py-2 text-xs font-bold text-[#0B1F33] hover:bg-[#0B1F33] hover:text-white transition-colors">
              Soy una marca →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
