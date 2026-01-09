"use client"

import { useState, useMemo, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { FadeIn } from '@/components/motion/fade-in'
import { ProjectGrid } from '@/components/projects/project-grid'
import { FiltersBar } from '@/components/projects/filters-bar'
import { Project } from '@/types/project'

// This would normally be fetched from the server
// For demo purposes, we'll use a placeholder array
const getAllProjectsData = async (): Promise<Project[]> => {
  // In a real app, this would call getAllProjects() from lib/content
  return []
}

const getAllTagsData = async (): Promise<string[]> => {
  // In a real app, this would call getAllTags() from lib/content
  return []
}

export default function ProjectsPage() {
  const t = useTranslations('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    // Load projects and tags
    Promise.all([
      getAllProjectsData(),
      getAllTagsData()
    ]).then(([projectsData, tagsData]) => {
      setProjects(projectsData)
      setTags(tagsData)
    })
  }, [])

  const filteredProjects = useMemo(() => {
    let filtered = projects

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.summary.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(project =>
        selectedTags.every(tag => project.tags.includes(tag))
      )
    }

    // Sort projects
    switch (sortBy) {
      case 'featured':
        return filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
      case 'newest':
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      case 'category':
        return filtered.sort((a, b) => a.category.localeCompare(b.category))
      default:
        return filtered
    }
  }, [projects, selectedCategory, searchQuery, selectedTags, sortBy])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <Section className="min-h-screen">
      <Container>
        <div className="mb-8">
          <FadeIn direction="up">
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </FadeIn>

          <FadeIn direction="up" delay={0.1}>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              All Projects
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Explore my complete portfolio of data science and development projects.
            </p>
          </FadeIn>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <FadeIn direction="right" delay={0.2}>
              <div className="sticky top-24">
                <FiltersBar
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  tags={tags}
                  selectedTags={selectedTags}
                  onTagToggle={handleTagToggle}
                />
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-3">
            <FadeIn direction="left" delay={0.3}>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
                </p>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="featured">{t('sort.featured')}</option>
                  <option value="newest">{t('sort.newest')}</option>
                  <option value="category">{t('sort.category')}</option>
                </select>
              </div>

              {filteredProjects.length > 0 ? (
                <ProjectGrid projects={filteredProjects} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('empty')}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSelectedCategory('all')
                      setSearchQuery('')
                      setSelectedTags([])
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </FadeIn>
          </div>
        </div>
      </Container>
    </Section>
  )
}
