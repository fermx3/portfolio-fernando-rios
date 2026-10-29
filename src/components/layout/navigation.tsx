"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { MobileMenu } from "./mobile-menu";
import { cn } from "@/lib/utils";

// Anchored to "/" rather than bare hashes: the sections only exist on the home
// page, so from /projects or a project detail a bare "#about" pointed nowhere.
const navigation = [
  { key: "home", href: "/" },
  { key: "projects", href: "/#projects" },
  { key: "about", href: "/#about" },
  { key: "contact", href: "/#contact" },
];

/** Which item to mark: the page the visitor is on, not the section in view. */
function activeKey(pathname: string): string | null {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/projects")) return "projects";
  return null;
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("navigation");
  const active = activeKey(usePathname());

  return (
    // Solid, not translucent: over the anchor module (ink in light, cream in
    // dark) a see-through bar took on its colour and the logo, the language
    // switch and the theme button lost their contrast.
    <nav className="sticky top-0 z-50 bg-background">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
            onClick={() => setIsOpen(false)}
          >
            fr.
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 rounded-full bg-card p-1 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active === item.key ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium press",
                  active === item.key
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          {/* Desktop Controls */}
          <div className="hidden items-center gap-3 md:flex">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="rounded-full bg-card px-4 py-1.5 text-sm font-medium md:hidden"
            onClick={() => setIsOpen(true)}
            aria-haspopup="dialog"
            aria-label={t("toggleMenu")}
          >
            {t("menu")}
          </button>
        </div>
      </Container>
      <MobileMenu open={isOpen} onClose={() => setIsOpen(false)} active={active} />
    </nav>
  );
}
