import type { ReactNode } from "react";
import Link from "next/link";

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
  actionHref,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-black tracking-tight text-[#0B1F33] sm:text-lg">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-[#5E7080] sm:text-sm">{subtitle}</p>
        )}
      </div>
      {action && actionHref ? (
        <Link
          href={actionHref}
          className="shrink-0 text-xs font-semibold text-[#1D4ED8] hover:text-[#0B1F33]"
        >
          {action}
        </Link>
      ) : action ? (
        <span className="shrink-0 text-xs font-semibold text-[#1D4ED8]">
          {action}
        </span>
      ) : null}
    </div>
  );
}

export function ProgressBar({
  value,
  color = "from-[#0B1F33] to-[#C9A84C]",
}: {
  value: number;
  color?: string;
}) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#0B1F33]/8">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#0B1F33]/8 bg-white/95 shadow-[0_1px_14px_rgba(11,31,51,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}
