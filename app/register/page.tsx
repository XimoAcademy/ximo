import Image from "next/image";
import Link from "next/link";

const SPORTS = ["Natación", "Polo acuático", "Atletismo", "Otro"];
const COUNTRIES = ["México", "Estados Unidos", "Colombia", "Argentina", "Otro"];
const YEARS = ["2025", "2026", "2027", "2028", "2029"];

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen" style={{ background: "#07131F" }}>

      {/* ── Left panel ── */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-[38%] flex-col justify-between p-14"
        style={{
          background: "linear-gradient(160deg, #0B1F33 0%, #07131F 60%, #0B1F33 100%)",
          borderRight: "1px solid rgba(47,127,134,0.1)",
        }}>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute" style={{ width: 450, height: 450, top: "-5%", right: "-10%", background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 65%)", filter: "blur(60px)" }} />
          <div className="absolute" style={{ width: 400, height: 400, bottom: "5%", left: "-5%", background: "radial-gradient(circle, rgba(47,127,134,0.16) 0%, transparent 65%)", filter: "blur(60px)" }} />
        </div>
        <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-50" />

        <div className="relative">
          <Image src="/brand/ximo-logo.png" alt="Ximo" width={110} height={36} className="h-9 w-auto object-contain" priority />
        </div>

        <div className="relative space-y-5">
          <p className="text-2xl font-black leading-tight" style={{ color: "#F5F5F0" }}>
            Tu camino empieza aquí.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(245,245,240,0.4)" }}>
            Ximo es para el atleta mexicano que quiere organizarse, crecer y llegar a donde se lo propone.
          </p>
          <div className="space-y-3 pt-2">
            {[
              "Dashboard deportivo completo",
              "Recruiting pipeline personalizado",
              "Comunidad de atletas serios",
              "Seguimiento de coaches y universidades",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <div className="h-1 w-1 rounded-full shrink-0" style={{ background: "#C9A84C" }} />
                <p className="text-sm" style={{ color: "rgba(245,245,240,0.55)" }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[10px] font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.15)" }}>
          Ximo · México primero
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">

          <div className="mb-8 text-center lg:hidden">
            <Image src="/brand/ximo-logo.png" alt="Ximo" width={110} height={38} className="mx-auto h-10 w-auto object-contain" priority />
          </div>

          <div className="ximo-fade-up mb-7">
            <h1 className="text-3xl font-black" style={{ color: "#F5F5F0" }}>
              Crea tu cuenta en Ximo
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(245,245,240,0.45)" }}>
              Empieza organizando tu camino deportivo, académico y de recruiting.
            </p>
          </div>

          {/* Form fields */}
          <div className="ximo-fade-up delay-100 space-y-3.5">
            {/* Nombre */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.6)" }}>Nombre completo</label>
              <input
                type="text"
                placeholder="Manuel Zúñiga"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{ background: "rgba(17,37,56,0.8)", border: "1px solid rgba(47,127,134,0.2)", color: "#F5F5F0" }}
              />
            </div>
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.6)" }}>Correo electrónico</label>
              <input
                type="email"
                placeholder="atleta@ejemplo.com"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{ background: "rgba(17,37,56,0.8)", border: "1px solid rgba(47,127,134,0.2)", color: "#F5F5F0" }}
              />
            </div>
            {/* Password */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.6)" }}>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
                style={{ background: "rgba(17,37,56,0.8)", border: "1px solid rgba(47,127,134,0.2)", color: "#F5F5F0" }}
              />
            </div>
            {/* 3-col grid */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.6)" }}>Deporte</label>
                <select
                  className="w-full rounded-xl px-3 py-3 text-sm outline-none transition-all duration-200 appearance-none"
                  style={{ background: "rgba(17,37,56,0.8)", border: "1px solid rgba(47,127,134,0.2)", color: "#F5F5F0" }}
                >
                  {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.6)" }}>País</label>
                <select
                  className="w-full rounded-xl px-3 py-3 text-sm outline-none transition-all duration-200 appearance-none"
                  style={{ background: "rgba(17,37,56,0.8)", border: "1px solid rgba(47,127,134,0.2)", color: "#F5F5F0" }}
                >
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.6)" }}>Graduación</label>
                <select
                  className="w-full rounded-xl px-3 py-3 text-sm outline-none transition-all duration-200 appearance-none"
                  style={{ background: "rgba(17,37,56,0.8)", border: "1px solid rgba(47,127,134,0.2)", color: "#F5F5F0" }}
                >
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Plan preview */}
          <div className="ximo-fade-up delay-200 mt-6 grid grid-cols-2 gap-3">
            {/* Mensual */}
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(17,37,56,0.7)", border: "1px solid rgba(47,127,134,0.18)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.5)" }}>Mensual</p>
              <p className="mt-2 text-xl font-black" style={{ color: "#F5F5F0" }}>$XX<span className="text-xs font-medium">/mes</span></p>
              <p className="mt-1 text-[10px]" style={{ color: "rgba(245,245,240,0.35)" }}>Facturado mensual</p>
            </div>
            {/* Anual */}
            <div
              className="relative rounded-2xl p-4"
              style={{
                background: "rgba(47,127,134,0.1)",
                border: "1px solid rgba(47,127,134,0.35)",
              }}
            >
              <div
                className="absolute -top-2 left-3 rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest"
                style={{ background: "#C9A84C", color: "#07131F" }}
              >
                Recomendado
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(127,175,178,0.5)" }}>Anual</p>
              <p className="mt-2 text-xl font-black" style={{ color: "#F5F5F0" }}>$XX<span className="text-xs font-medium">/mes</span></p>
              <p className="mt-1 text-[10px]" style={{ color: "rgba(201,168,76,0.6)" }}>Ahorra vs mensual</p>
            </div>
          </div>

          <p className="ximo-fade-up delay-300 mt-3 text-center text-[10px]" style={{ color: "rgba(245,245,240,0.3)" }}>
            La suscripción desbloquea la app completa. Sin plan gratuito.
          </p>

          {/* CTA */}
          <div className="ximo-fade-up delay-400 mt-5 space-y-3">
            <Link href="/subscribe">
              <button
                type="button"
                className="ximo-btn-press w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #2F7F86, #1F5F66)",
                  color: "#F5F5F0",
                  boxShadow: "0 4px 24px rgba(47,127,134,0.3)",
                }}
              >
                Crear cuenta
              </button>
            </Link>
            <Link href="/login">
              <button
                type="button"
                className="ximo-btn-press w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 hover:opacity-70"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(47,127,134,0.18)",
                  color: "rgba(245,245,240,0.5)",
                }}
              >
                Ya tengo cuenta
              </button>
            </Link>
          </div>

          <p className="ximo-fade-up delay-500 mt-5 text-center text-[10px]" style={{ color: "rgba(245,245,240,0.22)" }}>
            Después de crear tu cuenta podrás elegir un plan mensual o anual.
          </p>
        </div>
      </div>
    </div>
  );
}
