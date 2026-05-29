import Link from "next/link";
import PageHeader from "../components/PageHeader";
import ScrollReveal from "../../components/ScrollReveal";

const profile = {
  name: "Manuel Zuñiga",
  country: "México",
  sport: "Natación",
  graduationYear: "2027",
  mainEvents: "50 libre · 100 libre · 100 mariposa",
  goal: "College athlete en Estados Unidos",
  recruitingStatus: "En proceso activo",
};

const athleticInfo = [
  ["Club", "Club Tiburones GDL"],
  ["Eventos", profile.mainEvents],
  ["50 libre", "26.0s"],
  ["100 libre", "58.0s"],
  ["100 mariposa", "63.0s"],
  ["Temporada", "2024-25"],
];

const academicInfo = [
  ["GPA", "3.8"],
  ["SAT", "1340 (practice)"],
  ["TOEFL", "En preparación"],
  ["Graduación", profile.graduationYear],
  ["Idiomas", "Español · Inglés intermedio"],
];

const goals = [
  "Competir NCAA Division I en sprint libre",
  "Obtener beca parcial o completa",
  "Estudiar ingeniería o negocios",
  "Representar a México con orgullo",
];

const social = [
  ["Instagram", "@manuelzuniga.swim"],
  ["YouTube", "Manuel Zuñiga — Natación"],
  ["LinkedIn", "Próximamente"],
];

const upcomingUpdates = [
  "Actualizar tiempos post-competencia",
  "Subir video de 50 libre",
  "Completar perfil SAT/TOEFL",
  "Agregar cartas de recomendación",
];

const CARD = {
  background: "rgba(17,37,56,0.7)",
  border: "1px solid rgba(47,127,134,0.14)",
} as const;

function InfoGrid({ items }: { items: string[][] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-xl px-3.5 py-2.5"
          style={{ background: "rgba(47,127,134,0.06)", border: "1px solid rgba(47,127,134,0.1)" }}>
          <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.45)" }}>{label}</p>
          <p className="mt-0.5 text-sm font-semibold" style={{ color: "#F5F5F0" }}>{value}</p>
        </div>
      ))}
    </div>
  );
}

