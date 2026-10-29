import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Module } from "@/components/ui/module";
import { ImageWithPlaceholder } from "@/components/ui/image-with-placeholder";
import { ProjectStatus } from "./project-status";
import type { Project } from "@/types/project";

interface FeaturedProjectProps {
  project: Project;
  /** "lead" spans two columns with the screenshot beside the text. */
  size: "lead" | "short";
  id?: string;
}

// The title link stretches over the whole module, so the card is one target
// and one tab stop. The module shows its focus ring instead of the link.
const STRETCHED = "after:absolute after:inset-0 after:rounded-module focus-visible:outline-none";
// "group" drives the hover: the screenshot zooms a little and the arrow moves,
// which is what tells a visitor the whole module is a link.
const FOCUS_RING = "group relative has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring";

export function FeaturedProject({ project, size, id }: FeaturedProjectProps) {
  const t = useTranslations("projects");
  const year = project.date.slice(0, 4);

  if (size === "short") {
    return (
      <Module as="article" compact bleed reveal id={id} className={`${FOCUS_RING} flex flex-col`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <ImageWithPlaceholder
            src={project.coverImage}
            alt=""
            placeholderSeed={project.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4 sm:p-5">
          <ProjectStatus status={project.status} />
          <h3 className="text-base font-bold leading-tight sm:text-lg">
            <Link href={`/projects/${project.slug}`} className={STRETCHED}>
              {project.title}
            </Link>
          </h3>
          {project.metric && (
            <p className="text-sm leading-snug">
              <strong className="font-bold">{project.metric.value}</strong> {project.metric.label}
            </p>
          )}
        </div>
      </Module>
    );
  }

  return (
    <Module
      as="article"
      span={2}
      bleed
      reveal
      id={id}
      className={`${FOCUS_RING} grid sm:grid-cols-2`}
    >
      <h2 className="sr-only">{t("title")}</h2>
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:min-h-64">
        <ImageWithPlaceholder
          src={project.coverImage}
          alt=""
          placeholderSeed={project.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ProjectStatus status={project.status} variant="chip" />
          <span className="font-mono text-xs text-muted-foreground">
            {t(`filters.${project.category}`)} · {year}
          </span>
        </div>
        <h3 className="mt-3 text-h3 font-bold sm:text-2xl sm:leading-[1.05]">
          <Link href={`/projects/${project.slug}`} className={STRETCHED}>
            {project.title}
          </Link>
        </h3>
        {/* Clamped: the summary is written for the listing card and the meta
            description, not for a module that shares its row. The full text
            is still in the DOM for screen readers. */}
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-4">
          {project.metric && (
            <p className="leading-tight">
              <span className="block text-4xl font-bold tracking-tight">
                {project.metric.value}
              </span>
              <span className="text-sm">{project.metric.label}</span>
            </p>
          )}
          <span
            aria-hidden="true"
            className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Module>
  );
}
