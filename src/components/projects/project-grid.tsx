"use client";

import { Project } from "@/types/project";
import { ProjectCard } from "./project-card";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No projects found matching the selected filters.</p>
      </div>
    );
  }

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
