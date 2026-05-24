// Later: replace with Supabase Auth
// Later: add route protection after login
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F0]">
      {/* Left panel — decorative, hidden on mobile */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[46%] flex-col justify-between bg-gradient-to-br from-[#0B1F33] via-[#112538] to-[#0A1C2E] p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, rgba(201,168,76,0.12) 0%, transparent 55%)" }} />

        <div className="relative">
          <Image
            src="/brand/ximo-logo.png"
            alt="ximo Academy"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
          <span className="mt-3 inline-flex items-center rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/12 px-2.5 py-0.5 text-[9px] font-bold tracking-widest text-[#C9A84C] uppercase">
            Beta privada
          </span>
        </div>

        <div className="relative space-y-6">
          {[
            { icon: "◫", label: "Universidades NCAA", sub: "Encuentra programas reales alineados a tu nivel" },
            { icon: "⬘", label: "Coaches reales", sub: "Contacta, da seguimiento y construye relaciones" },
            { icon: "◑", label: "Progreso deportivo", sub: "Visualiza tus marcas y el camino hacia tus metas" },
            { icon: "◉", label: "Comunidad atleta", sub: "Aprende y avanza con otros atletas serios" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="mt-0.5 text-[#C9A84C] text-base">{item.icon}</span>
              <div>
                <p className="text-sm font-bold text-white">{item.label}</p>
                <p className="text-xs text-white/40">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="relative text-[10px] font-medium tracking-wide text-white/20">
          ximo Academy · México primero · Atletas fundadores
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-[400px]">
          {/* Logo — mobile only */}
          <div className="mb-8 text-center lg:hidden">
            <Image
              src="/brand/ximo-logo.png"
              alt="ximo Academy"
              width={120}
              height={44}
              className="mx-auto h-12 w-auto object-contain"
              priority
            />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-[#0B1F33]">Acceso privado</h1>
          <p className="mt-1.5 text-sm text-[#5E7080]">
            Ingresa con tu cuenta de atleta aprobado.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[10px] font-bold tracking-widest text-[#5E7080] uppercase">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="atleta@ejemplo.com"
                className="w-full rounded-xl border border-[#0B1F33]/12 bg-white px-4 py-3 text-sm text-[#0B1F33] placeholder:text-[#5E7080]/50 shadow-[0_1px_4px_rgba(11,31,51,0.06)] outline-none transition focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/15"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-[10px] font-bold tracking-widest text-[#5E7080] uppercase">
                  Contraseña
                </label>
                <span className="text-[10px] font-semibold text-[#1D4ED8] cursor-pointer hover:underline">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#0B1F33]/12 bg-white px-4 py-3 text-sm text-[#0B1F33] placeholder:text-[#5E7080]/50 shadow-[0_1px_4px_rgba(11,31,51,0.06)] outline-none transition focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/15"
              />
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            <Link href="/app">
              <button
                type="button"
                className="w-full rounded-xl bg-[#0B1F33] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#112538]"
              >
                Entrar
              </button>
            </Link>
            <Link href="/register">
              <button
                type="button"
                className="w-full rounded-xl border border-[#0B1F33]/15 bg-white py-3.5 text-sm font-bold text-[#0B1F33] transition-colors hover:bg-[#F5F5F0]"
              >
                Solicitar acceso
              </button>
            </Link>
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-center text-xs leading-relaxed text-[#5E7080]">
              El acceso privado está disponible para atletas aprobados y miembros fundadores.
            </p>
            <p className="text-center text-[10px] leading-relaxed text-[#5E7080]/60">
              Próximamente: suscripción activa y protección de rutas con Supabase Auth.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 text-[10px] text-[#5E7080]/50 font-medium">
            <Link href="/" className="hover:text-[#0B1F33] transition-colors">Página principal</Link>
            <span>·</span>
            <Link href="/build-log" className="hover:text-[#0B1F33] transition-colors">Build log</Link>
            <span>·</span>
            <Link href="/app" className="hover:text-[#0B1F33] transition-colors">Vista previa app</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
