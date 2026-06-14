import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./constants";

type PageMeta = {
  title: string;
  description: string;
  path: string;
};

export function buildPageMetadata(
  { title, description, path }: PageMeta,
  locale: string
): Metadata {
  const url = locale === "es" ? `${SITE_URL}${path}` : `${SITE_URL}/en${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        es: path,
        en: `/en${path}`,
      },
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
    },
  };
}
