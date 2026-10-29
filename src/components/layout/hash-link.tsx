"use client";

import type { ComponentProps, MouseEvent } from "react";
import { Link } from "@/i18n/navigation";

type HashLinkProps = ComponentProps<typeof Link> & { href: `/#${string}` };

/**
 * A link to a section of the home page ("/#about") that always scrolls.
 *
 * Next skips the scroll when the URL would not change, so a second click on
 * "Projects" with #projects already in the address bar did nothing. When the
 * section is on the current page this scrolls to it directly (honouring the
 * global scroll-padding-top); from any other page it is a normal Link.
 */
export function HashLink({ href, onClick, ...props }: HashLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const id = href.slice(2);
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    history.replaceState(history.state, "", `#${id}`);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
