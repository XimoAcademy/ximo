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
