import type { ReactNode } from "react";
import Link from "next/link";
import Emblem from "./Emblem";

/**
 * Shared shell for the pre-login / account flow (forgot-password,
 * reset-password, verify-email, account-status). Fully theme-aware: the
 * container is transparent so it inherits the global themed background
 * (animated teal→gold gradient in dark, soft brand gradient in light).
 */
export default function AuthShell({
  children,
  badge,
  footer,
  maxWidth = 440,
}: {
  children: ReactNode;
  badge?: string;
  footer?: ReactNode;
  maxWidth?: number;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute"
          style={{
            width: 560,
            height: 560,
            top: "-16%",
            left: "-12%",
            background: "radial-gradient(circle, var(--teal-bg) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute"
          style={{
            width: 460,
            height: 460,
            bottom: "-12%",
            right: "-8%",
            background: "radial-gradient(circle, var(--gold-bg) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
      </div>
      <div className="ximo-soft-grid pointer-events-none absolute inset-0 opacity-40" />

      {/* Content */}
      <div className="relative z-10 w-full" style={{ maxWidth }}>
        <div className="ximo-fade-up mb-8 flex flex-col items-center text-center">
          <Link href="/" aria-label="Ximo">
            <Emblem size={72} />
          </Link>
          {badge && (
            <span
              className="mt-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
              style={{ border: "1px solid var(--gold-border)", color: "var(--gold)", background: "var(--gold-bg)" }}
            >
              {badge}
            </span>
          )}
        </div>

        <div
          className="ximo-fade-up delay-100 rounded-3xl p-7 sm:p-8"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
          }}
        >
          {children}
        </div>

        {footer && (
          <div className="ximo-fade-up delay-200 mt-6 text-center text-[11px]" style={{ color: "var(--text-label)" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* Shared field styles for the auth family — themed, so they follow dark/light. */
export const authLabelClass = "mb-2 block text-[10px] font-bold uppercase tracking-widest";
export const authLabelStyle = { color: "var(--text-label)" } as const;
export const authInputClass = "w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all duration-200";
export const authInputStyle = {
  background: "var(--bg-surf)",
  border: "1px solid var(--border)",
  color: "var(--text)",
} as const;
