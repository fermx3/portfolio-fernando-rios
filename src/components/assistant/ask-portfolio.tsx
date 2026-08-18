"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUp, Mail, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
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

const CITATION = /\[\[([a-z0-9-]+)\]\]/g;

/**
 * Renders assistant text.
 *
 * The text is model output, so it is rendered as text — never through
 * dangerouslySetInnerHTML, which is how the project pages render Fernando's own
 * markdown but would be an XSS hole here. The only markup is the citation
 * links, and a citation is only linked when its slug is a real project; a
 * hallucinated slug is dropped rather than turned into a 404.
 */
function AssistantText({ text, projects }: { text: string; projects: CorpusProject[] }) {
  const known = new Map(projects.map((p) => [p.slug, p.title]));
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(CITATION)) {
    const [raw, slug] = match;
    const start = match.index ?? 0;
    if (start > lastIndex) parts.push(text.slice(lastIndex, start));
    lastIndex = start + raw.length;

    const title = known.get(slug);
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
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </>
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
    setMessages(history);
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

      setMessages([...history, { role: "assistant", content: "" }]);

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
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div
          ref={logRef}
          className="min-h-56 flex-1 space-y-4 overflow-y-auto text-sm"
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
                <p key={index} className="max-w-[95%] leading-relaxed text-muted-foreground">
                  {message.content ? (
                    <AssistantText text={message.content} projects={projects} />
                  ) : (
                    <span className="inline-block animate-pulse">{t("thinking")}</span>
                  )}
                </p>
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
