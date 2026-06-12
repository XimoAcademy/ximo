import Link from "next/link";
import { GlassPanel } from "./components/ui";

export default function AppNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <GlassPanel className="ximo-fade-up w-full max-w-md px-6 py-12 text-center">
        <p className="font-display text-6xl font-black leading-none" style={{ color: "var(--teal)" }}>
          404
        </p>
        <h1 className="mt-3 text-lg font-black" style={{ color: "var(--text)" }}>
          No encontramos esta página
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed" style={{ color: "var(--text-label)" }}>
          La sección que buscas no existe o aún está en desarrollo. Vuelve a tu dashboard para seguir avanzando.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/app" className="ximo-glass-btn teal text-sm">
            Volver al dashboard
          </Link>
          <Link href="/app/help" className="ximo-glass-btn dark text-sm">
            Centro de ayuda
          </Link>
        </div>
      </GlassPanel>
    </div>
  );
}
