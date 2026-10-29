"use client";

import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Spanish first, as in the design ("ES · EN").
const LOCALES = ["es", "en"] as const;

export function LanguageToggle() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  // This pathname is locale-agnostic (no /en or /es prefix), so switching is a
  // matter of re-pushing the same route under the other locale -- no string
  // surgery on the URL, and the user stays on the page they were reading.
  const pathname = usePathname();

  // Both locales stay visible ("ES · EN"); the current one is bold.
  return (
    <div role="group" aria-label={t("toggle")} className="flex items-center gap-1.5 text-xs">
      {LOCALES.map((code, i) => (
        <Fragment key={code}>
          {i > 0 && (
            <span aria-hidden="true" className="text-muted-foreground">
              ·
            </span>
          )}
          <button
            type="button"
            lang={code}
            aria-pressed={code === locale}
            onClick={() => {
              if (code !== locale) router.replace(pathname, { locale: code });
            }}
            className={cn(
              "rounded-full px-1 py-0.5 font-medium transition-colors",
              code === locale
                ? "font-bold text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {code.toUpperCase()}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
