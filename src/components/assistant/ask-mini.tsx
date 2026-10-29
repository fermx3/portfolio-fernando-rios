"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Module } from "@/components/ui/module";
import { useAssistant } from "./assistant-provider";

interface AskMiniProps {
  title: string;
  /** Shown as the placeholder, and asked as-is if the visitor sends it empty. */
  example: string;
  className?: string;
}

/**
 * A small way into the assistant for pages other than home: the listing and a
 * project's detail. It opens the same panel, and so the same conversation.
 */
export function AskMini({ title, example, className }: AskMiniProps) {
  const t = useTranslations("contact.assistant");
  const { ask, pending } = useAssistant();
  const [input, setInput] = useState("");

  return (
    <Module as="aside" tone="anchor" className={className} aria-label={t("title")}>
      <Badge variant="ai">{t("aiLabel")}</Badge>
      <p className="mt-3 text-lg leading-tight font-bold">{title}</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          ask(input.trim() || example);
          setInput("");
        }}
        className="mt-4 flex items-center gap-2 rounded-full bg-background p-1 pl-4 text-foreground focus-within:ring-2 focus-within:ring-lime"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={example}
          aria-label={t("placeholder")}
          maxLength={1000}
          disabled={pending}
          className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label={t("send")}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lime text-lime-foreground transition-colors hover:bg-lime/85 disabled:opacity-50"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </Module>
  );
}
