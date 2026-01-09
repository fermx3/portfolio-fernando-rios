import { z } from 'zod'

export const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  objective: z.string().optional(),
  theme: z.string().optional(),
  category: z.enum(['data-science', 'full-stack', 'ml', 'visualization', 'web-development']),
  tags: z.array(z.string()),
  technologies: z.array(z.string()).optional(),
  featured: z.boolean(),
  status: z.string().optional(),
  date: z.string(),
  repoUrl: z.string(),
  liveUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  coverImage: z.string(),
  images: z.array(z.string()).optional(),
  challenges: z.array(z.string()).optional(),
  solutions: z.array(z.string()).optional(),
  results: z.array(z.string()).optional(),
})

export type ProjectFrontmatter = z.infer<typeof projectSchema>
