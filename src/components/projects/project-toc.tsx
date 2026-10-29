"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
}

/**
 * "On this page", with the section in view marked.
 *
 * A vertical list in the left column from lg up (the column itself sticks, so
 * the assistant below stays with it); below that, a bar of chips
 * that sticks under the navigation and scrolls sideways. That bar replaced the
 * tabs of the first mobile design, which hid most of the content.
 */
export function ProjectToc({ items }: { items: TocItem[] }) {
  const t = useTranslations("projects.project");
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    // A band near the top of the viewport: the last section to cross it wins.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[visible.length - 1].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label={t("onThisPage")}
      className="sticky top-16 z-10 -mx-6 bg-card/95 px-6 py-3 backdrop-blur lg:static lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
    >
      <p className="mb-3 hidden font-mono text-xs text-muted-foreground lg:block">
        {t("onThisPage")}
      </p>
      <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors lg:px-0 lg:py-1",
                active === item.id
                  ? "bg-primary font-semibold text-primary-foreground lg:bg-transparent lg:text-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground lg:bg-transparent"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "hidden h-2 w-2 rounded-full lg:inline-block",
                  active === item.id ? "bg-lime ring-1 ring-lime-ink" : "bg-transparent"
                )}
              />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
