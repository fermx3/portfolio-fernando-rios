"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AUTHOR } from "@/lib/site";
import { useAssistant } from "./assistant-provider";
import { AssistantMessage } from "./assistant-message";

const MAX_LENGTH = 1000;

/**
 * The open conversation. A native modal <dialog>: focus is trapped, Escape
 * closes it and the page behind is inert, without any of that in our code.
 * Side panel from sm up, full screen below.
 */
export function AssistantPanel() {
  const t = useTranslations("contact.assistant");
  const { projects, messages, pending, error, open, setOpen, ask } = useAssistant();
  const [input, setInput] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();

    // A modal dialog does not stop the page behind it from scrolling.
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, error]);

  const close = () => setOpen(false);

  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.content));
  const followUps = [
    t("suggestions.first"),
    t("suggestions.second"),
    t("suggestions.third"),
    t("suggestions.talk"),
  ].filter((s) => !asked.has(s));

  const errorLabel =
    error === "rate_limited"
      ? t("states.limit")
      : error === "unavailable"
        ? t("states.offline")
        : t("states.error");
  const errorText =
    error === "rate_limited"
      ? t("errors.rateLimited")
      : error === "unavailable"
        ? t("errors.unavailable")
        : t("errors.generic");

  return (
    <dialog
      ref={dialogRef}
      // Escape and the backdrop both end up here, so the state follows.
      onClose={close}
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
      aria-labelledby="assistant-title"
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none flex-col bg-panel text-panel-foreground backdrop:bg-black/40 open:flex sm:inset-y-3 sm:right-3 sm:left-auto sm:h-[calc(100dvh-1.5rem)] sm:w-[34rem] sm:rounded-module"
    >
      <header className="flex items-center gap-3 border-b border-panel-foreground/10 px-5 py-4">
        <h2 id="assistant-title" className="text-sm font-medium">
          {t("title")}
        </h2>
        <Badge variant="ai">{t("aiLabel")}</Badge>
        <button
          type="button"
          onClick={close}
          aria-label={t("close")}
          className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-panel-foreground/10 transition-colors hover:bg-panel-foreground/20 focus-visible:outline-2 focus-visible:outline-lime"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div
        ref={logRef}
        className="flex-1 space-y-5 overflow-y-auto px-5 py-5 text-sm"
        aria-live="polite"
        aria-busy={pending}
      >
        {/* Opened straight from the menu, there is no question yet: say what
            this is instead of showing an empty panel. */}
        {messages.length === 0 && !error && (
          <p className="max-w-sm leading-relaxed opacity-75">{t("intro")}</p>
        )}
        {messages.map((message, index) =>
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
                <AssistantMessage
                  text={message.content}
                  projects={projects}
                  onNavigate={close}
                  complete={!(pending && index === messages.length - 1)}
                />
              ) : (
                <span className="inline-flex items-center gap-2 opacity-80">
                  <span className="flex gap-1" aria-hidden="true">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lime [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lime [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lime" />
                  </span>
                  {t("thinking")}
                </span>
              )}
            </div>
          )
        )}

        {error && (
          <div className="flex gap-4 rounded-row bg-panel-foreground/10 px-4 py-3">
            <span className="shrink-0 pt-0.5 font-mono text-xs opacity-80">{errorLabel}</span>
            <p>
              {errorText}{" "}
              <a
                href={`mailto:${AUTHOR.email}`}
                className="font-medium underline underline-offset-4"
              >
                {t("errors.emailInstead")}
              </a>
            </p>
          </div>
        )}
      </div>

      <footer className="border-t border-panel-foreground/10 px-5 pt-4 pb-4">
        {!pending && followUps.length > 0 && (
          <ul className="mb-3 flex flex-wrap gap-2">
            {followUps.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onClick={() => ask(suggestion)}
                  className="rounded-full border border-panel-foreground/25 px-3 py-1.5 text-xs transition-colors hover:bg-panel-foreground/10 focus-visible:outline-2 focus-visible:outline-lime"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={(event) => {
            event.preventDefault();
            ask(input);
            setInput("");
          }}
          className="flex items-center gap-2 rounded-full bg-background p-1.5 pl-5 text-foreground focus-within:ring-2 focus-within:ring-lime"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t("placeholder")}
            aria-label={t("placeholder")}
            maxLength={MAX_LENGTH}
            disabled={pending}
            autoFocus
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
          />
          <Button type="submit" variant="lime" size="sm" disabled={pending || !input.trim()}>
            <span className="max-sm:sr-only">{t("send")}</span>
            <ArrowRight className="h-4 w-4 sm:hidden" aria-hidden="true" />
          </Button>
        </form>

        <p className="mt-3 text-xs opacity-60">{t("disclaimer")}</p>
      </footer>
    </dialog>
  );
}
