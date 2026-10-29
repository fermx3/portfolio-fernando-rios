import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The Bento grid: 4 columns at desktop, 2 below. Every section of a page is a
 * Module inside one of these; nothing stacks outside a module.
 */
function Bento({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid grid-cols-2 gap-3 lg:grid-cols-4", className)} {...props} />;
}

// Below lg a module takes the full width, except `compact` ones, which pair up
// two to a row: the short project cards on the home page.
const moduleVariants = cva("min-w-0 rounded-module p-6 sm:p-7", {
  variants: {
    tone: {
      paper: "bg-card text-card-foreground",
      // One per view: the assistant or the impact statement.
      anchor: "bg-anchor text-anchor-foreground",
      lime: "bg-lime text-lime-foreground",
      lilac: "bg-lilac text-lilac-foreground",
    },
    span: {
      1: "col-span-2 lg:col-span-1",
      2: "col-span-2",
      3: "col-span-2 lg:col-span-3",
      4: "col-span-2 lg:col-span-4",
    },
    compact: {
      true: "col-span-1",
    },
    // Rises into place as it scrolls in (see .reveal). Not for the first row.
    reveal: {
      true: "reveal",
    },
    // Screenshots bleed to the module edge, so the padding moves inside.
    bleed: {
      true: "overflow-hidden p-0 sm:p-0",
    },
  },
  defaultVariants: {
    tone: "paper",
    span: 1,
  },
});

export interface ModuleProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof moduleVariants> {
  as?: "div" | "section" | "article" | "aside";
}

function Module({
  as: Comp = "div",
  className,
  tone,
  span,
  compact,
  bleed,
  reveal,
  ...props
}: ModuleProps) {
  return (
    <Comp
      className={cn(moduleVariants({ tone, span, compact, bleed, reveal }), className)}
      {...props}
    />
  );
}

/** The mono label that opens most modules: "01 · Principios", "Cómo trabajo". */
function ModuleLabel({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("font-mono text-xs opacity-75", className)} {...props} />;
}

export { Bento, Module, ModuleLabel, moduleVariants };
