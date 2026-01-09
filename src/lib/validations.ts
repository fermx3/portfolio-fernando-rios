import { z } from 'zod'

export const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  objective: z.string(),
  theme: z.string(),
  category: z.enum(['data-science', 'full-stack', 'ml', 'visualization']),
  tags: z.array(z.string()),
  featured: z.boolean(),
  date: z.string(),
  repoUrl: z.string(),
  demoUrl: z.string(),
  coverImage: z.string(),
})

export type ProjectFrontmatter = z.infer<typeof projectSchema>
