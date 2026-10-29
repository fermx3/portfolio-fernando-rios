"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AUTHOR } from "@/lib/site";
import type { CorpusProject } from "@/lib/assistant/corpus";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AskPortfolioProps {
  projects: CorpusProject[];
}

const MAX_LENGTH = 1000;
/** Matches the server's MAX_HISTORY: older turns are dropped before sending. */
const MAX_HISTORY = 8;

/** A citation, or a **bold** run. The prompt limits the model to this subset. */
const INLINE = /\[\[([a-z0-9-]+)\]\]|\*\*(.+?)\*\*/g;

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
function inline(text: string, titles: Map<string, string>): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(INLINE)) {
    const [raw, slug, bold] = match;
    const start = match.index ?? 0;
    if (start > cursor) parts.push(text.slice(cursor, start));
    cursor = start + raw.length;

    if (slug) {
      const title = titles.get(slug);
      if (title) {
        parts.push(
          <Link
            key={`${slug}-${start}`}
            href={`/projects/${slug}`}
            className="font-medium underline underline-offset-4 hover:no-underline"
          >
            {title}
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

/**
 * The model writes markdown, so rendering it as one flat string collapsed every
 * list into a wall of text with literal "-" and "**" in it. This handles the
 * subset the prompt asks for — paragraphs and simple bullets — and nothing else.
 */
function AssistantMessage({ text, projects }: { text: string; projects: CorpusProject[] }) {
  const titles = new Map(projects.map((p) => [p.slug, p.title]));
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

  return (
    <div className="space-y-2 leading-relaxed">
      {blocks.map((block, i) =>
        block.type === "ul" ? (
          <ul key={i} className="list-disc space-y-1 pl-4">
            {block.lines.map((item, j) => (
              <li key={j}>{inline(item, titles)}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{inline(block.lines[0], titles)}</p>
        )
      )}
    </div>
  );
}

export function AskPortfolio({ projects }: AskPortfolioProps) {
  const t = useTranslations("contact.assistant");
  const locale = useLocale();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function send(question: string) {
    const trimmed = question.trim();
    if (!trimmed || pending) return;

    const history = [...messages, { role: "user" as const, content: trimmed }];
    // The empty assistant turn goes in now, not once the response arrives: it
    // is what renders the "reading the projects…" line. A first token can be
    // several seconds away, and until this was hoisted the only feedback was
    // the input going disabled.
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setError(null);
    setPending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ locale, messages: history.slice(-MAX_HISTORY) }),
      });

      if (!response.ok || !response.body) {
        const code = await response
          .json()
          .then((data) => data?.error)
          .catch(() => null);
        // Drop the placeholder turn, or it sits there reading "thinking…"
        // forever under the error.
        setMessages(history);
        setError(
          code === "rate_limited"
            ? t("errors.rateLimited")
            : code === "unavailable"
              ? t("errors.unavailable")
              : t("errors.generic")
        );
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: answer }]);
      }

      // A stream that closes without a single character means the request died
      // after the headers went out; there is no status code left to read.
      if (!answer.trim()) {
        setMessages(history);
        setError(t("errors.generic"));
      }
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setMessages(history);
      setError(t("errors.generic"));
    } finally {
      setPending(false);
      abortRef.current = null;
    }
  }

  const suggestions = [t("suggestions.first"), t("suggestions.second"), t("suggestions.third")];

  // Rendered inside the home page's anchor module: every colour here is
  // relative to it (currentColor, anchor-foreground), never to the page.
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{t("title")}</p>
        {/* Next to the title, not in the intro: the intro is only rendered
            while the conversation is empty, so an indicator placed there would
            disappear exactly when someone starts using this. */}
        <Badge variant="ai">{t("aiLabel")}</Badge>
      </div>

      {/* The max height is what makes overflow-y-auto do anything. Without it
          the module grew with every turn, which pushed the input and the
          "reading…" line below the fold. */}
      <div
        ref={logRef}
        className="mt-5 max-h-96 flex-1 space-y-4 overflow-y-auto text-sm"
        aria-live="polite"
        aria-busy={pending}
      >
        {messages.length === 0 ? (
          <div>
            <h2 className="text-[2rem] leading-[1] font-bold tracking-[-0.025em] sm:text-h2">
              {t("heading")}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed opacity-75">{t("intro")}</p>
            <ul className="mt-6 space-y-2">
              {suggestions.map((suggestion) => (
                <li key={suggestion}>
                  <button
                    type="button"
                    onClick={() => send(suggestion)}
                    className="flex w-full items-center justify-between gap-3 rounded-row bg-anchor-foreground/10 px-4 py-2.5 text-left transition-colors hover:bg-anchor-foreground/20 focus-visible:outline-2 focus-visible:outline-lime"
                  >
                    {suggestion}
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          messages.map((message, index) =>
            message.role === "user" ? (
              <p
                key={index}
                className="ml-auto w-fit max-w-[85%] rounded-2xl bg-lime px-3.5 py-2 text-lime-foreground"
              >
                {message.content}
              </p>
            ) : (
              <div key={index} className="max-w-[95%]">
                {message.content ? (
                  <AssistantMessage text={message.content} projects={projects} />
                ) : (
                  <span className="inline-flex items-center gap-2 opacity-75">
                    <span className="flex gap-1" aria-hidden="true">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                    </span>
                    {t("thinking")}
                  </span>
                )}
              </div>
            )
          )
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-row bg-anchor-foreground/10 p-3 text-sm">
          <p>{error}</p>
          <a
            href={`mailto:${AUTHOR.email}`}
            className="mt-2 inline-flex items-center gap-2 font-medium underline underline-offset-4"
          >
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            {t("errors.emailInstead")}
          </a>
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
        className="mt-5 flex items-center gap-2 rounded-full bg-background p-1.5 pl-5 text-foreground focus-within:ring-2 focus-within:ring-lime"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          maxLength={MAX_LENGTH}
          disabled={pending}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
        />
        <Button type="submit" variant="lime" size="sm" disabled={pending || !input.trim()}>
          {t("send")}
        </Button>
      </form>

      <p className="mt-3 text-xs opacity-60">{t("disclaimer")}</p>
    </div>
  );
}
