"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ExternalLink, Github } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Project } from '@/types/project'
import { getCategoryColor, generatePlaceholderGradient } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations('projects')

  return (
    <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: generatePlaceholderGradient(project.title)
            }}
          />
        )}
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
            {project.title}
          </CardTitle>
          <Badge
            variant="outline"
            className={getCategoryColor(project.category)}
          >
            {t(`filters.${project.category}`)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {project.summary}
        </p>

        <div className="space-y-2">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Objective
            </span>
            <p className="text-sm">{project.objective}</p>
          </div>

          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Theme
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

      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" asChild className="flex-1">
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-1 h-3 w-3" />
            {t('links.demo')}
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild className="flex-1">
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-1 h-3 w-3" />
            {t('links.repo')}
          </a>
        </Button>
        <Button size="sm" asChild>
          <Link href={`/projects/${project.slug}`}>
            {t('links.details')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
