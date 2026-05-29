import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Theme flash prevention — must be first in head */}
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
