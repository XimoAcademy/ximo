import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen" style={{ background: "#07131F" }}>

      {/* ── Left panel — decorative ── */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-[44%] xl:w-[48%] flex-col justify-between p-14"
        style={{
          background: "linear-gradient(160deg, #0B1F33 0%, #07131F 60%, #0B1F33 100%)",
          borderRight: "1px solid rgba(47,127,134,0.1)",
        }}>

        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute" style={{ width: 500, height: 500, top: "-10%", left: "-10%", background: "radial-gradient(circle, rgba(47,127,134,0.18) 0%, transparent 65%)", filter: "blur(60px)" }} />
          <div className="absolute" style={{ width: 400, height: 400, bottom: "0%", right: "-5%", background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 65%)", filter: "blur(60px)" }} />
        </div>

        {/* Grid overlay */}
        <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-50" />

        {/* Logo */}
        <div className="relative">
          <Image src="/brand/ximo-logo.png" alt="Ximo" width={110} height={36} className="h-9 w-auto object-contain" priority />
          <span
            className="mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase"
            style={{ border: "1px solid rgba(201,168,76,0.25)", color: "#C9A84C", background: "rgba(201,168,76,0.08)" }}
          >
            Suscripción activa
          </span>
        </div>

        {/* Feature list */}
        <div className="relative space-y-7">
          {[
            { icon: "◫", label: "Universidades NCAA", sub: "Encuentra programas reales alineados a tu nivel" },
            { icon: "⬘", label: "Coaches reales", sub: "Construye relaciones y da seguimiento" },
            { icon: "◑", label: "Progreso deportivo", sub: "Visualiza marcas y el camino hacia tus metas" },
            { icon: "◉", label: "Comunidad atleta", sub: "Avanza con otros atletas serios" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3.5">
              <span className="mt-0.5 text-base shrink-0" style={{ color: "#C9A84C" }}>{item.icon}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: "#F5F5F0" }}>{item.label}</p>
                <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "rgba(245,245,240,0.38)" }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="relative text-[10px] font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.15)" }}>
          Ximo · México primero
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="mb-10 text-center lg:hidden">
            <Image src="/brand/ximo-logo.png" alt="Ximo" width={110} height={38} className="mx-auto h-10 w-auto object-contain" priority />
          </div>

          {/* Heading */}
          <div className="ximo-fade-up mb-8">
            <h1 className="text-3xl font-black" style={{ color: "#F5F5F0" }}>
              Inicia sesión en Ximo
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(245,245,240,0.45)" }}>
              Entra a tu cuenta para continuar con tu dashboard deportivo.
            </p>
          </div>

          {/* Form */}
          <div className="ximo-fade-up delay-100 space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.6)" }}>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="atleta@ejemplo.com"
                className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:ring-2"
                style={{
                  background: "rgba(17,37,56,0.8)",
                  border: "1px solid rgba(47,127,134,0.2)",
                  color: "#F5F5F0",
                }}
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.6)" }}>
                  Contraseña
                </label>
                <span className="text-[10px] font-semibold cursor-pointer transition-opacity hover:opacity-70" style={{ color: "#7FAFB2" }}>
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:ring-2"
                style={{
                  background: "rgba(17,37,56,0.8)",
                  border: "1px solid rgba(47,127,134,0.2)",
                  color: "#F5F5F0",
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="ximo-fade-up delay-200 mt-6 space-y-3">
            <Link href="/app">
              <button
                type="button"
                className="ximo-btn-press w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #2F7F86, #1F5F66)",
                  color: "#F5F5F0",
                  boxShadow: "0 4px 24px rgba(47,127,134,0.3)",
                }}
              >
                Entrar
              </button>
            </Link>
            <Link href="/register">
              <button
                type="button"
                className="ximo-btn-press w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 hover:opacity-80"
                style={{
                  background: "rgba(17,37,56,0.6)",
                  border: "1px solid rgba(47,127,134,0.2)",
                  color: "rgba(245,245,240,0.7)",
                }}
              >
                Crear cuenta
              </button>
            </Link>
          </div>

          {/* Subscription validation block */}
          <div
            className="ximo-fade-up delay-300 mt-8 rounded-2xl p-4"
            style={{
              background: "rgba(47,127,134,0.06)",
              border: "1px solid rgba(47,127,134,0.15)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px]"
                style={{ background: "rgba(47,127,134,0.15)", color: "#7FAFB2" }}
              >
                ✓
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: "#7FAFB2" }}>Validación de suscripción</p>
                <p className="mt-1 text-[11px] leading-relaxed" style={{ color: "rgba(245,245,240,0.4)" }}>
                  Después de iniciar sesión, Ximo verificará si tu plan mensual o anual está activo.
                </p>
              </div>
            </div>
          </div>

          <p className="ximo-fade-up delay-400 mt-4 text-center text-[10px]" style={{ color: "rgba(245,245,240,0.22)" }}>
            Tu acceso se valida con una suscripción activa.
          </p>

          {/* Nav links */}
          <div className="ximo-fade-up delay-500 mt-8 flex items-center justify-center gap-5 text-[10px] font-medium" style={{ color: "rgba(245,245,240,0.3)" }}>
            <Link href="/" className="transition-opacity hover:opacity-70">Página principal</Link>
            <span style={{ color: "rgba(47,127,134,0.3)" }}>·</span>
            <Link href="/build-log" className="transition-opacity hover:opacity-70">Build log</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
