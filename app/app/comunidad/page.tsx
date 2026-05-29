"use client";

import { useState, useRef, type ChangeEvent } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────
type Tag = "Meta" | "Avance" | "Logro" | "Duda" | "Recruiting" | "Entrenamiento" | "Oficial";

interface Post {
  id: number;
  user: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  sport: string;
  tag: Tag;
  time: string;
  text: string;
  image?: string;       // data-URL or placeholder string
  imageName?: string;
  likes: number;
  likedByMe: boolean;
  comments: number;
  official?: boolean;
  replies?: { user: string; initials: string; text: string }[];
}

// ── Tag palette ────────────────────────────────────────────────
const TAG_STYLE: Record<Tag, { bg: string; color: string }> = {
  Meta:          { bg:"rgba(30,206,206,0.12)",  color:"var(--teal)" },
  Avance:        { bg:"rgba(5,150,105,0.12)",   color:"#6ee7b7" },
  Logro:         { bg:"rgba(201,168,76,0.12)",  color:"var(--gold)" },
  Duda:          { bg:"rgba(251,191,36,0.12)",  color:"#fbbf24" },
  Recruiting:    { bg:"rgba(139,92,246,0.12)",  color:"#c4b5fd" },
  Entrenamiento: { bg:"rgba(127,175,178,0.1)",  color:"rgba(127,175,178,0.8)" },
  Oficial:       { bg:"rgba(201,168,76,0.2)",   color:"var(--gold)" },
};
const TAGS: Tag[] = ["Meta","Avance","Logro","Duda","Recruiting","Entrenamiento"];

// ── Initial feed data ──────────────────────────────────────────
const INITIAL_POSTS: Post[] = [
  {
    id:1, user:"Ximo", initials:"XI", avatarBg:"rgba(201,168,76,0.18)", avatarColor:"var(--gold)",
    sport:"Plataforma oficial", tag:"Oficial", time:"2 h",
    text:"Mejoramos la sección de Coaches: ahora puedes ver el estilo de cada entrenador y si tiene apertura activa. Revísalo en tu dashboard.",
    likes:34, likedByMe:false, comments:12, official:true,
  },
  {
    id:2, user:"Manny Z.", initials:"MZ", avatarBg:"rgba(30,206,206,0.15)", avatarColor:"var(--teal)",
    sport:"Nadador · 2027", tag:"Duda", time:"3 h",
    text:"¿Qué es lo más difícil al contactar a un coach por primera vez? ¿Cómo saben si estás en su rango de tiempos?",
    likes:17, likedByMe:false, comments:9,
    replies:[
      { user:"Fer Swim", initials:"FS", text:"No saber si el nivel es suficiente. Esperé demasiado antes de escribir." },
      { user:"Valeria", initials:"VA", text:"El idioma. Escribir en inglés formal sin sonar robótico." },
    ],
  },
  {
    id:3, user:"Fer Swim", initials:"FS", avatarBg:"rgba(5,150,105,0.15)", avatarColor:"#6ee7b7",
    sport:"Nadadora · 2026", tag:"Logro", time:"5 h",
    text:"Nuevo PB en 50 libre: 25.1 SCY. Semanas de trabajo específico de salida dieron resultado. El proceso funciona.",
    imageName:"Clip de competencia · 50 libre · GDL Invitational",
    likes:22, likedByMe:false, comments:9,
  },
  {
    id:4, user:"Carlos N.", initials:"CN", avatarBg:"var(--border)", avatarColor:"var(--teal)",
    sport:"Nadador · 2026", tag:"Duda", time:"6 h",
    text:"Mi tiempo en 50 libre es 26.8 SCY. ¿Es realista apuntar a D1? Estoy en clase 2026.",
    likes:8, likedByMe:false, comments:5,
    replies:[
      { user:"Manny Z.", initials:"MZ", text:"D1 bajo puede aceptar 26.x. La tendencia importa más que el tiempo actual." },
      { user:"Fer Swim", initials:"FS", text:"Empecé con 26.5 y bajé a 25.1 en dos temporadas. El proceso funciona." },
    ],
  },
  {
    id:5, user:"Valeria G.", initials:"VG", avatarBg:"rgba(139,92,246,0.15)", avatarColor:"#c4b5fd",
    sport:"Nadadora · 2027", tag:"Recruiting", time:"1 d",
    text:"¿Cómo escriben un follow-up cuando el coach ya respondió pero sin avance? No quiero parecer pesada.",
    likes:14, likedByMe:false, comments:7,
    replies:[{ user:"Manny Z.", initials:"MZ", text:"Espera 2 semanas. Luego envía algo concreto: tiempo nuevo, meet próximo. No preguntes si sigue interesado." }],
  },
  {
    id:6, user:"Diego M.", initials:"DM", avatarBg:"rgba(127,175,178,0.12)", avatarColor:"rgba(127,175,178,0.8)",
    sport:"Nadador · 2027", tag:"Logro", time:"1 d",
    text:"Un coach de D2 me respondió hoy. Llevo 3 semanas usando la plantilla de correos de Ximo. Funciona.",
    likes:31, likedByMe:false, comments:14,
  },
  {
    id:7, user:"Manny Z.", initials:"MZ", avatarBg:"rgba(30,206,206,0.15)", avatarColor:"var(--teal)",
    sport:"Nadador · 2027", tag:"Meta", time:"2 d",
    text:"Meta esta temporada: bajar el 100 mariposa a 58.0 SCY. Empiezo bloque de fuerza específica. ¿Alguien trabajando mariposa?",
    imageName:"Plan de entrenamiento · Bloque Fuerza · 6 semanas",
    likes:11, likedByMe:false, comments:6,
  },
];

