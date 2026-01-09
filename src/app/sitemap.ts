import { MetadataRoute } from 'next'
import { getAllProjects } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects()
  const baseUrl = 'https://fernandorios.dev'

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...projectUrls,
  ]
}
