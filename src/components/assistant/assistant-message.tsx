"use client";

import { Fragment } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { CorpusProject } from "@/lib/assistant/corpus";

/** A citation, or a **bold** run. The prompt limits the model to this subset. */
const INLINE = /\[\[([a-z0-9-]+)\]\]|\*\*(.+?)\*\*/g;
const CITATION = /\[\[([a-z0-9-]+)\]\]/g;

/**
 * Turns one line of model output into React nodes.
 *
 * Everything is built as elements rather than markup: this is model output, so
 * it never goes through dangerouslySetInnerHTML. The project pages do use that,
 * but the markdown there is Fernando's own.
 *
 * A citation is only linked when its slug is a real project, so a hallucinated
 * one is dropped instead of becoming a 404.
 */
function inline(
  text: string,
  bySlug: Map<string, CorpusProject>,
  onNavigate: () => void
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(INLINE)) {
    const [raw, slug, bold] = match;
    const start = match.index ?? 0;
    if (start > cursor) parts.push(text.slice(cursor, start));
    cursor = start + raw.length;

    if (slug) {
      const project = bySlug.get(slug);
      if (project) {
        parts.push(
          <Link
            key={`${slug}-${start}`}
            href={`/projects/${slug}`}
            onClick={onNavigate}
            className="font-medium underline underline-offset-4 hover:no-underline"
          >
            {project.title}
          </Link>
        );
      }
      continue;
    }

    parts.push(
      <strong key={`b-${start}`} className="font-semibold">
        {bold}
      </strong>
    );
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts.map((part, i) => <Fragment key={i}>{part}</Fragment>);
}

/** Projects cited in an answer, in order of first mention, known slugs only. */
function citedProjects(text: string, bySlug: Map<string, CorpusProject>): CorpusProject[] {
  const seen = new Set<string>();
  const cited: CorpusProject[] = [];
  for (const [, slug] of text.matchAll(CITATION)) {
    const project = bySlug.get(slug);
    if (project && !seen.has(slug)) {
      seen.add(slug);
      cited.push(project);
    }
  }
  return cited;
}

interface AssistantMessageProps {
  text: string;
  projects: CorpusProject[];
  /** Citations navigate away; the panel closes so the page is visible. */
  onNavigate: () => void;
  /** Cards wait for the full answer, so they do not pop in mid-stream. */
  complete: boolean;
}

/**
 * The model writes markdown, so rendering it as one flat string collapsed every
 * list into a wall of text with literal "-" and "**" in it. This handles the
 * subset the prompt asks for — paragraphs and simple bullets — and nothing else.
 */
export function AssistantMessage({ text, projects, onNavigate, complete }: AssistantMessageProps) {
  const t = useTranslations("contact.assistant");
  const tStatus = useTranslations("projects.status");
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const blocks: { type: "p" | "ul"; lines: string[] }[] = [];

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;

    const bullet = line.match(/^[-*]\s+(.*)$/);
    const last = blocks[blocks.length - 1];

    if (bullet) {
      if (last?.type === "ul") last.lines.push(bullet[1]);
      else blocks.push({ type: "ul", lines: [bullet[1]] });
    } else {
      blocks.push({ type: "p", lines: [line] });
    }
  }

  const cited = complete ? citedProjects(text, bySlug) : [];

  return (
    <div className="space-y-2 leading-relaxed">
      {blocks.map((block, i) =>
        block.type === "ul" ? (
          <ul key={i} className="list-disc space-y-1 pl-4">
            {block.lines.map((item, j) => (
              <li key={j}>{inline(item, bySlug, onNavigate)}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{inline(block.lines[0], bySlug, onNavigate)}</p>
        )
      )}

      {cited.length > 0 && (
        <ul className="space-y-2 pt-2">
          {cited.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                onClick={onNavigate}
                className="flex w-fit max-w-full items-center gap-3 rounded-row bg-panel-foreground/10 p-2 pr-4 press hover:bg-panel-foreground/15"
              >
                <Image
                  src={project.coverImage}
                  alt=""
                  width={56}
                  height={36}
                  className="h-9 w-14 shrink-0 rounded-md object-cover object-top"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{project.title}</span>
                  <span className="block font-mono text-xs opacity-80">
                    {project.status === "production" && (
                      <span className="text-lime">
                        <span className="live-dot">●</span> {tStatus("production")} ·{" "}
                      </span>
                    )}
                    {t("viewProject")} <span aria-hidden="true">→</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
