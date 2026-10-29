import { getTranslations } from "next-intl/server";
import { Module } from "@/components/ui/module";

interface EducationItem {
  institution: string;
  program: string;
  date: string;
}

interface ExperienceItem {
  organization: string;
  role: string;
  date: string;
}

interface Row {
  title: string;
  subtitle: string;
  date: string;
}

interface AboutProps {
  locale: string;
}

/**
 * Bio beside a compact timeline. The expertise, education topics and stack that
 * used to follow are gone from the page, but expertise and education stay in
 * messages: buildProfile() reads them for the assistant.
 */
export async function About({ locale }: AboutProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  const rows: Row[] = [
    ...(t.raw("experience.items") as ExperienceItem[]).map((item) => ({
      title: item.organization,
      subtitle: item.role,
      date: item.date,
    })),
    ...(t.raw("education.items") as EducationItem[]).map((item) => ({
      title: item.institution,
      subtitle: item.program,
      date: item.date,
    })),
  ];

  return (
    <Module
      as="section"
      span={3}
      id="about"
      className="grid scroll-mt-20 gap-8 sm:p-9 md:grid-cols-[1.3fr_1fr] md:gap-12"
    >
      <div>
        <h2 className="font-mono text-xs text-muted-foreground">{t("aboutMe")}</h2>
        <p className="mt-4 text-xl leading-snug font-medium sm:text-[1.375rem]">{t("bio")}</p>
      </div>

      <div>
        <h2 className="font-mono text-xs text-muted-foreground">{t("experience.title")}</h2>
        <ul className="mt-4 divide-y divide-line">
          {rows.map((row) => (
            <li key={row.title} className="py-3 first:pt-0">
              <p className="text-sm font-bold">{row.title}</p>
              <p className="text-sm">{row.subtitle}</p>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">{row.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </Module>
  );
}
