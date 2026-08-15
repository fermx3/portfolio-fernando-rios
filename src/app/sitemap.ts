import { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/content";
import { routing } from "@/i18n/routing";
import { absoluteUrl, languageAlternates } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // The bare origin is deliberately absent: it 307s to /{locale}, and a sitemap
  // should only list URLs that resolve directly.
  for (const locale of routing.locales) {
    entries.push({
      url: absoluteUrl(locale),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: languageAlternates() },
    });

    entries.push({
      url: absoluteUrl(locale, "/projects"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: languageAlternates("/projects") },
    });

    const projects = await getAllProjects(locale);
    for (const project of projects) {
      const path = `/projects/${project.slug}`;
      entries.push({
        url: absoluteUrl(locale, path),
        lastModified: new Date(project.date),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: languageAlternates(path) },
      });
    }
  }

  return entries;
}
