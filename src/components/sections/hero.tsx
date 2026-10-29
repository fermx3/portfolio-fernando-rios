import { useTranslations } from "next-intl";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Module, ModuleLabel } from "@/components/ui/module";
import { HashLink } from "@/components/layout/hash-link";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <Module as="section" span={2} id="hero" className="flex flex-col sm:p-9">
      <ModuleLabel>{t("kicker")}</ModuleLabel>

      {/* The h1 is the LCP element and is deliberately not animated. Any
          opacity-0 entrance -- JS or CSS -- delays when it actually paints,
          and Chrome drops such elements as LCP candidates, which flatters
          the metric without helping the user. */}
      <h1 className="mt-10 sm:mt-14">
        {/* One word per line: "Fer / Rios" at display size. The trailing
            spaces keep the accessible name "Fer Rios", not "FerRios". */}
        {t("name")
          .split(" ")
          .map((word) => (
            <span
              key={word}
              className="block text-[5rem] leading-[0.86] font-bold tracking-[-0.045em] sm:text-[6.5rem] lg:text-display"
            >
              {word}{" "}
            </span>
          ))}
        <span className="mt-6 block text-h3 font-bold sm:text-[1.625rem]">{t("role")}</span>
      </h1>

      <p className="mt-3 max-w-md text-body text-muted-foreground">{t("description")}</p>

      {/* HashLink, not a plain <a>: a link to the hash already in the URL
          would not scroll on a second click. */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <HashLink href="/#projects">
            {t("cta.primary")}
            <ArrowDown className="h-4 w-4" />
          </HashLink>
        </Button>
        <Button asChild variant="outline">
          <HashLink href="/#contact">{t("cta.secondary")}</HashLink>
        </Button>
      </div>
    </Module>
  );
}
