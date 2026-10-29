"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAssistant } from "./assistant-provider";

const MAX_LENGTH = 1000;

/**
 * The home page's way into the assistant. Asking opens the panel, where the
 * conversation happens; this module only starts it, or brings it back.
 *
 * Rendered inside the anchor module: every colour here is relative to it
 * (currentColor, anchor-foreground), never to the page.
 */
export function AskPortfolio() {
  const t = useTranslations("contact.assistant");
  const { messages, pending, ask, setOpen } = useAssistant();
  const [input, setInput] = useState("");

  const suggestions = [t("suggestions.first"), t("suggestions.second"), t("suggestions.third")];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{t("title")}</p>
        <Badge variant="ai">{t("aiLabel")}</Badge>
      </div>

      <h2 className="mt-5 text-[2rem] leading-[1] font-bold tracking-[-0.025em] sm:text-h2">
        {t("heading")}
      </h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed opacity-75">{t("intro")}</p>

      <ul className="mt-6 space-y-2">
        {messages.length > 0 ? (
          <li>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex w-full items-center justify-between gap-3 rounded-row bg-lime px-4 py-2.5 text-left text-sm font-medium text-lime-foreground press hover:bg-lime/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-anchor-foreground"
            >
              {t("resume")}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </button>
          </li>
        ) : (
          suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => ask(suggestion)}
                className="flex w-full items-center justify-between gap-3 rounded-row bg-anchor-foreground/10 px-4 py-2.5 text-left text-sm press hover:bg-anchor-foreground/20 focus-visible:outline-2 focus-visible:outline-anchor-foreground"
              >
                {suggestion}
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>
            </li>
          ))
        )}
      </ul>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          ask(input);
          setInput("");
        }}
        className="mt-6 flex items-center gap-2 rounded-full bg-background p-1.5 pl-5 text-foreground focus-within:ring-2 focus-within:ring-anchor-foreground focus-within:ring-offset-2 focus-within:ring-offset-anchor lg:mt-auto"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          maxLength={MAX_LENGTH}
          disabled={pending}
          className="min-w-0 flex-1 bg-transparent text-base outline-none sm:text-sm placeholder:text-muted-foreground disabled:opacity-50"
        />
        <Button type="submit" variant="lime" size="sm" disabled={pending || !input.trim()}>
          {t("send")}
        </Button>
      </form>

      <p className="mt-3 text-xs opacity-60">{t("disclaimer")}</p>
    </div>
  );
}
