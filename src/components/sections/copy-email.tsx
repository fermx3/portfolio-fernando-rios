"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";
import { AUTHOR } from "@/lib/site";

/** For visitors without a mail client: copies the address, says so for 2s. */
export function CopyEmail() {
  const t = useTranslations("contact.direct");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(AUTHOR.email);
          setCopied(true);
        } catch {
          // Clipboard blocked (permissions, insecure context): the mailto
          // link right above still works, so fail quietly.
        }
      }}
      className="press inline-flex items-center gap-1.5 rounded-full border border-anchor-foreground/40 px-3 py-1 text-xs font-medium hover:bg-anchor-foreground/10"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {/* Announced when it changes, so a screen reader hears "Copied". */}
      <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
    </button>
  );
}
