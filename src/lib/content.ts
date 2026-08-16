"use server";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { cache } from "react";
import { projectSchema } from "./validations";
import { Project } from "@/types/project";

const contentDirectory = path.join(process.cwd(), "content/projects");

// Initialize markdown processor
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export const getAllProjects = cache(async (locale: string = "en"): Promise<Project[]> => {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return [];
    }

    const files = fs.readdirSync(contentDirectory);

    if (files.length === 0) {
      return [];
    }

    const projects = await Promise.all(
      files
        .filter((file) => {
          if (locale === "en") {
            // For English, get files that don't have a locale suffix or have .en.mdx
            return file.endsWith(".mdx") && !file.includes(".es.mdx");
          } else {
            // For other locales, get files with the specific locale suffix
            return file.endsWith(`.${locale}.mdx`);
          }
        })
        .map(async (file) => {
          const filePath = path.join(contentDirectory, file);
          const fileContent = fs.readFileSync(filePath, "utf8");
          const { data, content } = matter(fileContent);

          // Process MDX content to HTML
          const processedContent = md.render(content);

          // Extract slug by removing locale suffix and .mdx extension
          let slug = file.replace(".mdx", "");
          if (locale !== "en" && slug.includes(`.${locale}`)) {
            slug = slug.replace(`.${locale}`, "");
          }

          // Validate frontmatter with Zod
          const validatedData = projectSchema.parse({
            ...data,
            slug,
          });

          return {
            ...validatedData,
            content: processedContent,
          };
        })
    );

    // Sort by date (newest first)
    return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
});

const FEATURED_LIMIT = 6;

export const getFeaturedProjects = cache(async (locale: string = "en"): Promise<Project[]> => {
  const projects = await getAllProjects(locale);
  const featured = projects.filter((project) => project.featured);

  // The home page shows FEATURED_LIMIT projects. Without this, marking a
  // seventh project as featured drops the oldest one silently.
  if (featured.length > FEATURED_LIMIT) {
    const dropped = featured.slice(FEATURED_LIMIT).map((p) => p.slug);
    console.warn(
      `[content] ${featured.length} featured projects for locale "${locale}" but only ` +
        `${FEATURED_LIMIT} are shown. Not rendered: ${dropped.join(", ")}`
    );
  }

  return featured.slice(0, FEATURED_LIMIT);
});

export const getProjectBySlug = cache(
  async (slug: string, locale: string = "en"): Promise<Project | null> => {
    try {
      // Determine the correct file name based on locale
      const fileName = locale === "en" ? `${slug}.mdx` : `${slug}.${locale}.mdx`;
      const filePath = path.join(contentDirectory, fileName);

      // If the localized file doesn't exist, fall back to English
      let fileToRead = filePath;
      if (!fs.existsSync(filePath) && locale !== "en") {
        const fallbackPath = path.join(contentDirectory, `${slug}.mdx`);
        if (fs.existsSync(fallbackPath)) {
          fileToRead = fallbackPath;
        } else {
          return null;
        }
      }

      const fileContent = fs.readFileSync(fileToRead, "utf8");
      const { data, content } = matter(fileContent);

      // Process MDX content to HTML
      const processedContent = md.render(content);

      const validatedData = projectSchema.parse({
        ...data,
        slug,
      });

      return {
        ...validatedData,
        content: processedContent,
      };
    } catch {
      return null;
    }
  }
);

export const getAllTags = cache(async (locale: string = "en"): Promise<string[]> => {
  const projects = await getAllProjects(locale);
  const allTags = projects.flatMap((project) => project.tags);
  return Array.from(new Set(allTags)).sort();
});
