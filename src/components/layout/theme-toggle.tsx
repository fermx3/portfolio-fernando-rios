"use client";

import { Contrast } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  // resolvedTheme, not theme: with the default "system" setting, theme is
  // "system" and the first click always went to light, even from a dark page.
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("theme");

  return (
    <Button
      variant="secondary"
      size="icon"
      className="bg-card hover:bg-card/70"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={t("toggle")}
    >
      <Contrast className="h-4 w-4" />
    </Button>
  );
}
