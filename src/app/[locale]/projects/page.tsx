import { useTranslations } from 'next-intl'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { FadeIn } from '@/components/motion/fade-in'
import { getAllProjects, getAllTags } from '@/lib/content'
import { ProjectsPageClient } from './projects-client'

export default async function ProjectsPage() {
  const projects = await getAllProjects()
  const tags = await getAllTags()

  return <ProjectsPageClient projects={projects} tags={tags} />
}
