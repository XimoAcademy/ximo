"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AppTheme = "dark" | "light" | "system";

interface ThemeCtx {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  resolved: "dark" | "light";
}

const Ctx = createContext<ThemeCtx>({
  theme: "dark",
  setTheme: () => {},
  resolved: "dark",
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>("dark");
  const [resolved, setResolved] = useState<"dark" | "light">("dark");

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = (localStorage.getItem("ximo-theme") as AppTheme) ?? "dark";
    setThemeState(stored);
  }, []);

  // Apply class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;

    const applyResolved = (r: "dark" | "light") => {
      setResolved(r);
      if (r === "light") root.classList.add("theme-light");
      else root.classList.remove("theme-light");
    };

    if (theme === "light") {
      applyResolved("light");
    } else if (theme === "dark") {
      applyResolved("dark");
    } else {
      // system
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      applyResolved(mq.matches ? "dark" : "light");
      const handler = (e: MediaQueryListEvent) => applyResolved(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
    localStorage.setItem("ximo-theme", t);
  };

  return <Ctx.Provider value={{ theme, setTheme, resolved }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
