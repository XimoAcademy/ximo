"use client";
// app/app/comunidad/page.tsx — dark premium social feed
import Link from "next/link";
import { useState } from "react";
import { SectionHeader } from "../components/ui";

type Tag = "Meta"|"Duda"|"Avance"|"Logro"|"Recruiting"|"Entrenamiento"|"Oficial"|"Marca";
type FeedItem = { kind:"post"; data:Post } | { kind:"brand"; data:BrandCard };

interface Post { id:number; user:string; initials:string; bgC:string; textC:string; sport?:string; tag:Tag; time:string; text:string; likes:number; comments:number; answered?:boolean; official?:boolean; mediaPlaceholder?:string; replies?:{user:string;initials:string;text:string}[]; }
interface BrandCard { id:number; brand:string; logo:string; category:string; headline:string; description:string; cta:string; format:string; }

const TAG_S: Record<Tag,{bg:string;color:string}> = {
  Meta:          { bg:"rgba(47,127,134,0.15)",   color:"#7FAFB2" },
  Duda:          { bg:"rgba(251,191,36,0.12)",   color:"#fbbf24" },
  Avance:        { bg:"rgba(5,150,105,0.12)",    color:"#6ee7b7" },
  Logro:         { bg:"rgba(201,168,76,0.12)",   color:"#C9A84C" },
  Recruiting:    { bg:"rgba(139,92,246,0.12)",   color:"#c4b5fd" },
  Entrenamiento: { bg:"rgba(245,245,240,0.08)",  color:"rgba(245,245,240,0.6)" },
  Oficial:       { bg:"rgba(201,168,76,0.2)",    color:"#C9A84C" },
  Marca:         { bg:"rgba(47,127,134,0.1)",    color:"#7FAFB2" },
};

const FILTERS = ["Todo","Dudas","Avances","Logros","Recruiting","Entrenamiento","Marcas"] as const;
type Filter = typeof FILTERS[number];
const FILTER_TAG: Record<Filter,Tag|null> = { Todo:null, Dudas:"Duda", Avances:"Avance", Logros:"Logro", Recruiting:"Recruiting", Entrenamiento:"Entrenamiento", Marcas:null };

const posts: Post[] = [
  { id:1, user:"Ximo", initials:"XI", bgC:"rgba(201,168,76,0.15)", textC:"#C9A84C", tag:"Oficial", time:"Hace 2 h", official:true,
    text:"Mejoramos la sección de Coaches: ahora puedes ver el estilo de cada entrenador y si tiene apertura activa. Revísalo.", likes:34, comments:12 },
  { id:2, user:"Manny", initials:"MZ", bgC:"rgba(201,168,76,0.12)", textC:"#C9A84C", sport:"Nadador · 2027", tag:"Duda", time:"Hace 3 h",
    text:"¿Qué es lo más difícil al contactar a un coach por primera vez? ¿Cómo saben si estás en su rango de tiempos?", likes:17, comments:9, answered:true,
    replies:[{user:"Fer Swim",initials:"FS",text:"No saber si el nivel es suficiente. Esperé demasiado antes de escribir."},{user:"Valeria",initials:"VA",text:"El idioma. Escribir en inglés formal sin sonar robótico."}] },
  { id:3, user:"Fer Swim", initials:"FS", bgC:"rgba(5,150,105,0.15)", textC:"#6ee7b7", sport:"Nadadora · 2026", tag:"Logro", time:"Hace 5 h",
    text:"¡Nuevo PB en 50 libre: 25.1 SCY! Semanas de trabajo específico de salida dieron resultado 🔥", likes:22, comments:9,
    mediaPlaceholder:"🏊  Clip de competencia · 50 libre · Meet GDL Invitational" },
  { id:4, user:"Carlos Nado", initials:"CN", bgC:"rgba(47,127,134,0.15)", textC:"#7FAFB2", sport:"Nadador · 2026", tag:"Duda", time:"Hace 6 h",
    text:"Mi tiempo en 50 libre es 26.8 SCY. ¿Es realista apuntar a D1? Estoy en clase 2026.", likes:8, comments:5, answered:true,
    replies:[{user:"Manny",initials:"MZ",text:"D1 bajo puede aceptar 26.x. La tendencia importa más que el tiempo actual."},{user:"Fer Swim",initials:"FS",text:"Empecé con 26.5 y bajé a 25.1 en dos temporadas. El proceso funciona."}] },
  { id:5, user:"Valeria", initials:"VA", bgC:"rgba(139,92,246,0.15)", textC:"#c4b5fd", sport:"Nadadora · 2027", tag:"Recruiting", time:"Hace 1 d",
    text:"¿Cómo escriben un follow-up cuando el coach ya respondió pero sin avance? No quiero parecer pesada.", likes:14, comments:7, answered:true,
    replies:[{user:"Manny",initials:"MZ",text:"Espera 2 semanas. Luego envía algo concreto: tiempo nuevo, meet próximo. No preguntes si sigue interesado."}] },
  { id:6, user:"Diego", initials:"DM", bgC:"rgba(245,245,240,0.08)", textC:"rgba(245,245,240,0.7)", sport:"Nadador · 2027", tag:"Logro", time:"Hace 1 d",
    text:"¡Un coach de D2 me respondió hoy! Llevo 3 semanas usando la plantilla de correos de ximo. Sí funciona 🙌", likes:31, comments:14 },
  { id:7, user:"Manny", initials:"MZ", bgC:"rgba(201,168,76,0.12)", textC:"#C9A84C", sport:"Nadador · 2027", tag:"Entrenamiento", time:"Hace 2 d",
    text:"Meta esta temporada: bajar el 100 mariposa a 58.0 SCY. Empiezo bloque de fuerza específica. ¿Alguien trabajando mariposa?", likes:11, comments:6,
    mediaPlaceholder:"📊  Plan de entrenamiento · Bloque Fuerza Específica · 6 semanas" },
];

