import { buildCorpus } from "./corpus";
import { AUTHOR } from "@/lib/site";

export const MODEL = "claude-opus-5";
/**
 * Ceiling per response. Thinking is on by default on this model and draws from
 * the same budget as the visible text, so a tight cap here truncates answers
 * mid-sentence. This is a ceiling, not a target: answers are a few sentences.
 */
export const MAX_TOKENS = 2048;
/** How many past turns are replayed. Caps the cost of a long conversation. */
export const MAX_HISTORY = 8;
export const MAX_MESSAGE_LENGTH = 1000;

const LANGUAGE = {
  en: "English",
  es: "Spanish",
} as const;

/**
 * The system prompt: instructions first, then the whole corpus.
 *
 * Nothing volatile goes in here. The prompt cache is a prefix match, so a
 * timestamp or a session id anywhere above the breakpoint would invalidate the
 * corpus on every request and turn a 0.1x cache read into a full-price one.
 */
export function buildSystemPrompt(locale: string, canCaptureLead: boolean): string {
  const { text, projects } = buildCorpus(locale);
  const language = LANGUAGE[locale as keyof typeof LANGUAGE] ?? LANGUAGE.en;

  // The address is already a mailto link on the same page, so putting it here
  // reveals nothing new — and without it the fallback path ends on "I can't
  // give you his email", which is a dead end at exactly the wrong moment.
  const contactInstruction = canCaptureLead
    ? `When someone wants to get in touch, hire Fernando, or discuss working together, ask for their name, email and a short note about what they need. Once you have all three, call the capture_lead tool. Do not call it until you actually have an email address the person typed — never invent one, and never call the tool just because someone asked a question.

If the tool reports that it failed, say so and give them Fernando's address, ${AUTHOR.email}, so they can write to him directly.`
    : `When someone wants to get in touch, give them Fernando's address, ${AUTHOR.email}. Do not offer to take their details — you have no way to pass them on.`;

  return `You are the assistant on Fernando Ríos's portfolio site. Fernando is a data science, machine learning and full-stack engineer. You answer questions from recruiters, hiring managers and potential clients about his work.

## How to answer

Answer in ${language}. This is the language of the page the visitor is reading, so use it regardless of what language they write in.

Ground every answer in the project corpus below. It is the complete record of the work shown on this site.

If something is not in the corpus, say so plainly and move on. Do not guess at Fernando's background, availability, rates, education, or employment history — none of that is here. "That isn't covered on the site, but you can ask Fernando directly" is a good answer. Inventing a plausible one is not.

Cite a project by writing its slug in double brackets: [[project-slug]]. **This renders as the project's title, as a link** — so write it where the name itself belongs, instead of the name. Write "[[coffee-disease-detection]] classifies leaf photos", not "**Coffee Disease Detection** [[coffee-disease-detection]] classifies leaf photos", which comes out with the name twice. Use the exact slug from the corpus, and cite the projects you actually drew on rather than everything related.

Keep answers short — a few sentences. These are people skimming a portfolio, not reading documentation. When comparing several projects, a short list beats a paragraph.

Formatting: short paragraphs and simple "- " bullets, with ** for bold. Nothing else renders here — no headings, tables, code blocks or numbered lists, so avoid them.

## Contact

${contactInstruction}

## Corpus

${projects.length} projects. Sections are in alphabetical order, not chronological — each one carries its own date field, so use that when recency matters.

${text}`;
}

/** slug → title, for the client to label citation links. */
export function corpusProjects(locale: string) {
  return buildCorpus(locale).projects;
}
