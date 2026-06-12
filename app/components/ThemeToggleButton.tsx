"use client";

import { useTheme } from "../providers/ThemeProvider";

/**
 * Compact theme switch for pre-login pages (where there is no settings panel).
 * Uses the global ThemeProvider, so toggling here persists into the whole app.
 */
export default function ThemeToggleButton({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolved } = useTheme();
  const isLight = theme === "light" || (theme === "system" && resolved === "light");

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label="Cambiar entre modo claro y oscuro"
      title={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className={`ximo-glass-chip inline-flex h-9 w-9 items-center justify-center rounded-full text-sm ${className}`}
      style={{ color: "var(--text)" }}
    >
      <span aria-hidden>{isLight ? "☾" : "☀"}</span>
    </button>
  );
}
