"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUp, Mail, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
            className="font-medium text-primary underline underline-offset-4 hover:no-underline"
          >
            {title}
          </Link>
        );
      }
      continue;
    }

    parts.push(
      <strong key={`b-${start}`} className="font-medium text-foreground">
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
          <ul key={i} className="list-disc space-y-1 pl-4 marker:text-lime-400">
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

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-lime-400" aria-hidden="true" />
          {t("title")}
          {/* Sits in the title, not the intro: the intro is only rendered
              while the conversation is empty, so an indicator placed there
              would disappear exactly when someone starts using this. */}
          <Badge variant="secondary" className="ml-1 font-normal">
            {t("aiLabel")}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        {/* The max height is what makes overflow-y-auto do anything. Without
            it the card grew with every turn, which pushed the input and the
            "reading…" line below the fold — so the indicator was there but
            nobody could see it. */}
        <div
          ref={logRef}
          className="min-h-56 max-h-96 flex-1 space-y-4 overflow-y-auto text-sm"
          aria-live="polite"
          aria-busy={pending}
        >
          {messages.length === 0 ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">{t("intro")}</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-lime-400 hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) =>
              message.role === "user" ? (
                <p key={index} className="ml-auto w-fit max-w-[85%] rounded-lg bg-muted px-3 py-2">
                  {message.content}
                </p>
              ) : (
                <div key={index} className="max-w-[95%] text-muted-foreground">
                  {message.content ? (
                    <AssistantMessage text={message.content} projects={projects} />
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <span className="flex gap-1" aria-hidden="true">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lime-400 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lime-400 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lime-400" />
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
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="text-muted-foreground">{error}</p>
            <a
              href={`mailto:${AUTHOR.email}`}
              className="mt-2 inline-flex items-center gap-2 font-medium text-primary underline underline-offset-4"
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
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t("placeholder")}
            aria-label={t("placeholder")}
            maxLength={MAX_LENGTH}
            disabled={pending}
          />
          <Button type="submit" size="icon" disabled={pending || !input.trim()}>
            <ArrowUp className="h-4 w-4" />
            <span className="sr-only">{t("send")}</span>
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">{t("disclaimer")}</p>
      </CardContent>
    </Card>
  );
}
