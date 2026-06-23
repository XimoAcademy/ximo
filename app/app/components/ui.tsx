import React, { type ReactNode } from "react";
import Link from "next/link";

export function Badge({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}

// SectionHeader always defaults to dark-safe (light) colors.
// Pass light={true} only if explicitly on a light surface.
export function SectionHeader({
  title,
  subtitle,
  action,
  actionHref,
  dark = true,
  light = false,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  actionHref?: string;
  dark?: boolean;
  light?: boolean;
}) {
  void light; void dark;
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2
          className="text-lg font-black sm:text-xl"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="mt-0.5 text-xs sm:text-sm"
            style={{ color: "var(--text-label)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && actionHref ? (
        <Link
          href={actionHref}
          className="shrink-0 text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ color: "var(--teal)" }}
        >
          {action}
        </Link>
      ) : action ? (
        <span
          className="shrink-0 text-xs font-semibold"
          style={{ color: "var(--teal)" }}
        >
          {action}
        </span>
      ) : null}
    </div>
  );
}

// Small uppercase field label used above form inputs across every module form.
// Hoisted here (instead of defined inline in each form) so it isn't recreated
// on every render.
export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  color,
}: {
  value: number;
  color?: string;
}) {
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full"
      style={{ background: "rgba(47,127,134,0.12)" }}
    >
      <div
        className="h-full rounded-full ximo-progress-bar"
        style={{
          width: `${value}%`,
          background: color ?? "linear-gradient(90deg, #1ECECE, #C9A84C)",
          "--progress-width": `${value}%`,
        } as React.CSSProperties}
      />
    </div>
  );
}

// Dark glass card — the default for all in-app surfaces
export function Card({
  children,
  className = "",
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl ximo-card-3d ${className}`}
      style={{
        background: "rgba(17,37,56,0.75)",
        border: "1px solid rgba(47,127,134,0.14)",
        boxShadow: glow
          ? "0 0 30px rgba(30,206,206,0.12), 0 4px 24px rgba(0,0,0,0.35)"
          : "0 4px 20px rgba(0,0,0,0.28)",
      }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   SHARED SURFACES — themed glass via CSS vars. Use these so every
   page reads from one design system (dark + light supported).
   Content surfaces are STATIC (only deepen on hover). Buttons move.
   ────────────────────────────────────────────────────────────── */

// The canonical content panel for every app page.
export function GlassPanel({
  children,
  className = "",
  tone = "default",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "gold" | "teal";
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const border =
    tone === "gold" ? "var(--border-gold)" : tone === "teal" ? "var(--teal-border)" : "var(--border)";
  // createElement (not <El/>) avoids r3f's global JSX augmentation breaking
  // the polymorphic-tag children typing.
  const El = Tag as React.ElementType;
  return React.createElement(
    El,
    { className: `rounded-2xl ximo-card-3d ${className}`, style: { background: "var(--surface)", border: `1px solid ${border}` } },
    children
  );
}

// Inner sub-surface (rows, nested tiles) — quieter than a panel.
export function InnerTile({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{ background: "var(--surface-hover)", border: "1px solid var(--border-subtle)" }}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent = "teal",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: "teal" | "gold" | "text";
}) {
  const color = accent === "gold" ? "var(--gold)" : accent === "text" ? "var(--text)" : "var(--teal)";
  return (
    <GlassPanel className="p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-label)" }}>
        {label}
      </p>
      <p className="mt-1 text-2xl font-black" style={{ color }}>
        {value}
      </p>
      {hint && (
        <p className="mt-0.5 text-[11px]" style={{ color: "var(--text-label)" }}>
          {hint}
        </p>
      )}
    </GlassPanel>
  );
}

type Tone = "success" | "warning" | "error" | "info" | "gold" | "neutral";
const TONE: Record<Tone, { bg: string; color: string }> = {
  success: { bg: "var(--success-bg)", color: "var(--success)" },
  warning: { bg: "var(--warning-bg)", color: "var(--warning)" },
  error:   { bg: "var(--error-bg)",   color: "var(--error)" },
  info:    { bg: "var(--teal-bg)",    color: "var(--teal)" },
  gold:    { bg: "var(--gold-bg)",    color: "var(--gold)" },
  neutral: { bg: "var(--surface-hover)", color: "var(--text-label)" },
};

export function StatusBadge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${className}`}
      style={{ background: t.bg, color: t.color }}
    >
      {children}
    </span>
  );
}

// The glass back arrow used on detail/account pages — keeps redirects consistent.
export function BackLink({
  href,
  children = "Volver",
}: {
  href: string;
  children?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="ximo-glass-chip inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold"
      style={{ color: "var(--text-2)" }}
    >
      <span aria-hidden>←</span> {children}
    </Link>
  );
}

export function EmptyState({
  title,
  text,
  action,
  actionHref,
}: {
  title: string;
  text?: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <GlassPanel className="px-6 py-12 text-center">
      <p className="text-sm font-black" style={{ color: "var(--text)" }}>
        {title}
      </p>
      {text && (
        <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed" style={{ color: "var(--text-label)" }}>
          {text}
        </p>
      )}
      {action && actionHref && (
        <Link href={actionHref} className="ximo-glass-btn teal mt-5 inline-block text-xs">
          {action}
        </Link>
      )}
    </GlassPanel>
  );
}

// Slim labelled progress meter (reads CSS vars; animated fill).
export function ProgressPill({
  value,
  label,
  showValue = true,
}: {
  value: number;
  label?: string;
  showValue?: boolean;
}) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-label)" }}>
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-[11px] font-black" style={{ color: "var(--teal)" }}>
              {v}%
            </span>
          )}
        </div>
      )}
      <ProgressBar value={v} />
    </div>
  );
}
