import { MetadataRoute } from 'next'
import { getAllProjects } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const enProjects = await getAllProjects('en')
  const esProjects = await getAllProjects('es')
  const baseUrl = 'https://fernandorios.dev'

  const enProjectUrls = enProjects.map((project) => ({
    url: `${baseUrl}/en/projects/${project.slug}`,
    lastModified: new Date(project.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const esProjectUrls = esProjects.map((project) => ({
    url: `${baseUrl}/es/projects/${project.slug}`,
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
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/es`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/es/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...enProjectUrls,
    ...esProjectUrls,
  ]
}
