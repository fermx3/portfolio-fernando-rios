'use server'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { cache } from 'react'
import { ProjectFrontmatter, projectSchema } from './validations'
import { Project } from '@/types/project'

const contentDirectory = path.join(process.cwd(), 'content/projects')

export const getAllProjects = cache(async (): Promise<Project[]> => {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return []
    }

    const files = fs.readdirSync(contentDirectory)

    if (files.length === 0) {
      return []
    }

  const projects = await Promise.all(
    files
      .filter(file => file.endsWith('.mdx'))
      .map(async file => {
        const filePath = path.join(contentDirectory, file)
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const { data, content } = matter(fileContent)

        // Validate frontmatter with Zod
        const validatedData = projectSchema.parse({
          ...data,
          slug: file.replace('.mdx', ''),
        })

        return {
          ...validatedData,
          content,
        }
      })
  )

  // Sort by date (newest first)
  return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
} catch {
    return []
  }
})

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const projects = await getAllProjects()
  return projects.filter(project => project.featured).slice(0, 6)
})

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  try {
    const filePath = path.join(contentDirectory, `${slug}.mdx`)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)

    const validatedData = projectSchema.parse({
      ...data,
      slug,
    })

    return {
      ...validatedData,
      content,
    }
  } catch {
    return null
  }
})

export const getAllTags = cache(async (): Promise<string[]> => {
  const projects = await getAllProjects()
  const allTags = projects.flatMap(project => project.tags)
  return Array.from(new Set(allTags)).sort()
})

export const getProjectsByCategory = cache(async (category: string): Promise<Project[]> => {
  const projects = await getAllProjects()
  return projects.filter(project => project.category === category)
})

export const searchProjects = cache(async (query: string): Promise<Project[]> => {
  const projects = await getAllProjects()
  const lowerQuery = query.toLowerCase()

  return projects.filter(project =>
    project.title.toLowerCase().includes(lowerQuery) ||
    project.summary.toLowerCase().includes(lowerQuery) ||
    project.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
})
