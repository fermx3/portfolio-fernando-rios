"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeft, ExternalLink, Github, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { FadeIn } from "@/components/motion/fade-in";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { getCategoryColor, formatDate, generatePlaceholderGradient } from "@/lib/utils";

import { Project } from "@/types/project";

interface ProjectPageClientProps {
  project: Project;
}

export function ProjectPageClient({ project }: ProjectPageClientProps) {
  const t = useTranslations("projects");
  const locale = useLocale();

  return (
    <Section className="min-h-screen">
      <Container size="lg">
        <FadeIn direction="up">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("page.backToProjects")}
            </Link>
          </Button>
        </FadeIn>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <FadeIn direction="up" delay={0.1}>
              <div className="mb-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
                  <Badge variant="outline" className={getCategoryColor(project.category)}>
                    {t(`filters.${project.category}`)}
                  </Badge>
                </div>

                <p className="text-lg text-muted-foreground mb-4">{project.summary}</p>

                {/* The longer form of the summary, written in the frontmatter of
                    16 projects and previously never shown. */}
                {project.description && (
                  <p className="text-base text-muted-foreground leading-relaxed mb-6">
                    {project.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-4">
                  {(project.liveUrl || project.demoUrl) && (
                    <Button asChild>
                      <a
                        href={project.liveUrl || project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t("project.viewDemo")}
                      </a>
                    </Button>
                  )}
                  {project.repoUrl &&
                    (project.repoPrivate ? (
                      <Button variant="outline" disabled title={t("project.viewCodePrivate")}>
                        <Lock className="mr-2 h-4 w-4" />
                        {t("project.viewCodePrivate")}
                      </Button>
                    ) : (
                      <Button variant="outline" asChild>
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          {t("project.viewCode")}
                        </a>
                      </Button>
                    ))}
                </div>
              </div>
            </FadeIn>

            {/* Project Image */}
            <FadeIn direction="up" delay={0.2}>
              <div className="relative aspect-video mb-8 overflow-hidden rounded-lg">
                {project.coverImage ? (
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{
                      background: generatePlaceholderGradient(project.title),
                    }}
                  />
                )}
              </div>
            </FadeIn>

            {/* Project Gallery */}
            {project.images && project.images.length > 0 && (
              <FadeIn direction="up" delay={0.25}>
                <ProjectGallery images={project.images} title={project.title} />
              </FadeIn>
            )}

            {/* Project Content */}
            <FadeIn direction="up" delay={0.3}>
              <div
                className="project-content max-w-none"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </FadeIn>

            {/* Challenges, approach and results. All three are authored in the
                MDX frontmatter and were validated but never rendered. */}
            {[
              { key: "challenges", items: project.challenges },
              { key: "solutions", items: project.solutions },
              { key: "results", items: project.results },
            ]
              .filter((section) => section.items && section.items.length > 0)
              .map((section, index) => (
                <FadeIn key={section.key} direction="up" delay={0.35 + index * 0.05}>
                  <section className="mt-12">
                    <h2 className="text-2xl font-bold tracking-tight">
                      {t(`project.${section.key}`)}
                    </h2>
                    <ul className="mt-4 space-y-3">
                      {section.items!.map((item: string) => (
                        <li key={item} className="flex gap-3 text-muted-foreground">
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-400"
                          />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </FadeIn>
              ))}

            {/* Closing statement. Lives in the frontmatter rather than as a
                trailing "## Impact" heading in the body, so that it always ends
                the page instead of being followed by the sections above. */}
            {project.impact && (
              <FadeIn direction="up" delay={0.5}>
                <section className="mt-16 border-l-2 border-lime-400 pl-6">
                  <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    {t("project.impact")}
                  </h2>
                  <p className="mt-3 text-lg leading-relaxed text-balance">{project.impact}</p>
                </section>
              </FadeIn>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <FadeIn direction="left" delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("project.details")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        {t("project.objective")}
                      </h4>
                      <p className="text-sm">{project.objective}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        {t("project.theme")}
                      </h4>
                      <p className="text-sm">{project.theme}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        {t("project.date")}
                      </h4>
                      <p className="text-sm">
                        {formatDate(project.date, locale === "es" ? "es-ES" : "en-US")}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        {t("project.category")}
                      </h4>
                      <Badge variant="outline" className={getCategoryColor(project.category)}>
                        {t(`filters.${project.category}`)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn direction="left" delay={0.3}>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("project.technologies")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {/* This card is titled "Technologies" but rendered tags.
                          Four projects have no technologies list, so tags stay
                          as the fallback. */}
                      {(project.technologies?.length ? project.technologies : project.tags).map(
                        (item: string) => (
                          <Badge key={item} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
