"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section className="flex min-h-[60vh] items-center">
      <Container size="md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={reset}>{t("retry")}</Button>
            <Button asChild variant="outline">
              <Link href="/">{t("back")}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
