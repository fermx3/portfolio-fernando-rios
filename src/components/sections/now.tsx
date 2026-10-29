import Image from "next/image";
import { useTranslations } from "next-intl";
import { Module } from "@/components/ui/module";

export function Now() {
  const t = useTranslations("about");

  return (
    <Module as="section" tone="lime" aria-labelledby="now" className="flex flex-col">
      <Image
        src="/images/profile.png"
        alt=""
        width={64}
        height={64}
        className="h-16 w-16 rounded-full object-cover"
      />
      <h2 id="now" className="mt-6 font-mono text-xs">
        {t("current.title")}
      </h2>
      <p className="mt-2 text-[0.9375rem] leading-snug font-medium">{t("current.body")}</p>
    </Module>
  );
}
