import Link from "next/link";
import Emblem from "./components/Emblem";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16 text-center">
      <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-20" />

      <div className="ximo-fade-up relative z-10 flex flex-col items-center">
        <Emblem size={72} />

        <p
          className="mt-8 font-display text-7xl font-black leading-none sm:text-8xl"
          style={{ color: "var(--text)" }}
        >
          404
        </p>
        <h1 className="mt-3 text-xl font-black" style={{ color: "var(--text)" }}>
          Esta página no existe
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed" style={{ color: "var(--text-label)" }}>
          La página que buscas no está disponible o se movió. Vuelve a un lugar seguro.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/app" className="ximo-glass-btn teal text-sm">
            Ir al dashboard
          </Link>
          <Link href="/login" className="ximo-glass-btn dark text-sm">
            Iniciar sesión
          </Link>
        </div>

        <Link href="/" className="mt-6 text-xs font-semibold" style={{ color: "var(--teal)" }}>
          ← Volver a la página principal
        </Link>
      </div>
    </div>
  );
}
