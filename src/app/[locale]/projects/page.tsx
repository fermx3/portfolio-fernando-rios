import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllProjects, getAllTags } from "@/lib/content";
import { absoluteUrl, languageAlternates, ogImage } from "@/lib/site";
import { ProjectsPageClient } from "./projects-client";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects.page" });

  const title = t("allProjects");
  const description = t("allProjectsDescription");

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(locale, "/projects"),
      languages: languageAlternates("/projects"),
    },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      url: absoluteUrl(locale, "/projects"),
      title,
      description,
      images: [ogImage(locale)],
    },
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const projects = await getAllProjects(locale);
  const tags = await getAllTags(locale);

  return <ProjectsPageClient projects={projects} tags={tags} />;
}
