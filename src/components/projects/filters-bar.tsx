"use client"

import { useTranslations } from 'next-intl'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ProjectCategory } from '@/types/project'

interface FiltersBarProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  tags: string[]
  selectedTags: string[]
  onTagToggle: (tag: string) => void
}

const categories: (ProjectCategory | 'all')[] = ['all', 'data-science', 'full-stack', 'ml', 'visualization', 'web-development']

export function FiltersBar({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  tags,
  selectedTags,
  onTagToggle,
}: FiltersBarProps) {
  const t = useTranslations('projects')

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
            onClick={() => onSearchChange('')}
            aria-label={t('search.clear')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-3 text-sm font-medium">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className="text-sm"
            >
              {t(`filters.${category}`)}
            </Button>
          ))}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Active filters count */}
      {(selectedCategory !== 'all' || searchQuery || selectedTags.length > 0) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Active filters:</span>
          {selectedCategory !== 'all' && (
            <Badge variant="secondary">{t(`filters.${selectedCategory}`)}</Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary">&quot;{searchQuery}&quot;</Badge>
          )}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      )}
    </div>
  )
}
