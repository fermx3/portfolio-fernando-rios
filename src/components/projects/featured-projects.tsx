import { getFeaturedProjects } from '@/lib/content'
import { FeaturedProjectsClient } from './featured-projects-client'

export async function FeaturedProjects() {
  const projects = await getFeaturedProjects()
  
  return <FeaturedProjectsClient projects={projects} />
}