const SURFACE = "var(--surface)";
const BORDER  = "var(--border)";

// ── Post composer ──────────────────────────────────────────────
function Composer({ onPost }: { onPost: (text: string, tag: Tag, imageName?: string) => void }) {
  const [text, setText]           = useState("");
  const [tag, setTag]             = useState<Tag>("Meta");
  const [imageName, setImageName] = useState<string | undefined>();
  const [dragging, setDragging]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (!text.trim()) return;
    onPost(text.trim(), tag, imageName);
    setText("");
    setImageName(undefined);
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setImageName(f.name);
  };

  return (
    <div className="rounded-2xl p-4 sm:p-5" style={{ background: SURFACE, border:`1.5px solid ${BORDER}` }}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black"
          style={{ background:"rgba(30,206,206,0.15)", color:"var(--teal)", border:"1px solid rgba(30,206,206,0.2)" }}>
          MZ
        </div>
        <div className="flex-1 min-w-0">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="¿Qué está pasando en tu camino deportivo?"
            rows={3}
            className="w-full resize-none rounded-xl bg-transparent p-0 text-sm outline-none placeholder:text-[var(--text-label)]"
            style={{ color:"var(--text)" }}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
          />

          {/* Image preview */}
          {imageName && (
            <div className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background:"rgba(30,206,206,0.08)", border:"1px solid rgba(30,206,206,0.18)" }}>
              <span className="text-[11px] font-semibold truncate flex-1" style={{ color:"var(--teal)" }}>
                {imageName}
              </span>
              <button type="button" onClick={() => setImageName(undefined)}
                className="text-xs transition-opacity hover:opacity-60" style={{ color:"var(--text-label)" }}>
                ×
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3"
            style={{ borderColor:"var(--border-subtle)" }}>

            {/* Tag picker */}
            <div className="flex flex-wrap gap-1.5">
              {TAGS.map((t) => {
                const s = TAG_STYLE[t];
                const active = tag === t;
                return (
                  <button key={t} type="button" onClick={() => setTag(t)}
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all duration-150"
                    style={{
                      background: active ? s.bg : "transparent",
                      color: active ? s.color : "var(--text-label)",
                      border: active ? `1px solid ${s.color}40` : "1px solid var(--border)",
                    }}>
                    {t}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              {/* Media upload */}
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex h-8 w-8 items-center justify-center rounded-xl transition-opacity hover:opacity-70"
                style={{ background:"var(--border-subtle)", border:"1px solid var(--border)", color:"var(--teal)" }}
                title="Adjuntar imagen o video">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="1" y="3" width="12" height="9" rx="1.5"/>
                  <circle cx="4.5" cy="6" r="1"/>
                  <path d="M1 10l3-3 2.5 2.5L9 7.5 13 12"/>
                </svg>
              </button>

              {/* Character count */}
              <span className="text-[10px] tabular-nums"
                style={{ color: text.length > 240 ? "#f87171" : "var(--text-label)" }}>
                {280 - text.length}
              </span>

              {/* Post button */}
              <button type="button" onClick={submit}
                disabled={!text.trim() || text.length > 280}
                className="ximo-btn-press rounded-xl px-4 py-2 text-xs font-black transition-opacity hover:opacity-90 disabled:opacity-35 disabled:cursor-not-allowed"
                style={{ background:"var(--teal)", color:"#07131F" }}>
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Post card ──────────────────────────────────────────────────
function PostCard({
  post,
  onLike,
}: {
  post: Post;
  onLike: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ts = TAG_STYLE[post.tag];

  return (
    <article className="rounded-2xl transition-all duration-200 hover:border-[rgba(47,127,134,0.25)]"
      style={{ background: SURFACE, border:`1px solid ${BORDER}` }}>

      {/* Main content */}
      <div className="flex gap-3 p-4">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black"
          style={{ background: post.avatarBg, color: post.avatarColor,
            border: post.official ? "1.5px solid rgba(201,168,76,0.4)" : "none" }}>
          {post.initials}
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {/* Meta row */}
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-black" style={{ color:"var(--text)" }}>{post.user}</span>
            {post.official && (
              <span className="text-[9px] font-bold rounded-full px-1.5 py-0.5"
                style={{ background:"rgba(201,168,76,0.15)", color:"var(--gold)" }}>
                Oficial
              </span>
            )}
            <span className="text-[11px]" style={{ color:"var(--text-label)" }}>
              {post.sport}
            </span>
            <span className="text-[11px]" style={{ color:"var(--text-label)" }}>·</span>
            <span className="text-[11px]" style={{ color:"var(--text-label)" }}>{post.time}</span>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold ml-auto"
              style={{ background: ts.bg, color: ts.color }}>
              {post.tag}
            </span>
          </div>

          {/* Text */}
          <p className="text-sm leading-relaxed" style={{ color:"var(--text-2)" }}>
            {post.text}
          </p>

          {/* Media preview */}
          {post.imageName && (
            <div className="mt-3 flex items-center gap-2.5 rounded-xl px-3 py-2.5"
              style={{ background:"var(--surface-hover)", border:"1px solid var(--border)" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round">
                <rect x="1" y="3" width="12" height="9" rx="1.5"/>
                <circle cx="4.5" cy="6" r="1"/>
                <path d="M1 10l3-3 2.5 2.5L9 7.5 13 12"/>
              </svg>
              <span className="text-[11px] font-semibold" style={{ color:"var(--text-label)" }}>
                {post.imageName}
              </span>
            </div>
          )}

          {/* Action bar */}
          <div className="mt-3 flex items-center gap-1" style={{ borderTop:"1px solid var(--border-subtle)", paddingTop:"10px" }}>
            {/* Like */}
            <button type="button" onClick={() => onLike(post.id)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-150 hover:bg-[rgba(248,113,113,0.08)]"
              style={{ color: post.likedByMe ? "#f87171" : "var(--text-label)" }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill={post.likedByMe ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                <path d="M6.5 11S1 7.5 1 4a2.5 2.5 0 0 1 5.5 0A2.5 2.5 0 0 1 12 4c0 3.5-5.5 7-5.5 7Z"/>
              </svg>
              {post.likes}
            </button>

            {/* Comment */}
            <button type="button" onClick={() => setOpen(!open)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-150 hover:bg-[rgba(30,206,206,0.06)]"
              style={{ color:"var(--text-label)" }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M11 7.5A4.5 4.5 0 0 1 2 6a4.5 4.5 0 0 1 9 1.5v0A1.5 1.5 0 0 1 9.5 9L7 11.5V9H4.5"/>
              </svg>
              {post.comments}
            </button>

            {/* Share */}
            <button type="button"
              className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-150 hover:bg-[var(--border-subtle)]"
              style={{ color:"var(--text-label)" }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M8 2l3 3-3 3M11 5H5a3 3 0 0 0 0 6h1"/>
              </svg>
              Compartir
            </button>
          </div>
        </div>
      </div>

      {/* Replies */}
      {open && post.replies && post.replies.length > 0 && (
        <div className="border-t px-4 pb-3 pt-3 space-y-3"
          style={{ borderColor:"var(--border-subtle)" }}>
          {post.replies.map((r) => (
            <div key={r.user} className="flex gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-black"
                style={{ background:"var(--border-subtle)", color:"var(--teal)" }}>
                {r.initials}
              </div>
              <div className="flex-1 rounded-xl px-3 py-2"
                style={{ background:"var(--surface-hover)", border:"1px solid var(--border-subtle)" }}>
                <p className="text-[11px] font-bold mb-0.5" style={{ color:"rgba(127,175,178,0.8)" }}>{r.user}</p>
                <p className="text-xs leading-relaxed" style={{ color:"var(--text-2)" }}>{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

// ── Filter bar ─────────────────────────────────────────────────
const FILTERS = ["Todo", "Metas", "Avances", "Logros", "Dudas", "Recruiting"] as const;
type Filter = typeof FILTERS[number];
const FILTER_TAG: Record<Filter, Tag | null> = {
  Todo:null, Metas:"Meta", Avances:"Avance", Logros:"Logro", Dudas:"Duda", Recruiting:"Recruiting"
};

// ── Sidebar widgets ────────────────────────────────────────────
const TRENDING = [
  { label:"#50libre",         posts:24 },
  { label:"#NCAARechazado",   posts:18 },
  { label:"#Mariposa",        posts:15 },
  { label:"#CorreoCoach",     posts:12 },
  { label:"#D1México",        posts:9 },
];

const SUGGESTIONS = [
  { initials:"FS", name:"Fer Swim",   sport:"Nadadora · 2026", bg:"rgba(5,150,105,0.15)",   color:"#6ee7b7" },
  { initials:"VG", name:"Valeria G.", sport:"Nadadora · 2027", bg:"rgba(139,92,246,0.15)",  color:"#c4b5fd" },
  { initials:"DM", name:"Diego M.",   sport:"Nadador · 2027",  bg:"rgba(127,175,178,0.12)", color:"rgba(127,175,178,0.8)" },
];

// ── Main page ──────────────────────────────────────────────────
export default function ComunidadPage() {
  const [posts, setPosts]       = useState<Post[]>(INITIAL_POSTS);
  const [filter, setFilter]     = useState<Filter>("Todo");
  const [following, setFollowing] = useState<Set<string>>(new Set());

  const handleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, likedByMe: !p.likedByMe, likes: p.likedByMe ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handlePost = (text: string, tag: Tag, imageName?: string) => {
    const newPost: Post = {
      id: Date.now(),
      user: "Manny Z.",
      initials: "MZ",
      avatarBg: "rgba(30,206,206,0.15)",
      avatarColor: "var(--teal)",
      sport: "Nadador · 2027",
      tag,
      time: "Ahora",
      text,
      imageName,
      likes: 0,
      likedByMe: false,
      comments: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const filtered = filter === "Todo"
    ? posts
    : posts.filter((p) => p.tag === FILTER_TAG[filter]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">

      {/* ── Left: feed ── */}
      <div className="min-w-0 space-y-4">

        {/* Composer */}
        <Composer onPost={handlePost} />

        {/* Filter bar */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button key={f} type="button" onClick={() => setFilter(f)}
                className="shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-150"
                style={{
                  background: active ? "rgba(30,206,206,0.14)" : "var(--surface-hover)",
                  border: active ? "1px solid rgba(30,206,206,0.35)" : "1px solid var(--border)",
                  color: active ? "var(--teal)" : "var(--text-label)",
                }}>
                {f}
              </button>
            );
          })}
        </div>

        {/* Feed */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl py-12 text-center"
              style={{ background: SURFACE, border:`1px solid ${BORDER}` }}>
              <p className="text-sm font-bold" style={{ color:"var(--text-label)" }}>
                Sin publicaciones en esta categoría.
              </p>
            </div>
          ) : (
            filtered.map((p) => (
              <PostCard key={p.id} post={p} onLike={handleLike} />
            ))
          )}
        </div>

        <p className="py-3 text-center text-[10px]" style={{ color:"rgba(127,175,178,0.25)" }}>
          Comunidad Ximo · Solo atletas con suscripción activa
        </p>
      </div>

      {/* ── Right: sidebar ── */}
      <aside className="hidden space-y-4 lg:block">

        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5"
          style={{ background: SURFACE, border:`1px solid ${BORDER}` }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="5.5" cy="5.5" r="4"/><path d="M9.5 9.5l2.5 2.5"/>
          </svg>
          <input type="text" placeholder="Buscar en la comunidad"
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-[var(--text-label)]"
            style={{ color:"var(--text-2)" }} />
        </div>

        {/* Stats */}
        <div className="rounded-2xl p-4" style={{ background: SURFACE, border:`1px solid ${BORDER}` }}>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color:"var(--text-label)" }}>
            Comunidad
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label:"Atletas",      value:"47" },
              { label:"Posts hoy",    value: String(posts.length) },
              { label:"Respuestas",   value:"38" },
              { label:"Deportes",     value:"3" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl px-2.5 py-2 text-center"
                style={{ background:"var(--surface-hover)", border:"1px solid var(--border-subtle)" }}>
                <p className="text-lg font-black" style={{ color:"var(--teal)" }}>{value}</p>
                <p className="text-[9px] font-semibold" style={{ color:"var(--text-label)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div className="rounded-2xl p-4" style={{ background: SURFACE, border:`1px solid ${BORDER}` }}>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color:"var(--text-label)" }}>
            Tendencias
          </p>
          <div className="space-y-2">
            {TRENDING.map(({ label, posts: cnt }, i) => (
              <button key={label} type="button"
                className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 transition-colors hover:bg-[var(--border-subtle)]"
                style={{ border:"1px solid transparent" }}>
                <div className="flex items-center gap-2">
                  <span className="w-4 text-center text-[10px] font-black" style={{ color:"var(--text-label)" }}>
                    #{i+1}
                  </span>
                  <span className="text-xs font-bold" style={{ color:"var(--text-2)" }}>{label}</span>
                </div>
                <span className="text-[10px]" style={{ color:"var(--text-label)" }}>{cnt} posts</span>
              </button>
            ))}
          </div>
        </div>

        {/* Suggested athletes */}
        <div className="rounded-2xl p-4" style={{ background: SURFACE, border:`1px solid ${BORDER}` }}>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color:"var(--text-label)" }}>
            Atletas activos
          </p>
          <div className="space-y-3">
            {SUGGESTIONS.map((a) => (
              <div key={a.name} className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-black"
                  style={{ background: a.bg, color: a.color }}>
                  {a.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate" style={{ color:"var(--text)" }}>{a.name}</p>
                  <p className="text-[10px]" style={{ color:"var(--text-label)" }}>{a.sport}</p>
                </div>
                <button type="button"
                  onClick={() => setFollowing((prev) => {
                    const next = new Set(prev);
                    next.has(a.name) ? next.delete(a.name) : next.add(a.name);
                    return next;
                  })}
                  className="rounded-xl px-2.5 py-1 text-[10px] font-bold transition-all duration-150"
                  style={following.has(a.name)
                    ? { background:"rgba(30,206,206,0.12)", color:"var(--teal)", border:"1px solid rgba(30,206,206,0.25)" }
                    : { background:"var(--border-subtle)", color:"var(--text-label)", border:"1px solid var(--border)" }}>
                  {following.has(a.name) ? "Siguiendo" : "Seguir"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Brand opportunity CTA */}
        <div className="rounded-2xl p-4"
          style={{ background:"rgba(201,168,76,0.06)", border:"1px solid rgba(201,168,76,0.18)" }}>
          <p className="text-xs font-black mb-1.5" style={{ color:"var(--gold)" }}>¿Tu marca apoya atletas?</p>
          <p className="text-[11px] leading-relaxed mb-3" style={{ color:"var(--text-3)" }}>
            Conecta con atletas serios en proceso de recruiting.
          </p>
          <Link href="/app/promocionar"
            className="block text-center rounded-xl py-2 text-xs font-bold transition-opacity hover:opacity-80"
            style={{ background:"rgba(201,168,76,0.12)", color:"var(--gold)", border:"1px solid rgba(201,168,76,0.22)" }}>
            Promocionar con Ximo →
          </Link>
        </div>
      </aside>
    </div>
  );
}