const brands: BrandCard[] = [
  { id:101, brand:"Aquasport MX",  logo:"🏊", category:"Equipo deportivo",          format:"Oferta",   headline:"Trajes de competencia para atletas en recruiting", description:"Descuento exclusivo para atletas ximo. Trajes técnicos de alto rendimiento.", cta:"Ver oportunidad" },
  { id:102, brand:"GNC Sport",     logo:"💊", category:"Suplementos y recuperación", format:"Producto", headline:"Protocolo de recuperación para alto rendimiento",   description:"Suplementos validados para nadadores, sin sustancias prohibidas.", cta:"Ver oportunidad" },
  { id:103, brand:"Arena México",  logo:"⚡", category:"Equipo deportivo",          format:"Producto", headline:"Lentes y gorras de competencia — 2025",             description:"Arena busca atletas ximo para probar su nueva línea antes del lanzamiento.", cta:"Ver oportunidad" },
  { id:104, brand:"Recov+",        logo:"🧊", category:"Recuperación",              format:"Oferta",   headline:"Herramientas de recuperación activa",               description:"Compresión, foam rolling y protocolos de baño de contraste.", cta:"Ver oportunidad" },
];

const feed: FeedItem[] = [
  {kind:"post",data:posts[0]},{kind:"post",data:posts[1]},{kind:"brand",data:brands[0]},
  {kind:"post",data:posts[2]},{kind:"post",data:posts[3]},{kind:"brand",data:brands[1]},
  {kind:"post",data:posts[4]},{kind:"post",data:posts[5]},{kind:"brand",data:brands[2]},
  {kind:"post",data:posts[6]},{kind:"brand",data:brands[3]},
];

const hotTopics = [
  {label:"Tiempos D1 realistas 2025",count:23},{label:"Correo de follow-up",count:18},
  {label:"Becas parciales vs completas",count:14},{label:"SAT para atletas",count:11},{label:"Visitas oficiales",count:9},
];

const top5 = [
  {name:"Manny",initials:"MZ",metric:"12d racha",me:true},
  {name:"Fer Swim",initials:"FS",metric:"10d racha",me:false},
  {name:"Carlos Nado",initials:"CN",metric:"9d racha",me:false},
  {name:"Valeria",initials:"VA",metric:"7d racha",me:false},
  {name:"Diego",initials:"DM",metric:"5d racha",me:false},
];

const CARD = { background:"rgba(17,37,56,0.85)", border:"1px solid rgba(47,127,134,0.12)", boxShadow:"0 4px 24px rgba(0,0,0,0.3)" };

