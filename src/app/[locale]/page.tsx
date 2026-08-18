import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/projects/featured-projects";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { JsonLd } from "@/components/seo/json-ld";
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
  const tm = await getTranslations({ locale, namespace: "metadata" });

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR.name,
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
      <Hero />
      <FeaturedProjects locale={locale} />
      <About locale={locale} />
      {/* Contact is a client component, so the project list is read here and
          passed down: it is what lets the assistant's citations be validated
          without a second round trip. */}
      <Contact projects={corpusProjects(locale)} />
    </>
  );
}
