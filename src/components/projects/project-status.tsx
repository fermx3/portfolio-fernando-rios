import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectStatusProps {
  status: Project["status"];
  /** "chip" sits on its own; "text" runs inline with other metadata. */
  variant?: "chip" | "text";
  className?: string;
}

/**
 * Lime marks a project that is live, and its dot breathes; lilac marks one
 * still being built (lilac is "process" in the Bento system). Completed and
 * archived are plain metadata, so they stay grey: each colour has to keep one
 * meaning.
 */
export function ProjectStatus({ status, variant = "text", className }: ProjectStatusProps) {
  const t = useTranslations("projects.status");

  const live = status === "production";
  const building = status === "development";

  if (variant === "chip" && (live || building)) {
    return (
      <Badge variant={live ? "status" : "process"} className={className}>
        <span aria-hidden="true" className={live ? "live-dot" : undefined}>
          {live ? "●" : "◐"}
        </span>
        {t(status)}
      </Badge>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-xs",
        live ? "text-lime-ink" : "text-muted-foreground",
        className
      )}
    >
      <span aria-hidden="true" className={live ? "live-dot" : undefined}>
        {live ? "●" : building ? "◐" : "○"}
      </span>
      {t(status)}
    </span>
  );
}
