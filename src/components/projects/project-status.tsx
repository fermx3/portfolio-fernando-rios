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
 * Lime marks a project that is live. Anything else is plain metadata, so it
 * stays grey: the colour has to keep meaning "in production".
 */
export function ProjectStatus({ status, variant = "text", className }: ProjectStatusProps) {
  const t = useTranslations("projects.status");
  if (!status) return null;

  const live = status === "production";

  if (variant === "chip" && live) {
    return (
      <Badge variant="status" className={className}>
        <span aria-hidden="true">●</span>
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
      <span aria-hidden="true">{live ? "●" : "○"}</span>
      {t(status)}
    </span>
  );
}
