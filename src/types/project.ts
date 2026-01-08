export interface Project {
  slug: string
  title: string
  summary: string
  objective: string
  theme: string
  category: 'data-science' | 'full-stack' | 'ml' | 'visualization'
  tags: string[]
  featured: boolean
  date: string
  repoUrl: string
  demoUrl: string
  coverImage: string
  content: string
}

export type ProjectCategory = Project['category']
