'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { FadeIn } from '@/components/motion/fade-in'
import { ProjectGrid } from './project-grid'
import type { Project } from '@/types/project'

interface FeaturedProjectsClientProps {
  projects: Project[]
}

export function FeaturedProjectsClient({ projects }: FeaturedProjectsClientProps) {
  const t = useTranslations('projects')

  return (
    <Section id="projects">
      <Container>
        <div className="text-center">
          <FadeIn direction="up">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t('title')}
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              {t('subtitle')}
            </p>
          </FadeIn>
        </div>

        {projects.length > 0 ? (
          <>
            <div className="mt-16">
              <ProjectGrid projects={projects} />
            </div>

            <FadeIn direction="up" delay={0.3}>
              <div className="mt-16 text-center">
                <Button asChild size="lg">
                  <Link href="/projects">
                    {t('viewMore')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </>
        ) : (
          <FadeIn direction="up" delay={0.2}>
            <div className="mt-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-4xl mb-4">📁</div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  {t('empty')}
                </h3>
                <p className="text-muted-foreground">
                  {t('emptyDescription')}
                </p>
              </div>
            </div>
          </FadeIn>
        )}
      </Container>
    </Section>
  )
}
