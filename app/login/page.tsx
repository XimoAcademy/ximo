import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F5F0] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src="/brand/ximo-logo.png"
            alt="ximo Academy"
            width={120}
            height={48}
            className="mx-auto mb-5 h-14 w-auto object-contain"
            priority
          />
          <h1 className="text-2xl font-black tracking-tight text-[#0B1F33]">
            ximo Academy
          </h1>
          <p className="mt-2 text-sm text-[#5E7080]">
            Tu camino deportivo, académico y de recruiting.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0B1F33] to-[#0A1C2E] p-6 shadow-[0_8px_32px_rgba(11,31,51,0.2)] sm:p-8">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[10px] font-bold tracking-wide text-white/45 uppercase"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="atleta@ejemplo.com"
                className="w-full rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/15"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[10px] font-bold tracking-wide text-white/45 uppercase"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/15"
              />
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-xl bg-[#C9A84C] py-3.5 text-sm font-bold text-[#0B1F33] transition-colors hover:bg-[#C9A84C]/90"
          >
            Entrar
          </button>
          <button
            type="button"
            className="mt-3 w-full rounded-xl border border-white/15 bg-transparent py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/5"
          >
            Solicitar acceso
          </button>

          <p className="mt-6 text-center text-xs leading-relaxed text-white/45">
            El acceso privado estará disponible para atletas aprobados y
            miembros fundadores.
          </p>
          <p className="mt-3 text-center text-[10px] leading-relaxed text-white/30">
            Próximamente: acceso con cuenta, suscripción activa y protección de
            rutas.
          </p>
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/app"
            className="text-xs font-semibold text-[#1D4ED8] hover:text-[#0B1F33]"
          >
            ← Vista previa del panel privado
          </Link>
        </p>
      </div>
    </div>
  );
}
