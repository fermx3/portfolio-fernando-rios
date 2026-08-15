import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/json-ld";
import { AUTHOR, SITE_URL, absoluteUrl, languageAlternates, ogImage } from "@/lib/site";
import { getProjectBySlug, getAllProjects } from "@/lib/content";
import { Metadata } from "next";
import { ProjectPageClient } from "./project-page-client";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export async function generateStaticParams() {
  const enProjects = await getAllProjects("en");
  const esProjects = await getAllProjects("es");

  return [
    ...enProjects.map((project) => ({
      slug: project.slug,
      locale: "en",
    })),
    ...esProjects.map((project) => ({
      slug: project.slug,
      locale: "es",
    })),
  ];
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const project = await getProjectBySlug(slug, locale);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const path = `/projects/${slug}`;

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: absoluteUrl(locale, path),
      languages: languageAlternates(path),
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      locale: locale === "es" ? "es_ES" : "en_US",
      url: absoluteUrl(locale, path),
      publishedTime: project.date,
      images: [ogImage(locale)],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const project = await getProjectBySlug(slug, locale);

  if (!project) {
    notFound();
  }

  const path = `/projects/${slug}`;
  const creativeWork = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.summary,
    url: absoluteUrl(locale, path),
    datePublished: project.date,
    inLanguage: locale,
    image: `${SITE_URL}${project.coverImage}`,
    keywords: project.tags.join(", "),
    author: { "@type": "Person", name: AUTHOR.name, url: absoluteUrl(locale) },
    ...(project.liveUrl ? { sameAs: [project.liveUrl] } : {}),
  };

  return (
    <>
      <JsonLd data={creativeWork} />
      <ProjectPageClient project={project} />
    </>
  );
}
