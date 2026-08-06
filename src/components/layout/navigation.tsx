"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { key: "home", href: "#hero" },
  { key: "projects", href: "#projects" },
  { key: "about", href: "#about" },
  { key: "contact", href: "#contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("navigation");

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold" onClick={() => setIsOpen(false)}>
            Fernando Rios
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex md:items-center md:gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
          <div className="space-y-2 pb-4">
            {navigation.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="block py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
}
