"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { FadeIn } from '@/components/motion/fade-in'
import { ProjectGallery } from '@/components/projects/project-gallery'
import { getCategoryColor, formatDate, generatePlaceholderGradient } from '@/lib/utils'

import { Project } from '@/types/project'

interface ProjectPageClientProps {
  project: Project
}

export function ProjectPageClient({ project }: ProjectPageClientProps) {
  const t = useTranslations('projects')
  const locale = useLocale()

  return (
    <Section className="min-h-screen">
      <Container size="lg">
        <FadeIn direction="up">
          <Button variant="ghost" asChild className="mb-6">
            <Link href={`/${locale}/projects`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('page.backToProjects')}
            </Link>
          </Button>
        </FadeIn>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <FadeIn direction="up" delay={0.1}>
              <div className="mb-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {project.title}
                  </h1>
                  <Badge
                    variant="outline"
                    className={getCategoryColor(project.category)}
                  >
                    {t(`filters.${project.category}`)}
                  </Badge>
                </div>

                <p className="text-lg text-muted-foreground mb-6">
                  {project.summary}
                </p>

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
                      <a href={project.liveUrl || project.demoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t('project.viewDemo')}
                      </a>
                    </Button>
                  )}
                  {project.repoUrl && (
                    <Button variant="outline" asChild>
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        {t('project.viewCode')}
                      </a>
                    </Button>
                  )}
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
                      background: generatePlaceholderGradient(project.title)
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
                className="max-w-none"
                style={{
                  fontSize: '1.125rem',
                  lineHeight: '1.7',
                  color: 'hsl(var(--muted-foreground))'
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: project.content.replace(
                      /<h2>/g, '<h2 style="font-size: 1.5rem; font-weight: 700; margin: 2rem 0 1rem 0; border-bottom: 1px solid hsl(var(--border)); padding-bottom: 0.5rem; color: hsl(var(--foreground));">'
                    ).replace(
                      /<h3>/g, '<h3 style="font-size: 1.25rem; font-weight: 600; margin: 1.5rem 0 0.75rem 0; color: hsl(var(--foreground));">'
                    ).replace(
                      /<p>/g, '<p style="margin-bottom: 1.25rem; line-height: 1.7; color: hsl(var(--muted-foreground));">'
                    ).replace(
                      /<strong>/g, '<strong style="font-weight: 600; color: hsl(var(--foreground));">'
                    ).replace(
                      /<ul>/g, '<ul style="margin: 1.5rem 0; padding-left: 1.5rem; list-style-type: disc;">'
                    ).replace(
                      /<li>/g, '<li style="margin-bottom: 0.5rem; color: hsl(var(--muted-foreground)); display: list-item;">'
                    )
                  }}
                />
              </div>
            </FadeIn>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <FadeIn direction="left" delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle>{t('project.details')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        {t('project.objective')}
                      </h4>
                      <p className="text-sm">{project.objective}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        {t('project.theme')}
                      </h4>
                      <p className="text-sm">{project.theme}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        {t('project.date')}
                      </h4>
                      <p className="text-sm">{formatDate(project.date, locale === 'es' ? 'es-ES' : 'en-US')}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        {t('project.category')}
                      </h4>
                      <Badge
                        variant="outline"
                        className={getCategoryColor(project.category)}
                      >
                        {t(`filters.${project.category}`)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn direction="left" delay={0.3}>
                <Card>
                  <CardHeader>
                    <CardTitle>{t('project.technologies')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
