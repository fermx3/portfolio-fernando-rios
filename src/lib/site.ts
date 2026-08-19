import { routing } from "@/i18n/routing";

// Canonical origin. The apex domain 307s to www, so every URL we publish
// (canonical tags, sitemap, JSON-LD, OG) must use www or we are advertising
// redirects to crawlers.
export const SITE_URL = "https://www.fernandorios.dev";

export const AUTHOR = {
  name: "Fernando Rios",
  email: "hola@fernandorios.dev",
  github: "https://github.com/fermx3",
  linkedin: "https://www.linkedin.com/in/riosafernando/",
} as const;

/** Absolute URL for a locale-prefixed path: absoluteUrl("es", "/projects") */
export function absoluteUrl(locale: string, path = ""): string {
  return `${SITE_URL}/${locale}${path}`;
}

/**
 * The generated OG card for a locale.
 *
 * Needed explicitly on any page whose generateMetadata sets `openGraph`:
 * doing so overrides the file-based opengraph-image, which would otherwise be
 * inherited, and the page ends up with no image at all.
 */
export function ogImage(locale: string) {
  return {
    url: absoluteUrl(locale, "/opengraph-image"),
    width: 1200,
    height: 630,
    alt: AUTHOR.name,
  };
}

/**
 * hreflang map for a path, covering every locale plus x-default.
 * Next renders these as <link rel="alternate" hreflang="..."> tags.
 */
export function languageAlternates(path = ""): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(locale, path);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);
  return languages;
}
