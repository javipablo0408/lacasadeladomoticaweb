import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const pages = [
  "",
  "/servicios",
  "/home-assistant",
  "/panel-demo",
  "/domotica-madrid",
  "/preguntas-frecuentes",
  "/sobre-nosotros",
  "/contacto",
  "/legal/privacidad",
  "/legal/cookies",
  "/legal/aviso-legal",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    entries.push({
      url: `${SITE_URL}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? "weekly" : "monthly",
      priority: page === "" ? 1 : page === "/domotica-madrid" ? 0.9 : 0.8,
      alternates: {
        languages: {
          es: `${SITE_URL}${page}`,
          en: `${SITE_URL}/en${page}`,
        },
      },
    });
  }

  return entries;
}
