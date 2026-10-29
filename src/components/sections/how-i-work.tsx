import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Module } from "@/components/ui/module";
import type { Project } from "@/types/project";

interface Step {
  name: string;
  detail: string;
}

/** The pipeline, told through one real project: the home page's lead. */
export function HowIWork({ project }: { project: Pick<Project, "slug" | "title"> }) {
  const t = useTranslations("howIWork");
  const steps = t.raw("steps") as Step[];

  return (
    <Module as="section" span={2} tone="lilac" reveal aria-labelledby="how-i-work">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="how-i-work" className="font-mono text-xs">
          {t("title")}
        </h2>
        <Link
          href={`/projects/${project.slug}`}
          className="font-mono text-xs underline-offset-4 hover:underline"
        >
          {t("example", { project: project.title })}
        </Link>
      </div>

      {/* The ink highlight runs down the steps on a loop, so the pipeline
          reads as a flow; hovering stops it and it follows the pointer.
          Motion and the reduced-motion fallback live in .flow-steps. */}
      <ol className="flow-steps mt-4 space-y-1.5">
        {steps.map((step, i) => (
          <li
            key={step.name}
            style={{ "--step": i } as React.CSSProperties}
            className="grid grid-cols-[2rem_1fr] items-baseline gap-x-3 gap-y-0.5 rounded-row px-4 py-2 text-sm sm:grid-cols-[2rem_7rem_1fr]"
          >
            <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-semibold">{step.name}</span>
            <span className="col-start-2 sm:col-start-3">{step.detail}</span>
          </li>
        ))}
      </ol>
    </Module>
  );
}
