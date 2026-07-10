import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ximo — Live the Dream",
    short_name: "Ximo",
    description:
      "Ximo ayuda a atletas mexicanos a llegar a universidades de Estados Unidos: recruiting, coaches, becas, tiempos y comunidad en un solo lugar.",
    start_url: "/app",
    display: "standalone",
    background_color: "#0B1F33",
    theme_color: "#0B1F33",
    lang: "es-MX",
    icons: [
      { src: "/brand/ximo-logo.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/ximo-logo.png", sizes: "192x192", type: "image/png" },
    ],
  };
}
