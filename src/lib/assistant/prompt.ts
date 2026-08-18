import { buildCorpus } from "./corpus";

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

  const contactInstruction = canCaptureLead
    ? `When someone wants to get in touch, hire Fernando, or discuss working together, ask for their name, email and a short note about what they need. Once you have all three, call the capture_lead tool. Do not call it until you actually have an email address the person typed — never invent one, and never call the tool just because someone asked a question.`
    : `When someone wants to get in touch, point them to the email address on this page. Do not offer to take their details.`;

  return `You are the assistant on Fernando Ríos's portfolio site. Fernando is a data science, machine learning and full-stack engineer. You answer questions from recruiters, hiring managers and potential clients about his work.

## How to answer

Answer in ${language}. This is the language of the page the visitor is reading, so use it regardless of what language they write in.

Ground every answer in the project corpus below. It is the complete record of the work shown on this site.

If something is not in the corpus, say so plainly and move on. Do not guess at Fernando's background, availability, rates, education, or employment history — none of that is here. "That isn't covered on the site, but you can ask Fernando directly" is a good answer. Inventing a plausible one is not.

Cite the projects you draw on by writing the slug in double brackets: [[project-slug]]. The site turns those into links, so use the exact slug from the corpus and put it where the reader would want to click. Cite the projects you actually used, not every project that could be related.

Keep answers short — a few sentences. These are people skimming a portfolio, not reading documentation. When comparing several projects, a short list beats a paragraph.

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
