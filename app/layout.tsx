import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Argent CF — the brand display serif. Multiple weights for contextual use.
const argent = localFont({
  variable: "--font-argent",
  display: "swap",
  src: [
    { path: "./fonts/argent-regular.otf",   weight: "400", style: "normal" },
    { path: "./fonts/argent-italic.otf",     weight: "400", style: "italic" },
    { path: "./fonts/argent-demibold.otf",   weight: "600", style: "normal" },
    { path: "./fonts/argent-bold.otf",       weight: "700", style: "normal" },
    { path: "./fonts/argent-extrabold.otf",  weight: "800", style: "normal" },
    { path: "./fonts/argent-super.otf",      weight: "900", style: "normal" },
  ],
});

// Fraunces — same-family serif used as a graceful fallback so accented
// characters (á, é, í, ó, ú, ñ) the Argent demo lacks still render cleanly.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  title: "Ximo — Live the Dream",
  description: "Tu camino deportivo, organizado. Plataforma de recruiting para atletas mexicanos.",
};

// Inline script runs synchronously before first paint — prevents flash of wrong theme
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('ximo-theme');
    if (t === 'light') document.documentElement.classList.add('theme-light');
    else if (t === 'system') {
      if (!window.matchMedia('(prefers-color-scheme: dark)').matches)
        document.documentElement.classList.add('theme-light');
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${argent.variable} ${fraunces.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
