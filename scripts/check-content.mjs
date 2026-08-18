#!/usr/bin/env node
/**
 * Content checks that lint, typecheck and build all pass over.
 *
 * Written after sixteen declared gallery images turned out to be 404s in
 * production for months: the Zod schema validates that coverImage is a string,
 * never that the file exists.
 */
import fs from "node:fs";
import path from "node:path";

const CONTENT = "content/projects";
const CATEGORY_LABELS = {
  ml: "Machine Learning",
  "data-science": "Data Science",
  "full-stack": "Full-Stack",
  "web-development": "Web Development",
  "backend-development": "Backend Development",
  visualization: "Visualization",
};
const PUBLIC = "public";
const FEATURED_LIMIT = 6;

const problems = [];
const tagsByFile = new Map();

/** Minimal frontmatter reader: scalars and dash lists, line by line. */
function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const data = {};
  let key = null;
  for (const line of m[1].split("\n")) {
    const scalar = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    const item = line.match(/^\s+-\s*(.*)$/);
    if (scalar) {
      key = scalar[1];
      const value = scalar[2].trim();
      data[key] = value === "" ? [] : value.replace(/^"|"$/g, "");
    } else if (item && key && Array.isArray(data[key])) {
      data[key].push(item[1].trim().replace(/^"|"$/g, ""));
    }
  }
  return { data, body: m[2] };
}

function imagePaths(data) {
  const paths = [];
  if (typeof data.coverImage === "string") paths.push(data.coverImage);
  if (Array.isArray(data.images)) {
    for (const entry of data.images) {
      const src = String(entry).match(/src:\s*"?([^"]+)"?/);
      if (src) paths.push(src[1]);
      else if (String(entry).startsWith("/")) paths.push(String(entry));
    }
  }
  return paths;
}

const files = fs.readdirSync(CONTENT).filter((f) => f.endsWith(".mdx"));
const slugs = new Set(files.map((f) => f.replace(/\.es\.mdx$|\.mdx$/, "")));
const featured = { en: [], es: [] };

for (const file of files) {
  const parsed = parseFrontmatter(fs.readFileSync(path.join(CONTENT, file), "utf8"));
  if (!parsed) {
    problems.push(`${file}: no frontmatter`);
    continue;
  }
  const { data } = parsed;
  const slug = file.replace(/\.es\.mdx$|\.mdx$/, "");
  const locale = file.endsWith(".es.mdx") ? "es" : "en";

  // 1. every declared image resolves to a file
  for (const p of imagePaths(data)) {
    if (p.startsWith("/") && !fs.existsSync(path.join(PUBLIC, p))) {
      problems.push(`${file}: image not found -> ${p}`);
    }
  }

  // 2. images live under the slug's own folder
  for (const p of imagePaths(data)) {
    if (p.startsWith("/images/projects/") && !p.startsWith(`/images/projects/${slug}/`)) {
      problems.push(`${file}: image outside /images/projects/${slug}/ -> ${p}`);
    }
  }

  // 3. no empty optional URLs -- "" is falsy so it fails silently in the UI
  for (const key of ["liveUrl", "demoUrl", "repoUrl"]) {
    if (data[key] === "") problems.push(`${file}: ${key} is an empty string; omit the key instead`);
  }

  if (data.featured === "true" || data.featured === true) featured[locale].push(slug);

  // 6. tags: same count in both languages, so the translated arrays stay aligned
  const tags = Array.isArray(data.tags)
    ? data.tags
    : typeof data.tags === "string"
      ? JSON.parse(data.tags)
      : [];
  tagsByFile.set(file, tags);

  // 7. a tag must not repeat the project's own category -- the category has its
  //    own filter row, so the tag is a duplicate chip
  const label = CATEGORY_LABELS[data.category];
  if (label && tags.includes(label)) {
    problems.push(
      `${file}: tag "${label}" repeats the project's category; the category filter already covers it`
    );
  }
}

// 8. no versioned variant of a tag that also exists bare. "Next.js 16" next to
//    "Next.js" splits the filter and silently drops projects from the results.
const allTags = new Set([...tagsByFile.values()].flat());
for (const tag of allTags) {
  const bare = tag.replace(/\s+v?\d+(\.\d+)*$/, "");
  if (bare !== tag && allTags.has(bare)) {
    problems.push(
      `tag "${tag}" is a versioned variant of "${bare}"; use the bare name so the filter groups them`
    );
  }
}

// 9. tag arrays must line up between languages -- they are matched by position
for (const slug of slugs) {
  const en = tagsByFile.get(`${slug}.mdx`);
  const es = tagsByFile.get(`${slug}.es.mdx`);
  if (en && es && en.length !== es.length) {
    problems.push(
      `${slug}: ${en.length} tags in English but ${es.length} in Spanish; they are paired by position`
    );
  }
}

// 4. both languages exist for every project
for (const slug of slugs) {
  for (const suffix of [".mdx", ".es.mdx"]) {
    if (!fs.existsSync(path.join(CONTENT, slug + suffix))) {
      problems.push(`${slug}: missing ${suffix}`);
    }
  }
}

// 5. the home page only renders FEATURED_LIMIT projects
for (const [locale, list] of Object.entries(featured)) {
  if (list.length > FEATURED_LIMIT) {
    problems.push(
      `${locale}: ${list.length} featured projects but the home page shows ${FEATURED_LIMIT}; ` +
        `these would not render: ${list.slice(FEATURED_LIMIT).join(", ")}`
    );
  }
}

if (problems.length) {
  console.error(`\n${problems.length} content problem(s):\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error("");
  process.exit(1);
}

console.log(`content OK: ${files.length} files, all declared images resolve`);
