import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";
import { projectSchema } from "@/lib/validations";

const contentDirectory = path.join(process.cwd(), "content/projects");

export interface CorpusProject {
  slug: string;
  title: string;
}

export interface Corpus {
  /** The whole corpus as plain text, ready to go in the system prompt. */
  text: string;
  /** slug → title, so the client can label the citation links. */
  projects: CorpusProject[];
}

/**
 * Reads the raw markdown instead of reusing getAllProjects().
 *
 * getAllProjects() renders the body to HTML for the page. Feeding HTML to the
 * model would spend tokens on tags that carry no meaning, so this reads the
 * source and keeps the markdown.
 */
function readProjectFiles(locale: string) {
  if (!fs.existsSync(contentDirectory)) return [];

  const suffix = locale === "en" ? ".mdx" : `.${locale}.mdx`;

  return (
    fs
      .readdirSync(contentDirectory)
      .filter((file) =>
        locale === "en" ? file.endsWith(".mdx") && !file.includes(".es.mdx") : file.endsWith(suffix)
      )
      // Sorted so the corpus bytes are identical on every request. The prompt
      // cache is a prefix match: a different order is a different prefix and
      // every entry after it is a miss.
      .sort()
      .map((file) => {
        const raw = fs.readFileSync(path.join(contentDirectory, file), "utf8");
        const { data, content } = matter(raw);
        const slug = file.replace(suffix, "");
        return { slug, data, body: content.trim() };
      })
  );
}

function line(label: string, value: string | undefined) {
  return value ? `${label}: ${value}\n` : "";
}

function list(label: string, items: string[] | undefined) {
  if (!items || items.length === 0) return "";
  return `${label}:\n${items.map((i) => `- ${i}`).join("\n")}\n`;
}

/**
 * The whole corpus for a locale, as one string.
 *
 * It is about 16k tokens, which fits in the context window several times over,
 * so there is no retrieval step: the model sees every project at once. That
 * also answers questions top-k retrieval gets wrong, like "which projects used
 * FastAPI" or "which is the most recent".
 */
export const buildCorpus = cache((locale: string): Corpus => {
  const files = readProjectFiles(locale);
  const projects: CorpusProject[] = [];
  const sections: string[] = [];

  for (const file of files) {
    let project;
    try {
      project = projectSchema.parse({ ...file.data, slug: file.slug });
    } catch {
      // One malformed file must not empty the corpus, which is what the
      // try/catch in getAllProjects() does to the project list.
      continue;
    }

    projects.push({ slug: project.slug, title: project.title });

    const links = [
      project.liveUrl || project.demoUrl ? `demo ${project.liveUrl || project.demoUrl}` : "",
      project.repoPrivate ? "repo private" : project.repoUrl ? `repo ${project.repoUrl}` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    sections.push(
      `## ${project.title}\n` +
        `slug: ${project.slug}\n` +
        `date: ${project.date} · category: ${project.category}\n` +
        line("status", project.status) +
        line("tags", project.tags.join(", ")) +
        line("technologies", project.technologies?.join(", ")) +
        line("links", links) +
        line("summary", project.summary) +
        line("description", project.description) +
        line("objective", project.objective) +
        line("theme", project.theme) +
        list("challenges", project.challenges) +
        list("solutions", project.solutions) +
        list("results", project.results) +
        line("impact", project.impact) +
        (file.body ? `\n${file.body}\n` : "")
    );
  }

  return { text: sections.join("\n---\n\n"), projects };
});
