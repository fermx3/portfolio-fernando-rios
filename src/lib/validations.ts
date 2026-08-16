import { z } from "zod";

// An image can be a plain string (treated as "web") or an object that
// declares its orientation so the gallery can pick the right aspect ratio.
export const projectImageSchema = z.union([
  z.string(),
  z.object({
    src: z.string(),
    type: z.enum(["mobile", "web"]).optional(),
    alt: z.string().optional(),
  }),
]);

export const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  objective: z.string().optional(),
  theme: z.string().optional(),
  category: z.enum([
    "data-science",
    "full-stack",
    "ml",
    "visualization",
    "web-development",
    "backend-development",
  ]),
  tags: z.array(z.string()),
  technologies: z.array(z.string()).optional(),
  featured: z.boolean(),
  // Closed set: it was a free string with "completed", "production" and
  // "producción" all in use across the corpus.
  status: z.enum(["completed", "production", "archived"]).optional(),
  // Calendar date only — formatDate() renders it in UTC to keep the day stable.
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be a YYYY-MM-DD string"),
  repoUrl: z.string(),
  repoPrivate: z.boolean().optional(),
  liveUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  coverImage: z.string(),
  images: z.array(projectImageSchema).optional(),
  challenges: z.array(z.string()).optional(),
  solutions: z.array(z.string()).optional(),
  results: z.array(z.string()).optional(),
});

export type ProjectFrontmatter = z.infer<typeof projectSchema>;