export default function PerfilPage() {
  return (
    <>
      {/* Header with settings icon */}
      <div className="mb-5 flex items-start justify-between">
        <PageHeader
          title="Perfil del atleta"
          subtitle="Tu información deportiva, académica y personal organizada para recruiting."
        />
        <Link
          href="/app/settings"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 hover:opacity-80"
          style={{ background:"rgba(47,127,134,0.1)", border:"1px solid rgba(47,127,134,0.2)", color:"#7FAFB2" }}
          title="Configuración"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="8" cy="8" r="2.5" />
            <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M2.93 2.93l1.06 1.06M12.01 12.01l1.06 1.06M2.93 13.07l1.06-1.06M12.01 3.99l1.06-1.06" />
          </svg>
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_288px]">

        {/* Left column */}
        <div className="space-y-4">

          <ScrollReveal>
          {/* Profile hero */}
          <div className="overflow-hidden rounded-2xl ximo-card-3d" style={CARD}>
            <div className="relative p-6"
              style={{ background: "linear-gradient(135deg, rgba(47,127,134,0.12) 0%, transparent 60%)" }}>
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)", filter: "blur(30px)" }} />
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-black"
                  style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.08))", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.2)" }}>
                  MZ
                </div>
                <div>
                  <h2 className="text-xl font-black" style={{ color: "#F5F5F0" }}>{profile.name}</h2>
                  <p className="mt-1 text-sm" style={{ color: "rgba(245,245,240,0.5)" }}>
                    {profile.sport} · {profile.country}
                  </p>
                  <span className="mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold"
                    style={{ background: "rgba(47,127,134,0.15)", border: "1px solid rgba(47,127,134,0.3)", color: "#7FAFB2" }}>
                    {profile.recruitingStatus}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm" style={{ color: "rgba(245,245,240,0.4)" }}>
                Objetivo: <span className="font-semibold" style={{ color: "#C9A84C" }}>{profile.goal}</span>
              </p>
            </div>
          </div>
          </ScrollReveal>

          <ScrollReveal delay={60}>
          {/* Deportiva */}
          <div className="rounded-2xl p-5 ximo-card-3d" style={CARD}>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.5)" }}>Información deportiva</p>
            <InfoGrid items={athleticInfo} />
          </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
          {/* Académica */}
          <div className="rounded-2xl p-5 ximo-card-3d" style={CARD}>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.5)" }}>Información académica</p>
            <InfoGrid items={academicInfo} />
          </div>
          </ScrollReveal>

          <ScrollReveal delay={140}>
          {/* Objetivos */}
          <div className="rounded-2xl p-5 ximo-card-3d" style={CARD}>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.5)" }}>Objetivos</p>
            <ul className="space-y-2.5">
              {goals.map((goal) => (
                <li key={goal} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: "#C9A84C" }} />
                  <span className="text-sm" style={{ color: "rgba(245,245,240,0.65)" }}>{goal}</span>
                </li>
              ))}
            </ul>
          </div>
          </ScrollReveal>

          <ScrollReveal delay={160}>
          {/* Redes */}
          <div className="rounded-2xl p-5 ximo-card-3d" style={CARD}>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.5)" }}>Redes sociales</p>
            <div className="space-y-2">
              {social.map(([platform, handle]) => (
                <div key={platform} className="flex items-center justify-between rounded-xl px-3.5 py-2.5"
                  style={{ background: "rgba(47,127,134,0.05)", border: "1px solid rgba(47,127,134,0.1)" }}>
                  <span className="text-sm font-semibold" style={{ color: "rgba(245,245,240,0.5)" }}>{platform}</span>
                  <span className="text-sm font-semibold" style={{ color: "#7FAFB2" }}>{handle}</span>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          <ScrollReveal delay={80}>
          {/* Subscription status */}
          <div className="rounded-2xl p-5 ximo-card-3d" style={{ ...CARD, border: "1px solid rgba(47,127,134,0.28)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full ximo-glow-pulse" style={{ background: "#2F7F86" }} />
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.6)" }}>
                Estado de suscripción
              </p>
            </div>
            <div className="space-y-2.5">
              {[
                ["Plan actual", "Activo"],
                ["Tipo de plan", "Mensual"],
                ["Próxima renovación", "15 de febrero"],
                ["Estado", "Activo"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "rgba(245,245,240,0.4)" }}>{k}</span>
                  <span className="text-xs font-bold" style={{ color: k === "Estado" ? "#6ee7b7" : "#F5F5F0" }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button"
                className="ximo-btn-press flex-1 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 hover:opacity-80"
                style={{ background: "rgba(47,127,134,0.15)", border: "1px solid rgba(47,127,134,0.3)", color: "#7FAFB2" }}>
                Gestionar plan
              </button>
              <Link href="/subscribe" className="flex-1">
                <button type="button"
                  className="ximo-btn-press w-full rounded-xl py-2.5 text-xs font-bold transition-all duration-200 hover:opacity-80"
                  style={{ background: "transparent", border: "1px solid rgba(47,127,134,0.15)", color: "rgba(245,245,240,0.45)" }}>
                  Ver planes
                </button>
              </Link>
            </div>
          </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
          {/* Next updates */}
          <div className="rounded-2xl p-5 ximo-card-3d" style={CARD}>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.5)" }}>Próximas actualizaciones</p>
            <p className="mb-4 text-[10px]" style={{ color: "rgba(245,245,240,0.3)" }}>Para completar tu perfil</p>
            <ul className="space-y-2">
              {upcomingUpdates.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: "rgba(201,168,76,0.5)" }} />
                  <span className="text-xs" style={{ color: "rgba(245,245,240,0.45)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
          {/* Visibility */}
          <div className="rounded-2xl p-5 ximo-card-3d" style={CARD}>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.5)" }}>Visibilidad</p>
            <p className="mt-3 text-3xl font-black" style={{ color: "#2F7F86" }}>12</p>
            <p className="text-xs" style={{ color: "rgba(245,245,240,0.4)" }}>universidades con perfil activo</p>
            <button type="button"
              className="ximo-btn-press mt-4 w-full rounded-xl py-2.5 text-xs font-bold transition-all duration-200 hover:opacity-80"
              style={{ background: "rgba(47,127,134,0.08)", border: "1px solid rgba(47,127,134,0.2)", color: "rgba(127,175,178,0.7)" }}>
              Copiar link de perfil
            </button>
          </div>
          </ScrollReveal>

          <ScrollReveal delay={180}>
          {/* Brand CTA */}
          <div className="rounded-2xl p-5 ximo-card-3d" style={{ ...CARD, border: "1px solid rgba(201,168,76,0.15)" }}>
            <div className="flex items-start gap-3 mb-4">
              <span className="text-base mt-0.5 shrink-0" style={{ color: "#C9A84C" }}>◈</span>
              <div>
                <p className="text-xs font-black" style={{ color: "#F5F5F0" }}>¿Representas una marca?</p>
                <p className="mt-1 text-[11px] leading-relaxed" style={{ color: "rgba(245,245,240,0.4)" }}>
                  Solicita revisión para promocionar productos, descuentos, patrocinios o campañas dentro de la comunidad Ximo.
                </p>
              </div>
            </div>
            <Link href="/app/promocionar">
              <button type="button"
                className="ximo-btn-press w-full rounded-xl py-2.5 text-xs font-bold transition-all duration-200 hover:opacity-90"
                style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: "#C9A84C" }}>
                Promocionar con Ximo →
              </button>
            </Link>
          </div>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
