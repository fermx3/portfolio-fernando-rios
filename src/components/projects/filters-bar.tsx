"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Search, X } from "lucide-react";
import { Module } from "@/components/ui/module";
import { cn } from "@/lib/utils";
import { ProjectCategory } from "@/types/project";

export type SortKey = "featured" | "newest" | "category";

interface FiltersBarProps {
  /** Only categories some project uses: an empty filter is a dead end. */
  categories: ProjectCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  sortBy: SortKey;
  onSortChange: (sort: SortKey) => void;
}

const chip = (active: boolean) =>
  cn(
    "rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap press focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
    active ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/70"
  );

export function FiltersBar({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  tags,
  selectedTags,
  onTagToggle,
  sortBy,
  onSortChange,
}: FiltersBarProps) {
  const t = useTranslations("projects");
  // Tags stay one click away rather than on show: there are dozens of them, and
  // the design keeps the bar to search, categories and sort. Starts open if a
  // tag is already active, so an active filter is never hidden.
  const [tagsOpen, setTagsOpen] = useState(selectedTags.length > 0);

  return (
    <Module span={4} className="space-y-3 p-3 sm:p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-72 lg:shrink-0">
          <Search
            className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder={t("search.placeholder")}
            aria-label={t("search.placeholder")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 w-full rounded-full bg-secondary pr-10 pl-10 text-base outline-none sm:text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-search-cancel-button]:hidden"
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute top-1/2 right-2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full hover:bg-background"
              onClick={() => onSearchChange("")}
              aria-label={t("search.clear")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Scrolls sideways on a phone instead of wrapping into several rows. */}
        <div
          role="group"
          aria-label={t("filters.categories")}
          className="-mx-3 flex gap-2 overflow-x-auto [scrollbar-width:none] px-3 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
        >
          {(["all", ...categories] as const).map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={selectedCategory === category}
              onClick={() => onCategoryChange(category)}
              className={chip(selectedCategory === category)}
            >
              {t(`filters.${category}`)}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 lg:ml-auto">
          {tags.length > 0 && (
            <button
              type="button"
              aria-expanded={tagsOpen}
              aria-controls="tag-filters"
              onClick={() => setTagsOpen(!tagsOpen)}
              className="press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium hover:bg-secondary"
            >
              {t("filters.tags")}
              {selectedTags.length > 0 && (
                <span className="rounded-full bg-lime px-2 font-mono text-xs text-lime-foreground">
                  {t("filters.tagsActive", { count: selectedTags.length })}
                </span>
              )}
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", tagsOpen && "rotate-180")}
                aria-hidden="true"
              />
            </button>
          )}

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            {t("sort.label")}
            <span className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortKey)}
                className="h-9 appearance-none rounded-full bg-secondary pr-8 pl-4 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="featured">{t("sort.featured")}</option>
                <option value="newest">{t("sort.newest")}</option>
                <option value="category">{t("sort.category")}</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-foreground"
                aria-hidden="true"
              />
            </span>
          </label>
        </div>
      </div>

      {tags.length > 0 && (
        <div
          id="tag-filters"
          role="group"
          aria-label={t("filters.tags")}
          hidden={!tagsOpen}
          className="flex flex-wrap gap-1.5 border-t border-line px-1 pt-3"
        >
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={selectedTags.includes(tag)}
              onClick={() => onTagToggle(tag)}
              className={cn(chip(selectedTags.includes(tag)), "px-3 py-1 text-xs")}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </Module>
  );
}
