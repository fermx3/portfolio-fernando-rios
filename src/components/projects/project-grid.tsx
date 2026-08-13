"use client";

import { Project } from "@/types/project";
import { ProjectCard } from "./project-card";

interface ProjectGridProps {
  projects: Project[];
}

// Callers own the empty state: both ProjectsPageClient and FeaturedProjectsClient
// guard on length > 0 and render their own translated message, so the branch that
// used to live here was unreachable.
export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <div
          key={project.slug}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationFillMode: "both",
          }}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
