"use client"

import { Project } from '@/types/project'
import { ProjectCard } from './project-card'
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger-container'

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <StaggerItem key={project.slug}>
          <ProjectCard project={project} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}
