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
  // Closing statement: what the project changed and for whom. Rendered last,
  // after the results, so the page ends on the "so what".
  impact: z.string().optional(),
  // One headline figure per project, shown on its card and detail page.
  // `value` is shared between EN and ES; only `label` is translated. It must be
  // verifiable in the project's repo: a project without one simply shows none.
  metric: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .optional(),
  // Team projects only. `size` is shared between EN and ES; `role` is translated.
  team: z
    .object({
      size: z.number().int().positive(),
      role: z.string().optional(),
    })
    .optional(),
  // Where the project came from, shown under its date ("Final project, Le Wagon").
  context: z.string().optional(),
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
  // Closed set, and required: the chip shows on the home page, the listing,
  // the detail page and the assistant's citations.
  //   production  - in real use, by the business or a client
  //   development - still being built, not in real use yet
  //   completed   - finished, with no live deployment in use
  //   archived    - no longer maintained or used; kept as a sample of work
  status: z.enum(["production", "development", "completed", "archived"]),
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
