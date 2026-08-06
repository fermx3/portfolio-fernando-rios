"use client";

import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const t = useTranslations("language");
  const router = useRouter();
  const pathname = usePathname();

  // Derive current locale directly from pathname
  const getCurrentLocale = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    return pathSegments[0] === "es" || pathSegments[0] === "en" ? pathSegments[0] : "en";
  };

  const currentLocale = getCurrentLocale();

  const handleLanguageChange = () => {
    const newLocale = currentLocale === "en" ? "es" : "en";

    // Replace the locale in the path
    let newPath;
    if (pathname.startsWith(`/${currentLocale}`)) {
      newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    } else {
      newPath = `/${newLocale}`;
    }

    router.push(newPath);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLanguageChange}
      aria-label={t("toggle")}
      className="relative"
    >
      <Languages className="h-4 w-4" />
      <span className="absolute -bottom-1 -right-1 text-xs font-medium">
        {currentLocale.toUpperCase()}
      </span>
    </Button>
  );
}
