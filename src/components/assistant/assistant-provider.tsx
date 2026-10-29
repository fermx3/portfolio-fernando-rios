"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import type { CorpusProject } from "@/lib/assistant/corpus";
import { AssistantPanel } from "./assistant-panel";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export type AssistantError = "rate_limited" | "unavailable" | "generic";

interface AssistantContextValue {
  projects: CorpusProject[];
  messages: Message[];
  pending: boolean;
  error: AssistantError | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Opens the panel and asks. */
  ask: (question: string) => void;
}

const AssistantContext = createContext<AssistantContextValue | null>(null);

export function useAssistant() {
  const value = useContext(AssistantContext);
  if (!value) throw new Error("useAssistant must be used inside AssistantProvider");
  return value;
}

/** Matches the server's MAX_HISTORY: older turns are dropped before sending. */
const MAX_HISTORY = 8;

/**
 * Holds the conversation for the whole locale layout, so it survives a click
 * on a citation and the trip back. It lives in memory only: visitors may type
 * their name and email here, and none of it should outlast the tab.
 */
export function AssistantProvider({
  projects,
  children,
}: {
  /** Read on the server from the repo's content: citations are checked
      against it before they become links or cards. */
  projects: CorpusProject[];
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<AssistantError | null>(null);
  const [open, setOpen] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  // send() reads the latest history through a ref, so ask() can stay stable
  // and the callers do not re-render on every streamed token.
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const pendingRef = useRef(pending);
  pendingRef.current = pending;

  useEffect(() => () => abortRef.current?.abort(), []);

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      setOpen(true);
      if (!trimmed || pendingRef.current) return;

      const history = [...messagesRef.current, { role: "user" as const, content: trimmed }];
      // The empty assistant turn goes in now, not once the response arrives: it
      // is what renders the "reading the projects…" line. A first token can be
      // several seconds away.
      setMessages([...history, { role: "assistant", content: "" }]);
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
          setError(code === "rate_limited" || code === "unavailable" ? code : "generic");
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

        // A stream that closes without a single character means the request
        // died after the headers went out; there is no status code left to read.
        if (!answer.trim()) {
          setMessages(history);
          setError("generic");
        }
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setMessages(history);
        setError("generic");
      } finally {
        setPending(false);
        abortRef.current = null;
      }
    },
    [locale]
  );

  return (
    <AssistantContext.Provider value={{ projects, messages, pending, error, open, setOpen, ask }}>
      {children}
      <AssistantPanel />
    </AssistantContext.Provider>
  );
}
