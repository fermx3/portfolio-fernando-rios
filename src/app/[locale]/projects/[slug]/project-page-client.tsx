"use client";

import { useTranslations, useLocale } from "next-intl";
import { Check, Lock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/layout/container";
import { Bento, Module, ModuleLabel } from "@/components/ui/module";
import { ImageWithPlaceholder } from "@/components/ui/image-with-placeholder";
import { AskMini } from "@/components/assistant/ask-mini";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { ProjectStatus } from "@/components/projects/project-status";
import { ProjectToc, type TocItem } from "@/components/projects/project-toc";
import { formatDate } from "@/lib/utils";
import { Project } from "@/types/project";

interface ProjectPageClientProps {
  project: Project;
}

/** Spans for the data row, so 1–4 modules always fill the four columns. */
const ROW_SPANS: Record<number, (1 | 2 | 4)[]> = {
  1: [4],
  2: [2, 2],
  3: [2, 1, 1],
  4: [1, 1, 1, 1],
};

const SECTION_TITLE =
  "scroll-mt-14 text-[2rem] leading-none font-bold tracking-[-0.025em] lg:scroll-mt-0 sm:text-h2";

/**
 * The reading version of the detail page: one 680px column (about 70
 * characters a line) in ink rather than grey, sections stacked in reading
 * order, and a table of contents beside it instead of tabs.
 */
export function ProjectPageClient({ project }: ProjectPageClientProps) {
  const t = useTranslations("projects");
  const locale = useLocale();

  const numbered = [
    { id: "challenges", items: project.challenges },
    { id: "solutions", items: project.solutions },
  ].filter((section) => section.items?.length);

  const technologies = project.technologies?.length ? project.technologies : project.tags;

  const toc: TocItem[] = [
    project.objective && { id: "objective", label: t("project.objective") },
    ...numbered.map((s) => ({ id: s.id, label: t(`project.${s.id}`) })),
    project.results?.length && { id: "results", label: t("project.results") },
    { id: "overview", label: t("project.overview") },
    project.images?.length && { id: "gallery", label: t("project.gallery") },
    project.impact && { id: "impact", label: t("project.impact") },
  ].filter(Boolean) as TocItem[];

  // Data row: only what this project has.
  const facts = [
    project.metric && {
      key: "metric",
      tone: "lime" as const,
      body: (
        <>
          <ModuleLabel>{t("project.mainResult")}</ModuleLabel>
          <p className="mt-2 text-5xl leading-none font-bold tracking-tight">
            {project.metric.value}
          </p>
          <p className="mt-1 text-sm">{project.metric.label}</p>
        </>
      ),
    },
    {
      key: "date",
      body: (
        <>
          <ModuleLabel>{t("project.date")}</ModuleLabel>
          <p className="mt-2 text-lg font-bold">
            {formatDate(project.date, locale === "es" ? "es-ES" : "en-US")}
          </p>
          {project.context && <p className="mt-0.5 text-sm">{project.context}</p>}
        </>
      ),
    },
    project.team && {
      key: "team",
      body: (
        <>
          <ModuleLabel>{t("project.team")}</ModuleLabel>
          <p className="mt-2 text-lg font-bold">
            {t("project.teamSize", { count: project.team.size })}
          </p>
          {project.team.role && <p className="mt-0.5 text-sm">{project.team.role}</p>}
        </>
      ),
    },
    project.theme && {
      key: "theme",
      body: (
        <>
          <ModuleLabel>{t("project.theme")}</ModuleLabel>
          <p className="mt-2 text-sm leading-snug">{project.theme}</p>
        </>
      ),
    },
  ].filter(Boolean) as { key: string; tone?: "lime"; body: React.ReactNode }[];
  const spans = ROW_SPANS[facts.length];

  const ask = (
    <AskMini
      title={t("project.questions")}
      example={t("project.askExample", { project: project.title })}
      variant="suggestion"
    />
  );

  return (
    <Container className="pt-2 pb-3">
      <Bento>
        {/* Header: title and links beside the cover. */}
        <Module span={2} className="flex flex-col sm:p-9">
          <Link
            href="/projects"
            className="font-mono text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            ← {t("page.backToProjects")}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <ProjectStatus status={project.status} variant="chip" />
            <Badge variant="secondary" className="font-mono">
              {t(`filters.${project.category}`)}
            </Badge>
          </div>
          <h1 className="mt-4 text-[2.75rem] leading-[0.95] font-bold tracking-[-0.035em] sm:text-h1">
            {project.title}
          </h1>
          <p className="mt-4 max-w-xl text-body">{project.summary}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {(project.liveUrl || project.demoUrl) && (
              <Button asChild>
                <a
                  href={project.liveUrl || project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("project.viewDemo")} <span aria-hidden="true">↗</span>
                </a>
              </Button>
            )}
            {project.repoPrivate ? (
              <Button variant="outline" disabled>
                <Lock className="h-4 w-4" aria-hidden="true" />
                {t("project.viewCodePrivate")}
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  {t("project.viewCode")} <span aria-hidden="true">↗</span>
                </a>
              </Button>
            )}
          </div>
        </Module>

        <Module span={2} bleed className="relative min-h-64 sm:min-h-80">
          {/* The cover is the LCP image, so it loads with priority. */}
          <ImageWithPlaceholder
            src={project.coverImage}
            alt={project.title}
            placeholderSeed={project.title}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-top"
          />
        </Module>

        {facts.map((fact, i) => (
          <Module
            key={fact.key}
            tone={fact.tone}
            span={spans[i]}
            reveal
            // Four short facts pair up two to a row on a phone.
            compact={facts.length === 4 || undefined}
            className="p-5 sm:p-6"
          >
            {fact.body}
          </Module>
        ))}

        {/* Reading module: contents on the left, one column of text. */}
        <Module
          span={4}
          reveal
          className="grid grid-cols-1 gap-10 p-6 sm:p-10 lg:grid-cols-[13rem_1fr] lg:gap-16"
        >
          <div className="max-lg:contents lg:sticky lg:top-24 lg:self-start">
            <ProjectToc items={toc} />
            <div className="mt-8 hidden lg:block">{ask}</div>
          </div>

          <article className="min-w-0 max-w-[680px] text-[1.0625rem] leading-relaxed sm:text-lg">
            {(project.objective || project.description) && (
              <section id="objective" className="scroll-mt-14 lg:scroll-mt-0">
                {project.objective && (
                  <>
                    <h2 className="font-mono text-xs text-muted-foreground">
                      {t("project.objective")}
                    </h2>
                    <p className="mt-3 text-xl leading-snug font-medium sm:text-2xl">
                      {project.objective}
                    </p>
                  </>
                )}
                {/* The technical scope the summary leaves out, read as the
                    second half of the intro. */}
                {project.description && <p className="mt-5">{project.description}</p>}
              </section>
            )}

            {numbered.map((section) => (
              <section key={section.id} className="mt-14">
                <h2 id={section.id} className={SECTION_TITLE}>
                  {t(`project.${section.id}`)}
                </h2>
                <ol className="mt-5 divide-y divide-line border-t border-line">
                  {section.items!.map((item, i) => (
                    <li key={item} className="grid grid-cols-[2.25rem_1fr] py-4">
                      <span className="pt-1 font-mono text-xs font-medium text-lime-ink">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ))}

            {project.results?.length ? (
              <section className="mt-14">
                <h2 id="results" className={SECTION_TITLE}>
                  {t("project.results")}
                </h2>
                <ul className="mt-5 divide-y divide-line border-t border-line">
                  {project.results.map((item) => (
                    <li key={item} className="grid grid-cols-[2.25rem_1fr] py-4">
                      <span
                        aria-hidden="true"
                        className="mt-1 grid h-5 w-5 place-items-center rounded-full bg-lime text-lime-foreground"
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* The body opens with its own "Overview" heading, so the anchor
                goes on the wrapper rather than adding a second one. */}
            <section id="overview" className="mt-14 scroll-mt-14 lg:scroll-mt-0">
              {/* Fernando's own markdown, rendered at build time: the one
                  place dangerouslySetInnerHTML is acceptable. */}
              <div
                className="project-content"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
              <h3 className="mt-10 font-mono text-xs text-muted-foreground">
                {t("project.technologies")}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {technologies.map((item) => (
                  <li key={item}>
                    <Badge variant="secondary">{item}</Badge>
                  </li>
                ))}
              </ul>
            </section>
          </article>

          <div className="lg:hidden">{ask}</div>
        </Module>

        {project.images?.length ? (
          <ProjectGallery id="gallery" images={project.images} title={project.title} />
        ) : null}

        {project.impact && (
          <Module
            as="section"
            span={4}
            tone="anchor"
            reveal
            id="impact"
            className="grid gap-4 p-6 sm:p-10 lg:grid-cols-[13rem_1fr] lg:gap-16"
          >
            <h2 className="font-mono text-xs text-lime dark:text-anchor-foreground/75">
              {t("project.impact")}
            </h2>
            <p className="max-w-[680px] text-xl leading-snug font-medium text-balance sm:text-2xl">
              {project.impact}
            </p>
          </Module>
        )}
      </Bento>
    </Container>
  );
}
