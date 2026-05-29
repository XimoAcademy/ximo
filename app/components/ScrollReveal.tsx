"use client";

import React, { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;                         // ms
  direction?: "up" | "fade" | "left" | "right";
  threshold?: number;                     // 0–1 viewport fraction
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Wraps any content with a scroll-triggered reveal.
 * Uses IntersectionObserver — zero extra dependencies.
 * Gracefully degrades: content stays visible if JS is slow or fails.
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0.08,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Apply initial hidden state only after JS mounts (SSR always visible)
    el.classList.add(`sr-${direction}`, "sr-init");

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => {
            el.classList.add("sr-visible");
            el.classList.remove(`sr-${direction}`, "sr-init");
          }, delay);
          obs.unobserve(el);
          return () => clearTimeout(timer);
        }
      },
      { threshold, rootMargin: "0px 0px -32px 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, direction, threshold]);

  const El = Tag as React.ElementType;
  return (
    <El ref={ref} className={className}>
      {children}
    </El>
  );
}
