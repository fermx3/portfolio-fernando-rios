"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Bento, Module } from "@/components/ui/module";
import { AskMini } from "@/components/assistant/ask-mini";
import { ProjectCard } from "@/components/projects/project-card";
import { FiltersBar, type SortKey } from "@/components/projects/filters-bar";
import { Project, ProjectCategory } from "@/types/project";

interface ProjectsPageClientProps {
  projects: Project[];
  tags: string[];
}

export function ProjectsPageClient({ projects, tags }: ProjectsPageClientProps) {
  const t = useTranslations("projects");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>("featured");

  // In first-seen order, which follows the date sort from getAllProjects().
  const categories = useMemo(
    () => [...new Set(projects.map((p) => p.category))] as ProjectCategory[],
    [projects]
  );

  const filteredProjects = useMemo(() => {
    let filtered = projects.slice();

    if (selectedCategory !== "all") {
      filtered = filtered.filter((project) => project.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.summary.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // AND: every selected tag must be on the project.
    if (selectedTags.length > 0) {
      filtered = filtered.filter((project) =>
        selectedTags.every((tag) => project.tags.includes(tag))
      );
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case "featured":
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "category":
        sorted.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }

    return sorted;
  }, [projects, selectedCategory, searchQuery, selectedTags, sortBy]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const count = filteredProjects.length;

  return (
    <Container className="pt-2 pb-3">
      <Bento>
        <Module span={3} className="flex flex-col gap-6 sm:flex-row sm:items-end sm:p-9">
          <div className="flex-1">
            <Link
              href="/"
              className="font-mono text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              ← {t("page.backToHome")}
            </Link>
            <h1 className="mt-6 text-5xl leading-[0.95] font-bold tracking-[-0.035em] sm:text-h1">
              {t("page.allProjects")}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-body">
              {t("page.allProjectsDescription")}
            </p>
          </div>
          {/* Announced, so a screen reader hears the result of each filter. */}
          <p className="shrink-0 sm:text-right" aria-live="polite">
            <span className="block text-5xl leading-none font-bold tracking-tight">{count}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {count === 1 ? t("page.projectFound") : t("page.projectsFound")}
            </span>
          </p>
        </Module>

        <AskMini title={t("page.lookingFor")} example={t("page.askExample")} />

        <FiltersBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          tags={tags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {count > 0 ? (
          filteredProjects.map((project) => <ProjectCard key={project.slug} project={project} />)
        ) : (
          <Module span={4} className="py-12 text-center">
            <p className="text-muted-foreground">{t("page.noResults")}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setSelectedTags([]);
              }}
            >
              {t("page.clearAllFilters")}
            </Button>
          </Module>
        )}
      </Bento>
    </Container>
  );
}
