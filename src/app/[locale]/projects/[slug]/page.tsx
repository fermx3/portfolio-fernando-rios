import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { FadeIn } from '@/components/motion/fade-in'
import { getProjectBySlug, getAllProjects } from '@/lib/content'
import { getCategoryColor, formatDate, generatePlaceholderGradient } from '@/lib/utils'
import { Metadata } from 'next'

interface ProjectPageProps {
  params: {
    slug: string
    locale: string
  }
}

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map(project => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)

  if (!project) {
    return {
      title: 'Project Not Found'
    }
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'article',
      publishedTime: project.date,
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  return (
    <Section className="min-h-screen">
      <Container size="lg">
        <FadeIn direction="up">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
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
                    {project.category}
                  </Badge>
                </div>

                <p className="text-lg text-muted-foreground mb-6">
                  {project.summary}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button asChild>
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Demo
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </a>
                  </Button>
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

            {/* Project Content */}
            <FadeIn direction="up" delay={0.3}>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: project.content }} />
              </div>
            </FadeIn>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <FadeIn direction="left" delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        Objective
                      </h4>
                      <p className="text-sm">{project.objective}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        Theme
                      </h4>
                      <p className="text-sm">{project.theme}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        Date
                      </h4>
                      <p className="text-sm">{formatDate(project.date)}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        Category
                      </h4>
                      <Badge
                        variant="outline"
                        className={getCategoryColor(project.category)}
                      >
                        {project.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn direction="left" delay={0.3}>
                <Card>
                  <CardHeader>
                    <CardTitle>Technologies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
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
