import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Bento, Module } from "@/components/ui/module";
import { Hero } from "@/components/sections/hero";
import { HowIWork } from "@/components/sections/how-i-work";
import { Now } from "@/components/sections/now";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { AskPortfolio } from "@/components/assistant/ask-portfolio";
import { FeaturedProject } from "@/components/projects/featured-project";
import { AllProjectsLink } from "@/components/projects/all-projects-link";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllProjects, getHomeProjects } from "@/lib/content";
import { corpusProjects } from "@/lib/assistant/prompt";
import { AUTHOR, SITE_URL, absoluteUrl, languageAlternates } from "@/lib/site";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: absoluteUrl(locale),
      languages: languageAlternates(),
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "hero" });
  const tc = await getTranslations({ locale, namespace: "contact.assistant" });
  const [{ lead, short }, all] = await Promise.all([
    getHomeProjects(locale),
    getAllProjects(locale),
  ]);
  const categories = new Set(all.map((p) => p.category)).size;
  const tm = await getTranslations({ locale, namespace: "metadata" });

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR.name,
    alternateName: "Fernando Ríos",
    url: absoluteUrl(locale),
    jobTitle: t("role"),
    description: tm("description"),
    email: `mailto:${AUTHOR.email}`,
    sameAs: [AUTHOR.github, AUTHOR.linkedin],
    knowsLanguage: ["en", "es"],
    mainEntityOfPage: { "@type": "WebSite", "@id": SITE_URL, name: tm("siteName") },
  };

  return (
    <>
      <JsonLd data={person} />
      <Container className="pt-2 pb-3">
        {/* Order matters on mobile, where the grid collapses to one column and
            reads top to bottom. */}
        <Bento>
          <Hero />
          <Module as="section" span={2} tone="anchor" aria-label={tc("title")}>
            {/* The project list is read here and passed down: it is what lets
                the assistant's citations be validated without a second round
                trip. */}
            <AskPortfolio projects={corpusProjects(locale)} />
          </Module>

          {lead && <FeaturedProject project={lead} size="lead" id="projects" />}
          {lead && <HowIWork project={lead} />}

          {short.map((project) => (
            <FeaturedProject key={project.slug} project={project} size="short" />
          ))}
          <Now />
          {/* Carries the #projects anchor when there is no lead to hold it:
              an empty featured list must not break the nav link. */}
          <AllProjectsLink
            projects={all.length}
            categories={categories}
            id={lead ? undefined : "projects"}
          />

          <About locale={locale} />
          <Contact />
        </Bento>
      </Container>
    </>
  );
}