function PostCard({ post, likes, setLikes }: { post:Post; likes:number; setLikes:(n:number)=>void }) {
  const [open,setOpen] = useState(false);
  const t = TAG_S[post.tag];
  return (
    <div className="rounded-2xl p-4 ximo-lift" style={CARD}>
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-black"
          style={{ background:post.bgC, color:post.textC }}>
          {post.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <p className="text-sm font-bold text-white">{post.user}</p>
            {post.official && <span className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase" style={{ background:"rgba(201,168,76,0.2)", color:"#C9A84C" }}>Oficial</span>}
            {post.sport && <span className="text-[10px]" style={{ color:"rgba(127,175,178,0.45)" }}>{post.sport}</span>}
            <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background:t.bg, color:t.color }}>{post.tag}</span>
            <span className="ml-auto text-[10px]" style={{ color:"rgba(127,175,178,0.35)" }}>{post.time}</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color:"rgba(245,245,240,0.75)" }}>{post.text}</p>
          {post.mediaPlaceholder && (
            <div className="mt-2.5 rounded-xl px-4 py-2.5 text-xs" style={{ background:"rgba(47,127,134,0.08)", border:"1px solid rgba(47,127,134,0.12)", color:"rgba(127,175,178,0.6)" }}>
              {post.mediaPlaceholder}
            </div>
          )}
          <div className="mt-3 flex items-center gap-0.5 flex-wrap">
            <button type="button" onClick={() => setLikes(likes + 1)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors duration-150 hover:text-[#C9A84C]"
              style={{ color:"rgba(127,175,178,0.5)" }}>
              ♥ {likes}
            </button>
            <button type="button" onClick={() => setOpen(!open)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors duration-150 hover:text-[#7FAFB2]"
              style={{ color:"rgba(127,175,178,0.5)" }}>
              ↩ {post.comments}
            </button>
            <button type="button"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-colors"
              style={{ color:"rgba(127,175,178,0.5)" }}>
              ↗ Compartir
            </button>
            {post.answered && (
              <span className="ml-auto flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold"
                style={{ border:"1px solid rgba(5,150,105,0.2)", background:"rgba(5,150,105,0.1)", color:"#6ee7b7" }}>
                ✓ Respondido
              </span>
            )}
          </div>
          {open && post.replies && (
            <div className="mt-3 space-y-2 border-l-2 pl-3" style={{ borderColor:"rgba(47,127,134,0.2)" }}>
              {post.replies.map(r => (
                <div key={r.user} className="flex gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[9px] font-black"
                    style={{ background:"rgba(47,127,134,0.12)", color:"#7FAFB2" }}>{r.initials}</div>
                  <div>
                    <p className="text-[11px] font-bold text-white">{r.user}</p>
                    <p className="text-[11px] leading-relaxed" style={{ color:"rgba(127,175,178,0.55)" }}>{r.text}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[9px] font-black"
                  style={{ background:"rgba(201,168,76,0.12)", color:"#C9A84C" }}>MZ</div>
                <div className="flex-1 rounded-lg px-3 py-1.5 text-[11px]"
                  style={{ border:"1px solid rgba(47,127,134,0.12)", color:"rgba(127,175,178,0.4)", background:"rgba(47,127,134,0.04)" }}>
                  Escribe una respuesta…
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BrandFeed({ b }: { b:BrandCard }) {
  return (
    <div className="rounded-2xl p-4" style={{ background:"rgba(17,37,56,0.9)", border:"1px solid rgba(47,127,134,0.2)", boxShadow:"0 0 20px rgba(47,127,134,0.08),0 4px 24px rgba(0,0,0,0.35)" }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color:"rgba(127,175,178,0.4)" }}>Anuncio filtrado para atletas ximo</span>
        <span className="ml-auto rounded-full px-2 py-0.5 text-[9px] font-bold"
          style={{ border:"1px solid rgba(47,127,134,0.25)", background:"rgba(47,127,134,0.1)", color:"#7FAFB2" }}>✓ Marca verificada</span>
      </div>
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ background:"rgba(47,127,134,0.1)", border:"1px solid rgba(47,127,134,0.15)" }}>{b.logo}</div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <p className="text-sm font-bold text-white">{b.brand}</p>
            <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold" style={{ background:"rgba(47,127,134,0.08)", color:"rgba(127,175,178,0.5)", border:"1px solid rgba(47,127,134,0.1)" }}>{b.category}</span>
            <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold" style={{ background:"rgba(47,127,134,0.08)", color:"rgba(127,175,178,0.5)", border:"1px solid rgba(47,127,134,0.1)" }}>{b.format}</span>
            <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background:"rgba(47,127,134,0.12)", color:"#7FAFB2", border:"1px solid rgba(47,127,134,0.2)" }}>Campaña activa</span>
          </div>
          <p className="text-sm font-semibold leading-snug mb-1 text-white">{b.headline}</p>
          <p className="text-xs leading-relaxed mb-3" style={{ color:"rgba(127,175,178,0.5)" }}>{b.description}</p>
          <div className="flex items-center gap-3">
            <button type="button"
              className="rounded-xl px-4 py-1.5 text-[11px] font-bold text-white transition-all duration-200 hover:scale-105"
              style={{ background:"#2F7F86", boxShadow:"0 0 12px rgba(47,127,134,0.3)" }}>
              {b.cta} →
            </button>
            <span className="text-[10px]" style={{ color:"rgba(127,175,178,0.35)" }}>Revisado por ximo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComunidadPage() {
  const [tab,setTab] = useState<Filter>("Todo");
  const [likes,setLikes] = useState<Record<number,number>>(Object.fromEntries(posts.map(p=>[p.id,p.likes])));

  const visible = feed.filter(item => {
    if (tab==="Todo") return true;
    if (tab==="Marcas") return item.kind==="brand";
    if (item.kind==="brand") return false;
    const t = FILTER_TAG[tab];
    return (item.data as Post).tag === t;
  });

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_256px]">
      <div className="space-y-4 min-w-0">
        <div className="ximo-fade-up">
          <h1 className="text-xl font-black text-white sm:text-2xl" style={{ textShadow:"0 2px 12px rgba(47,127,134,0.3)" }}>Comunidad</h1>
          <p className="mt-1 text-sm" style={{ color:"rgba(127,175,178,0.55)" }}>Atletas compartiendo metas, avances y dudas reales.</p>
        </div>

        {/* Composer */}
        <div className="rounded-2xl p-4 ximo-fade-up delay-100" style={CARD}>
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-black"
              style={{ background:"rgba(201,168,76,0.12)", color:"#C9A84C" }}>MZ</div>
            <div className="flex-1">
              <div className="w-full rounded-xl px-4 py-3 text-sm cursor-text"
                style={{ background:"rgba(47,127,134,0.05)", border:"1px solid rgba(47,127,134,0.12)", color:"rgba(127,175,178,0.4)" }}>
                Comparte una foto, meta, duda o avance…
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {(["Meta","Duda","Avance","Logro","Recruiting","Entrenamiento"] as Tag[]).map(tag => {
                  const t = TAG_S[tag];
                  return <button key={tag} type="button"
                    className="rounded-full px-2.5 py-1 text-[10px] font-bold transition-opacity hover:opacity-80"
                    style={{ background:t.bg, color:t.color }}>{tag}</button>;
                })}
                <button type="button"
                  className="ml-auto rounded-xl px-4 py-1.5 text-[11px] font-bold text-white transition-all duration-200 hover:scale-105"
                  style={{ background:"#2F7F86" }}>Publicar</button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 ximo-fade-up delay-100">
          {FILTERS.map(f => (
            <button key={f} type="button" onClick={() => setTab(f)}
              className="shrink-0 rounded-xl px-3.5 py-2 text-[11px] font-bold transition-all duration-200"
              style={tab===f
                ? { background:"rgba(47,127,134,0.25)", color:"#7FAFB2", border:"1px solid rgba(47,127,134,0.3)", boxShadow:"0 0 12px rgba(47,127,134,0.2)" }
                : { background:"rgba(17,37,56,0.6)", color:"rgba(127,175,178,0.45)", border:"1px solid rgba(47,127,134,0.1)" }}>
              {f}
            </button>
          ))}
        </div>

        {visible.map(item =>
          item.kind==="post"
            ? <PostCard key={`p${item.data.id}`} post={item.data as Post}
                likes={likes[(item.data as Post).id]} setLikes={n=>setLikes(p=>({...p,[(item.data as Post).id]:n}))} />
            : <BrandFeed key={`b${item.data.id}`} b={item.data as BrandCard} />
        )}

        {visible.length===0 && (
          <div className="rounded-2xl py-8 text-center text-sm" style={{ border:"1px dashed rgba(47,127,134,0.15)", color:"rgba(127,175,178,0.35)" }}>
            No hay publicaciones en esta categoría todavía.
          </div>
        )}
        <div className="rounded-2xl py-3 text-center text-xs" style={{ border:"1px dashed rgba(47,127,134,0.12)", color:"rgba(127,175,178,0.25)" }}>
          Comunidad Ximo · Solo atletas con suscripción activa
        </div>
      </div>

      {/* Right */}
      <div className="space-y-4">
        {[{
          title:"Temas activos", subtitle:"Esta semana",
          content:<div className="space-y-1.5">{hotTopics.map((t,i)=>(
            <div key={t.label} className="flex items-center gap-2.5 rounded-xl px-3 py-2 cursor-pointer transition-all duration-150 hover:bg-[rgba(47,127,134,0.06)]"
              style={{ border:"1px solid rgba(47,127,134,0.08)" }}>
              <span className="w-4 text-center text-[10px] font-black" style={{ color:"rgba(127,175,178,0.35)" }}>#{i+1}</span>
              <p className="flex-1 text-[11px] font-semibold text-white leading-snug">{t.label}</p>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background:"rgba(47,127,134,0.1)", color:"#7FAFB2" }}>{t.count}</span>
            </div>
          ))}</div>
        },{
          title:"Ranking positivo", subtitle:"Racha más larga",
          content:<div className="space-y-1.5">{top5.map((a,i)=>(
            <div key={a.name} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
              style={a.me ? { background:"rgba(201,168,76,0.1)", border:"1px solid rgba(201,168,76,0.2)" } : { border:"1px solid rgba(47,127,134,0.08)" }}>
              <span className="w-4 text-center text-[10px] font-black" style={{ color:"rgba(127,175,178,0.35)" }}>#{i+1}</span>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-black"
                style={{ background:"rgba(47,127,134,0.12)", color:"#7FAFB2" }}>{a.initials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white truncate">{a.name} {a.me && <span style={{color:"#C9A84C"}}>(tú)</span>}</p>
                <p className="text-[10px]" style={{ color:"rgba(127,175,178,0.4)" }}>{a.metric}</p>
              </div>
            </div>
          ))}</div>
        }].map(s => (
          <div key={s.title} className="rounded-2xl p-4" style={CARD}>
            <SectionHeader dark title={s.title} subtitle={s.subtitle} />
            {s.content}
          </div>
        ))}

        {/* Streak */}
        <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid rgba(47,127,134,0.15)", boxShadow:"0 0 24px rgba(47,127,134,0.1)" }}>
          <div className="p-4" style={{ background:"linear-gradient(135deg,rgba(47,127,134,0.2),rgba(47,127,134,0.05))" }}>
            <p className="text-xs font-black text-white">🔥 Racha comunitaria</p>
            <p className="mt-0.5 text-[10px]" style={{ color:"rgba(127,175,178,0.45)" }}>7 días activos seguidos</p>
          </div>
          <div className="p-4" style={{ background:"rgba(17,37,56,0.8)" }}>
            <p className="text-[11px] italic leading-relaxed" style={{ color:"rgba(127,175,178,0.5)" }}>"Pequeñas acciones diarias crean oportunidades reales."</p>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full" style={{ background:"rgba(47,127,134,0.1)" }}>
              <div className="h-full w-[23%] rounded-full" style={{ background:"linear-gradient(90deg,#2F7F86,#C9A84C)" }} />
            </div>
            <p className="mt-1.5 text-[10px]" style={{ color:"rgba(127,175,178,0.3)" }}>7 de 30 días</p>
          </div>
        </div>

        {/* Brand CTA */}
        <div className="rounded-2xl p-4 text-center" style={CARD}>
          <p className="text-base mb-1">🏷</p>
          <p className="text-xs font-black text-white">¿Representas una marca?</p>
          <p className="mt-1 text-[10px] leading-relaxed" style={{ color:"rgba(127,175,178,0.45)" }}>Conecta con atletas de forma curada.</p>
          <Link href="/app/promocionar"
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:scale-105"
            style={{ background:"rgba(47,127,134,0.15)", border:"1px solid rgba(47,127,134,0.25)" }}>
            Soy una marca →
          </Link>
        </div>
      </div>
    </div>
  );
}
