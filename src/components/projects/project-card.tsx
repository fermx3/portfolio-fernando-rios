import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Module } from "@/components/ui/module";
import { ImageWithPlaceholder } from "@/components/ui/image-with-placeholder";
import { ProjectStatus } from "./project-status";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

/**
 * One card in the listing: screenshot, metadata, summary and the project's
 * metric. Demo and code links live on the detail page; here the whole card is
 * a single link, so it is one target and one tab stop.
 *
 * Below sm the card turns sideways (screenshot left, text right) so a phone
 * shows several projects per screen, as in M3.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations("projects");
  const year = project.date.slice(0, 4);

  return (
    <Module
      as="article"
      bleed
      reveal
      // Lets a filter change move each card to its new place (see
      // withViewTransition in the listing).
      style={{ viewTransitionName: `card-${project.slug}` }}
      className="group relative col-span-2 flex flex-row has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring sm:col-span-1 sm:flex-col"
    >
      <div className="relative w-32 shrink-0 overflow-hidden sm:aspect-[16/10] sm:w-auto">
        <ImageWithPlaceholder
          src={project.coverImage}
          alt=""
          placeholderSeed={project.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 128px"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span className="font-mono text-xs text-muted-foreground">
            {t(`filters.${project.category}`)} · {year}
          </span>
          <ProjectStatus status={project.status} className="max-sm:hidden" />
        </div>

        <h2 className="mt-2 text-base leading-tight font-bold sm:text-lg">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 after:rounded-module focus-visible:outline-none"
          >
            {project.title}
          </Link>
        </h2>

        <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground max-sm:hidden sm:mb-4">
          {project.summary}
        </p>

        {project.metric && (
          <p className="mt-auto pt-3 text-sm leading-snug sm:border-t sm:border-line">
            <strong className="font-bold">{project.metric.value}</strong> {project.metric.label}
          </p>
        )}
      </div>
    </Module>
  );
}
