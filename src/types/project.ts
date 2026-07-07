export type ProjectImage =
  | string
  | { src: string; type?: 'mobile' | 'web'; alt?: string }

export interface Project {
  slug: string
  title: string
  summary: string
  description?: string
  objective?: string
  theme?: string
  category: 'data-science' | 'full-stack' | 'ml' | 'visualization' | 'web-development' | 'backend-development'
  tags: string[]
  technologies?: string[]
  featured: boolean
  status?: string
  date: string
  repoUrl: string
  liveUrl?: string
  demoUrl?: string
  coverImage: string
  images?: ProjectImage[]
  challenges?: string[]
  solutions?: string[]
  results?: string[]
  content: string
}

export type ProjectCategory = Project['category']
