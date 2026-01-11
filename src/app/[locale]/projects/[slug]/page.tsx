import { notFound } from 'next/navigation'
import { getProjectBySlug, getAllProjects } from '@/lib/content'
import { Metadata } from 'next'
import { ProjectPageClient } from './project-page-client'

interface ProjectPageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export async function generateStaticParams() {
  const enProjects = await getAllProjects('en')
  const esProjects = await getAllProjects('es')

  return [
    ...enProjects.map(project => ({
      slug: project.slug,
      locale: 'en'
    })),
    ...esProjects.map(project => ({
      slug: project.slug,
      locale: 'es'
    }))
  ]
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const project = await getProjectBySlug(slug, locale)

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
  const { slug, locale } = await params
  const project = await getProjectBySlug(slug, locale)

  if (!project) {
    notFound()
  }

  return <ProjectPageClient project={project} />
}
