import type { Metadata } from "next";
import Link from "next/link";
import Emblem from "../components/Emblem";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Crea tu cuenta de Ximo y empieza a organizar tu recruiting universitario.",
};

// Ximo is swimming-only for now — no other sports are offered.
export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen">

      {/* ── Left panel ── */}
      <div
        className="relative hidden overflow-hidden lg:flex lg:w-[38%] flex-col justify-between p-14"
        style={{ background: "var(--hero-bg)", borderRight: "1px solid var(--border-subtle)" }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute" style={{ width: 450, height: 450, top: "-5%", right: "-10%", background: "radial-gradient(circle, var(--gold-bg) 0%, transparent 65%)", filter: "blur(60px)" }} />
          <div className="absolute" style={{ width: 400, height: 400, bottom: "5%", left: "-5%", background: "radial-gradient(circle, var(--teal-bg) 0%, transparent 65%)", filter: "blur(60px)" }} />
        </div>
        <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-50" />

        <div className="relative">
          <Emblem size={88} />
        </div>

        <div className="relative space-y-5">
          <p className="text-2xl font-black leading-tight" style={{ color: "var(--text)" }}>
            Tu camino empieza aquí.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
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
                <div className="h-1 w-1 rounded-full shrink-0" style={{ background: "var(--gold)" }} />
                <p className="text-sm" style={{ color: "var(--text-2)" }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[10px] font-medium tracking-wide" style={{ color: "var(--text-3)" }}>
          Ximo · México primero
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">

          <div className="mb-8 flex justify-center lg:hidden">
            <Emblem size={64} />
          </div>

          <div className="ximo-fade-up mb-7">
            <h1 className="text-3xl font-black" style={{ color: "var(--text)" }}>
              Crea tu cuenta en Ximo
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
              Empieza organizando tu camino deportivo, académico y de recruiting.
            </p>
          </div>

          <RegisterForm />

          <p className="mt-5 text-center text-[11px] leading-relaxed" style={{ color: "var(--text-3)" }}>
            Al crear tu cuenta aceptas los{" "}
            <Link href="/terminos" className="font-semibold underline underline-offset-2" style={{ color: "var(--teal)" }}>Términos</Link>{" "}
            y el{" "}
            <Link href="/privacidad" className="font-semibold underline underline-offset-2" style={{ color: "var(--teal)" }}>Aviso de Privacidad</Link>.
            Si eres menor de edad, necesitas el consentimiento de tu padre, madre o tutor.
          </p>
        </div>
      </div>
    </div>
  );
}
