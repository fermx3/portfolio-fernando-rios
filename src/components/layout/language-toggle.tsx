"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  // This pathname is locale-agnostic (no /en or /es prefix), so switching is a
  // matter of re-pushing the same route under the other locale -- no string
  // surgery on the URL, and the user stays on the page they were reading.
  const pathname = usePathname();

  const nextLocale = locale === "en" ? "es" : "en";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      aria-label={t("toggle")}
      className="relative"
    >
      <Languages className="h-4 w-4" />
      <span className="absolute -bottom-1 -right-1 text-xs font-medium">
        {locale.toUpperCase()}
      </span>
    </Button>
  );
}
