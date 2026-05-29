import Image from "next/image";
import Link from "next/link";

const features = [
  "Dashboard deportivo completo",
  "Recruiting pipeline con pipeline por etapas",
  "Comunidad de atletas serios",
  "Seguimiento de tareas diarias",
  "Gestión de documentos",
  "Progreso y marcas deportivas",
  "Coaches y universidades NCAA",
  "Oportunidades de promoción de marca",
];

export default function SubscribePage() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16"
      style={{ background: "#07131F" }}
    >
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute" style={{ width: 600, height: 600, top: "-15%", left: "-10%", background: "radial-gradient(circle, rgba(47,127,134,0.16) 0%, transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute" style={{ width: 500, height: 500, bottom: "-10%", right: "-8%", background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 65%)", filter: "blur(80px)" }} />
      </div>
      <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-40" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[860px]">

        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <Image src="/brand/ximo-logo.png" alt="Ximo" width={100} height={34} className="h-8 w-auto object-contain" priority />
        </div>

        {/* Heading */}
        <div className="ximo-fade-up mb-12 text-center">
          <h1 className="text-3xl font-black sm:text-4xl" style={{ color: "#F5F5F0" }}>
            Elige tu plan
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed" style={{ color: "rgba(245,245,240,0.45)" }}>
            Ximo funciona con una suscripción activa. Elige un plan para desbloquear la app completa.
          </p>
        </div>

        {/* Plans grid */}
        <div className="ximo-fade-up delay-100 grid gap-5 sm:grid-cols-2">

          {/* Plan mensual */}
          <div
            className="ximo-lift rounded-3xl p-8"
            style={{
              background: "rgba(11,31,51,0.7)",
              border: "1px solid rgba(47,127,134,0.2)",
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.5)" }}>Plan mensual</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black" style={{ color: "#F5F5F0" }}>$XX</span>
              <span className="text-sm font-medium" style={{ color: "rgba(245,245,240,0.4)" }}>/mes</span>
            </div>
            <p className="mt-1 text-[11px]" style={{ color: "rgba(245,245,240,0.3)" }}>Facturado mensualmente</p>

            <div
              className="my-7 h-px w-full"
              style={{ background: "rgba(47,127,134,0.15)" }}
            />

            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <span className="text-xs shrink-0" style={{ color: "#2F7F86" }}>✓</span>
                  <span className="text-[12px]" style={{ color: "rgba(245,245,240,0.6)" }}>{f}</span>
                </li>
              ))}
            </ul>

            <Link href="/app" className="mt-8 block">
              <button
                type="button"
                className="ximo-btn-press w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 hover:opacity-80"
                style={{
                  background: "rgba(47,127,134,0.15)",
                  border: "1px solid rgba(47,127,134,0.3)",
                  color: "#7FAFB2",
                }}
              >
                Elegir plan mensual
              </button>
            </Link>
          </div>

          {/* Plan anual — recommended */}
          <div
            className="ximo-lift relative rounded-3xl p-8"
            style={{
              background: "linear-gradient(160deg, rgba(47,127,134,0.14) 0%, rgba(11,31,51,0.9) 60%)",
              border: "1px solid rgba(47,127,134,0.45)",
              boxShadow: "0 0 60px rgba(47,127,134,0.12)",
            }}
          >
            {/* Recommended badge */}
            <div
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest"
              style={{ background: "linear-gradient(90deg, #C9A84C, #E8C76B)", color: "#07131F" }}
            >
              Recomendado
            </div>

            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.5)" }}>Plan anual</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black" style={{ color: "#F5F5F0" }}>$XX</span>
              <span className="text-sm font-medium" style={{ color: "rgba(245,245,240,0.4)" }}>/mes</span>
            </div>
            <p className="mt-1 text-[11px]" style={{ color: "rgba(201,168,76,0.6)" }}>
              Facturado anualmente · Mejor precio
            </p>

            <div
              className="my-7 h-px w-full"
              style={{ background: "rgba(47,127,134,0.25)" }}
            />

            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <span className="text-xs shrink-0" style={{ color: "#C9A84C" }}>✓</span>
                  <span className="text-[12px]" style={{ color: "rgba(245,245,240,0.7)" }}>{f}</span>
                </li>
              ))}
            </ul>

            <Link href="/app" className="mt-8 block">
              <button
                type="button"
                className="ximo-btn-press w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #2F7F86, #1F5F66)",
                  color: "#F5F5F0",
                  boxShadow: "0 4px 24px rgba(47,127,134,0.35)",
                }}
              >
                Elegir plan anual
              </button>
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="ximo-fade-up delay-300 mt-8 text-center text-[10px]" style={{ color: "rgba(245,245,240,0.22)" }}>
          Sin plan gratuito · Cancela cuando quieras · Acceso inmediato al activar
        </p>

        <div className="ximo-fade-up delay-400 mt-6 flex justify-center gap-5 text-[10px] font-medium" style={{ color: "rgba(245,245,240,0.3)" }}>
          <Link href="/login" className="transition-opacity hover:opacity-70">Iniciar sesión</Link>
          <span style={{ color: "rgba(47,127,134,0.3)" }}>·</span>
          <Link href="/" className="transition-opacity hover:opacity-70">Página principal</Link>
        </div>
      </div>
    </div>
  );
}
