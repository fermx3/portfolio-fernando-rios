"use client";

import { ImageWithPlaceholder } from "@/components/ui/image-with-placeholder";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ExternalLink, Github, Lock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/project";
import { getCategoryColor, generatePlaceholderGradient } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations("projects");
  return (
    <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          {project.coverImage ? (
            <ImageWithPlaceholder
              src={project.coverImage}
              alt={project.title}
              placeholderSeed={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
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
      </Link>

      <CardHeader>
        <div className="flex items-baseline justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors flex-1 min-w-0">
            {project.title}
          </CardTitle>
          <Badge
            variant="outline"
            className={`${getCategoryColor(project.category)} flex-shrink-0 whitespace-nowrap`}
          >
            {t(`filters.${project.category}`)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{project.summary}</p>

        <div className="space-y-2">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("card.objective")}
            </span>
            <p className="text-sm">{project.objective}</p>
          </div>

          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("card.theme")}
            </span>
            <p className="text-sm">{project.theme}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        {(project.liveUrl || project.demoUrl || project.repoUrl) && (
          <div className="flex gap-2 w-full">
            {(project.liveUrl || project.demoUrl) && (
              <Button variant="outline" size="sm" asChild className="flex-1">
                <a
                  href={project.liveUrl || project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  {t("links.demo")}
                </a>
              </Button>
            )}
            {project.repoUrl &&
              (project.repoPrivate ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="flex-1"
                  title={t("links.repoPrivate")}
                >
                  <Lock className="mr-1 h-3 w-3" />
                  {t("links.repoPrivate")}
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-1 h-3 w-3" />
                    {t("links.repo")}
                  </a>
                </Button>
              ))}
          </div>
        )}
        <Button size="sm" asChild className="w-full">
          <Link href={`/projects/${project.slug}`}>{t("links.details")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
