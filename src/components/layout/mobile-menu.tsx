"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { ArrowRight, X } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { useAssistant } from "@/components/assistant/assistant-provider";
import { AUTHOR, CV_PATH } from "@/lib/site";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  /** Which entry is the current page: "home", "projects" or none. */
  active: string | null;
}

// Spanish first, as in the design; both are always shown.
const LOCALES = ["es", "en"] as const;

/**
 * The phone menu (M5): full screen, each destination its own module.
 * A native modal <dialog>, like the assistant panel, so focus is trapped and
 * Escape closes it.
 */
export function MobileMenu({ open, onClose, active }: MobileMenuProps) {
  const t = useTranslations("navigation");
  const tAssistant = useTranslations("contact.assistant");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { projects, setOpen: setAssistantOpen } = useAssistant();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const entries = [
    {
      key: "home",
      href: "/",
      label: t("home"),
      meta: active === "home" ? t("youAreHere") : null,
      tone: "bg-card text-card-foreground",
    },
    {
      key: "projects",
      href: "/projects",
      label: t("projects"),
      meta: active === "projects" ? t("youAreHere") : t("projectCount", { count: projects.length }),
      tone: "bg-card text-card-foreground",
    },
  ];

  const segment = (selected: boolean) =>
    cn(
      "flex-1 rounded-full py-2 text-sm font-medium transition-colors",
      selected ? "bg-primary text-primary-foreground" : "hover:bg-background/60"
    );

  const external = [
    { label: "GitHub", href: AUTHOR.github },
    { label: "LinkedIn", href: AUTHOR.linkedin },
  ];

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label={t("toggleMenu")}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none flex-col gap-3 overflow-y-auto bg-background p-4 text-foreground open:flex"
    >
      <div className="flex items-center justify-between px-2 py-1">
        <Link href="/" onClick={onClose} className="text-xl font-bold tracking-tight">
          fr.
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground"
        >
          {t("close")}
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label={t("toggleMenu")}>
        <ol className="space-y-3">
          {entries.map((entry, i) => (
            <li key={entry.key}>
              <Link
                href={entry.href}
                onClick={onClose}
                aria-current={active === entry.key ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between rounded-module px-6 py-4",
                  entry.tone
                )}
              >
                <span>
                  <span className="font-mono text-xs opacity-75">
                    {String(i + 1).padStart(2, "0")}
                    {entry.meta && ` · ${entry.meta}`}
                  </span>
                  <span className="block text-[2.5rem] leading-tight font-bold tracking-[-0.035em]">
                    {entry.label}
                  </span>
                </span>
                {active === entry.key ? (
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full bg-foreground dark:bg-lime"
                  />
                ) : (
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                )}
              </Link>
            </li>
          ))}

          <li>
            {/* Not a page: opens the assistant over whatever page this is. */}
            <button
              type="button"
              onClick={() => {
                onClose();
                setAssistantOpen(true);
              }}
              className="flex w-full items-center justify-between rounded-module bg-anchor px-6 py-4 text-left text-anchor-foreground"
            >
              <span>
                <span className="flex items-center gap-2 font-mono text-xs opacity-75">
                  03 <Badge variant="ai">{tAssistant("aiLabel")}</Badge>
                </span>
                <span className="block text-[2.5rem] leading-tight font-bold tracking-[-0.035em]">
                  {t("assistant")}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="grid h-11 w-11 place-items-center rounded-full bg-lime text-lime-foreground"
              >
                <ArrowRight className="h-5 w-5" />
              </span>
            </button>
          </li>

          <li>
            <Link
              href="/#contact"
              onClick={onClose}
              className="flex items-center justify-between rounded-module bg-lilac px-6 py-4 text-lilac-foreground"
            >
              <span>
                <span className="font-mono text-xs opacity-75">04</span>
                <span className="block text-[2.5rem] leading-tight font-bold tracking-[-0.035em]">
                  {t("contact")}
                </span>
              </span>
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </li>
        </ol>
      </nav>

      <div className="mt-auto space-y-3 pt-6">
        <div className={cn("grid gap-3", CV_PATH ? "grid-cols-3" : "grid-cols-2")}>
          {external.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-row bg-card py-3 text-center text-sm font-medium"
            >
              {link.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
          {/* Hidden until there is a CV to download: see CV_PATH. */}
          {CV_PATH && (
            <a
              href={CV_PATH}
              download
              className="rounded-row bg-card py-3 text-center text-sm font-medium"
            >
              {t("cv")} <span aria-hidden="true">↓</span>
            </a>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-module bg-card p-4">
          <div role="group" aria-label={t("theme")}>
            <p className="mb-2 font-mono text-xs text-muted-foreground">{t("theme")}</p>
            <div className="flex rounded-full bg-secondary p-1">
              {(["light", "dark"] as const).map((theme) => (
                <button
                  key={theme}
                  type="button"
                  aria-pressed={resolvedTheme === theme}
                  onClick={() => setTheme(theme)}
                  className={segment(resolvedTheme === theme)}
                >
                  {t(theme)}
                </button>
              ))}
            </div>
          </div>

          <div role="group" aria-label={t("language")}>
            <p className="mb-2 font-mono text-xs text-muted-foreground">{t("language")}</p>
            <div className="flex rounded-full bg-secondary p-1">
              {LOCALES.map((code) => (
                <button
                  key={code}
                  type="button"
                  lang={code}
                  aria-pressed={locale === code}
                  onClick={() => {
                    if (code !== locale) router.replace(pathname, { locale: code });
                  }}
                  className={segment(locale === code)}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}
