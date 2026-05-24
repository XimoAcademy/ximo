// Later: connect form to Supabase waitlist table
// Later: add reCAPTCHA before real submissions go live
import Image from "next/image";
import Link from "next/link";

const SPORTS = ["Natación", "Polo acuático", "Atletismo", "Otro"];
const COUNTRIES = ["México", "Estados Unidos", "Colombia", "Argentina", "Otro"];
const YEARS = ["2025", "2026", "2027", "2028", "2029"];
const GOALS = [
  "Conseguir beca universitaria en EUA",
  "Entrenar a nivel universitario sin beca",
  "Mejorar mi nivel y marcas",
  "Aprender sobre el proceso de recruiting",
  "Otro",
];

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F0]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[38%] flex-col justify-between bg-gradient-to-br from-[#0B1F33] via-[#112538] to-[#0A1C2E] p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 70% 20%, rgba(201,168,76,0.1) 0%, transparent 50%)" }} />

        <div className="relative">
          <Image
            src="/brand/ximo-logo.png"
            alt="ximo Academy"
            width={110}
            height={38}
            className="h-9 w-auto object-contain"
            priority
          />
          <span className="mt-3 inline-flex items-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/12 px-2.5 py-0.5 text-[9px] font-bold tracking-widest text-[#C9A84C] uppercase">
            Primera generación
          </span>
        </div>

        <div className="relative">
          <p className="text-2xl font-black leading-tight text-white">
            Tu camino empieza aquí.
          </p>
          <p className="mt-3 text-sm text-white/45 leading-relaxed max-w-xs">
            ximo Academy es para el atleta mexicano que quiere organizarse, crecer y llegar a donde se lo propone.
          </p>
          <div className="mt-6 space-y-3">
            {[
              "Acceso anticipado como fundador",
              "Comunidad privada de atletas serios",
              "Soporte personalizado del equipo ximo",
              "Precios especiales de por vida",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#C9A84C]/20 text-[10px] font-black text-[#C9A84C]">✓</span>
                <p className="text-xs text-white/55">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[10px] font-medium tracking-wide text-white/20">
          ximo Academy · México primero
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-12 sm:px-8 overflow-y-auto">
        <div className="w-full max-w-[420px]">
          {/* Logo mobile */}
          <div className="mb-8 text-center lg:hidden">
            <Image
              src="/brand/ximo-logo.png"
              alt="ximo Academy"
              width={110}
              height={40}
              className="mx-auto h-10 w-auto object-contain"
              priority
            />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-[#0B1F33]">Solicitar acceso</h1>
          <p className="mt-1.5 text-sm text-[#5E7080]">
            La primera generación se abre por invitación y acceso fundador.
          </p>

          <div className="mt-6 space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-[#5E7080] uppercase">Nombre completo</label>
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full rounded-xl border border-[#0B1F33]/12 bg-white px-4 py-3 text-sm text-[#0B1F33] placeholder:text-[#5E7080]/50 shadow-[0_1px_4px_rgba(11,31,51,0.06)] outline-none transition focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/15"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-[#5E7080] uppercase">Correo electrónico</label>
              <input
                type="email"
                placeholder="atleta@ejemplo.com"
                className="w-full rounded-xl border border-[#0B1F33]/12 bg-white px-4 py-3 text-sm text-[#0B1F33] placeholder:text-[#5E7080]/50 shadow-[0_1px_4px_rgba(11,31,51,0.06)] outline-none transition focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/15"
              />
            </div>

            {/* Sport + Country */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-[#5E7080] uppercase">Deporte</label>
                <select className="w-full rounded-xl border border-[#0B1F33]/12 bg-white px-4 py-3 text-sm text-[#0B1F33] shadow-[0_1px_4px_rgba(11,31,51,0.06)] outline-none transition focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/15 appearance-none">
                  <option value="">Seleccionar</option>
                  {SPORTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-[#5E7080] uppercase">País</label>
                <select className="w-full rounded-xl border border-[#0B1F33]/12 bg-white px-4 py-3 text-sm text-[#0B1F33] shadow-[0_1px_4px_rgba(11,31,51,0.06)] outline-none transition focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/15 appearance-none">
                  <option value="">Seleccionar</option>
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Grad year */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-[#5E7080] uppercase">Año de graduación</label>
              <select className="w-full rounded-xl border border-[#0B1F33]/12 bg-white px-4 py-3 text-sm text-[#0B1F33] shadow-[0_1px_4px_rgba(11,31,51,0.06)] outline-none transition focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/15 appearance-none">
                <option value="">Seleccionar año</option>
                {YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>

            {/* Goal */}
            <div>
              <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-[#5E7080] uppercase">Objetivo principal</label>
              <select className="w-full rounded-xl border border-[#0B1F33]/12 bg-white px-4 py-3 text-sm text-[#0B1F33] shadow-[0_1px_4px_rgba(11,31,51,0.06)] outline-none transition focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/15 appearance-none">
                <option value="">Seleccionar objetivo</option>
                {GOALS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 w-full rounded-xl bg-[#0B1F33] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#112538]"
          >
            Solicitar acceso →
          </button>

          <div className="mt-4 space-y-2">
            <p className="text-center text-xs leading-relaxed text-[#5E7080]">
              La primera generación se abrirá por invitación y acceso fundador.
            </p>
            <p className="text-center text-[10px] leading-relaxed text-[#5E7080]/55">
              Sin pagos hoy. Nos pondremos en contacto contigo directamente.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-[#5E7080]/50 font-medium">
            <Link href="/login" className="hover:text-[#0B1F33] transition-colors">¿Ya tienes acceso? Entrar</Link>
            <span>·</span>
            <Link href="/" className="hover:text-[#0B1F33] transition-colors">Página principal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
