import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Module } from "@/components/ui/module";

interface AllProjectsLinkProps {
  projects: number;
  categories: number;
  id?: string;
}

export function AllProjectsLink({ projects, categories, id }: AllProjectsLinkProps) {
  const t = useTranslations("projects");

  return (
    <Module
      tone="lilac"
      reveal
      id={id}
      className="group relative flex min-h-44 scroll-mt-20 flex-col justify-between gap-8 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring"
    >
      <p className="font-mono text-xs">{t("allCount", { projects, categories })}</p>
      <Link
        href="/projects"
        className="text-h3 font-bold after:absolute after:inset-0 after:rounded-module focus-visible:outline-none sm:text-[2rem] sm:leading-[1]"
      >
        {t("viewMore")}{" "}
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
        >
          →
        </span>
      </Link>
    </Module>
  );
}
