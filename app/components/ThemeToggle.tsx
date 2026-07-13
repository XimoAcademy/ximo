"use client";

import { useTheme } from "../providers/ThemeProvider";

/**
 * Ximo glass theme toggle.
 *
 * A compact light/dark switch inspired by the "glass toggle" reference: a
 * rounded capsule with the current mode's label on one half and a frosted-glass
 * thumb (sun / moon) that slides across the other half. Designed for Ximo's dark
 * aquatic identity and readable in the light theme too.
 *
 * Accessibility:
 *  - role="switch" + aria-checked (checked === light) + an accessible label.
 *  - It's a real <button>, so Enter/Space activate it; :focus-visible ring.
 *  - Meets the 44px minimum touch target.
 *  - The sliding motion is disabled under prefers-reduced-motion (CSS).
 *  - No layout shift: the label text lives in fixed half-cells.
 *
 * "Use device theme" is intentionally a subtle secondary control (see
 * `showSystem`), not a third segment in an oversized selector.
 */

type Labels = {
  dark: string;
  light: string;
  /** Full a11y label, e.g. "Cambiar entre modo claro y oscuro". */
  aria: string;
  system?: string;
  systemActive?: string;
};

const ES: Labels = {
  dark: "Oscuro",
  light: "Claro",
  aria: "Cambiar entre modo claro y oscuro",
  system: "Seguir el sistema",
  systemActive: "· activo",
};

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden focusable="false">
      <path
        d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden focusable="false">
      <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2.6v2.4M12 19v2.4M2.6 12h2.4M19 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19" />
      </g>
    </svg>
  );
}

export default function ThemeToggle({
  className = "",
  labels = ES,
  showSystem = false,
}: {
  className?: string;
  labels?: Labels;
  showSystem?: boolean;
}) {
  const { theme, setTheme, resolved } = useTheme();
  const isLight = theme === "light" || (theme === "system" && resolved === "light");

  const toggle = () => setTheme(isLight ? "dark" : "light");

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={isLight}
        aria-label={labels.aria}
        title={labels.aria}
        onClick={toggle}
        data-light={isLight ? "true" : "false"}
        className="ximo-theme-toggle"
      >
        {/* Labels live in fixed half-cells so nothing reflows when toggling. */}
        <span className="tt-label tt-label--dark" aria-hidden>
          {labels.dark}
        </span>
        <span className="tt-label tt-label--light" aria-hidden>
          {labels.light}
        </span>
        {/* Frosted glass thumb with the current mode's icon. */}
        <span className="tt-thumb" aria-hidden>
          <span className="tt-icon tt-icon--moon">
            <MoonIcon />
          </span>
          <span className="tt-icon tt-icon--sun">
            <SunIcon />
          </span>
        </span>
      </button>

      {showSystem && labels.system && (
        <button
          type="button"
          onClick={() => setTheme("system")}
          className="ximo-theme-system"
          aria-pressed={theme === "system"}
          data-active={theme === "system" ? "true" : "false"}
        >
          {labels.system}
          {theme === "system" && labels.systemActive && (
            <span className="ml-1" style={{ color: "var(--gold)" }}>
              {labels.systemActive}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
