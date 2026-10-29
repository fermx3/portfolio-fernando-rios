import { useTranslations } from "next-intl";
import { Module } from "@/components/ui/module";
import { AUTHOR } from "@/lib/site";
import { CopyEmail } from "./copy-email";

const [mailbox, domain] = AUTHOR.email.split("@");

export function Contact() {
  const t = useTranslations("contact.direct");

  return (
    <Module
      as="section"
      tone="anchor"
      reveal
      id="contact"
      aria-labelledby="contact-title"
      className="flex flex-col"
    >
      <h2 id="contact-title" className="font-mono text-xs opacity-75">
        {t("title")}
      </h2>
      {/* Broken after the @ so the address wraps there, not mid-word. */}
      <a
        href={`mailto:${AUTHOR.email}`}
        className="mt-auto pt-8 text-2xl leading-tight font-bold underline-offset-4 hover:underline"
      >
        {mailbox}@<wbr />
        {domain}
      </a>
      <p className="mt-3 text-sm opacity-75">{t("note.description")}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <CopyEmail />
        {[
          { label: "GitHub", href: AUTHOR.github },
          { label: "LinkedIn", href: AUTHOR.linkedin },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-anchor-foreground/40 px-3 py-1 text-xs font-medium press hover:bg-anchor-foreground/10"
          >
            {link.label} <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </Module>
  );
}
