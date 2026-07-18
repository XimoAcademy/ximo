"use client";

import { useEffect, type ReactNode } from "react";
import posthog from "posthog-js";

/**
 * Deterrent layer for premium content (course lessons). Browsers can't block
 * screenshots or recording — the goal here is to make casual copying and
 * redistribution unattractive without degrading normal use:
 *
 *  - tiled personal watermark (the viewer's name/email) over the content, so
 *    any screenshot or recording identifies who leaked it
 *  - right-click and drag-out blocked ONLY inside the protected area
 *  - text selection disabled inside the protected area (globals.css)
 *  - printing the page yields a notice instead of the content (@media print)
 *  - print / PrintScreen attempts are logged to PostHog for analytics
 *
 * Deliberately NOT included: DevTools-detection loops and global right-click
 * bans — they are unreliable, easy to bypass, and punish legitimate users.
 */
export default function ProtectedContent({
  watermark,
  children,
  className = "",
}: {
  /** Viewer identity shown in the watermark tiles; null hides the watermark. */
  watermark: string | null;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    const onBeforePrint = () => {
      posthog.capture("protected_content_print_attempt");
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        posthog.capture("protected_content_screenshot_key");
      }
    };
    // DevTools heuristic: a docked panel widens the window/viewport delta.
    // Logging-only (once per mount) — detection is fallible (browser zoom,
    // OS scrollbars), so it must NEVER block or alter the experience.
    let devtoolsLogged = false;
    const checkDevtools = () => {
      if (devtoolsLogged) return;
      const gapW = window.outerWidth - window.innerWidth;
      const gapH = window.outerHeight - window.innerHeight;
      if (gapW > 200 || gapH > 200) {
        devtoolsLogged = true;
        posthog.capture("protected_content_devtools_heuristic");
      }
    };
    checkDevtools();
    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", checkDevtools);
    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", checkDevtools);
    };
  }, []);

  return (
    <div
      className={`ximo-protected ${className}`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {children}
      {watermark && (
        <div aria-hidden className="ximo-watermark">
          {Array.from({ length: 24 }, (_, i) => (
            <span key={i}>{watermark}</span>
          ))}
        </div>
      )}
      <p className="ximo-print-notice" aria-hidden>
        Contenido protegido de Ximo — la impresión está deshabilitada.
      </p>
    </div>
  );
}
