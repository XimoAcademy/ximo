import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ximo.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Only the public pre-launch pages. The app (login/register/subscribe)
  // intentionally stays out of the sitemap until the public launch.
  const routes = ["", "/build-log", "/terminos", "/privacidad"];
  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
