"use client"

import { useState, useMemo } from 'react'
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

interface ProjectsPageClientProps {
  projects: Project[]
  tags: string[]
}

export function ProjectsPageClient({ projects, tags }: ProjectsPageClientProps) {
  const t = useTranslations('projects')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('featured')

  const filteredProjects = useMemo(() => {
    // Always start with a fresh copy of all projects
    let filtered = projects.slice()

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
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
    const sorted = [...filtered]
    switch (sortBy) {
      case 'featured':
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
        break
      case 'newest':
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case 'category':
        sorted.sort((a, b) => a.category.localeCompare(b.category))
        break
    }

    return sorted
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
                {t('page.backToHome')}
              </Link>
            </Button>
          </FadeIn>

          <FadeIn direction="up" delay={0.1}>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t('page.allProjects')}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              {t('page.allProjectsDescription')}
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
                  {filteredProjects.length} {filteredProjects.length === 1 ? t('page.projectFound') : t('page.projectsFound')}
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
                    {t('page.clearAllFilters')}
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
