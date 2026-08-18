"use client";

import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { FadeIn } from "@/components/motion/fade-in";
import { AskPortfolio } from "@/components/assistant/ask-portfolio";
import { AUTHOR } from "@/lib/site";
import type { CorpusProject } from "@/lib/assistant/corpus";

interface ContactProps {
  /** slug + title for every project, so the assistant's citations can be
      checked against the real list before they become links. */
  projects: CorpusProject[];
}

export function Contact({ projects }: ContactProps) {
  const t = useTranslations("contact");

  return (
    <Section id="contact">
      <Container>
        <FadeIn direction="up">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">{t("subtitle")}</p>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <FadeIn direction="left" delay={0.1}>
            <AskPortfolio projects={projects} />
          </FadeIn>

          {/* Direct Contact */}
          <FadeIn direction="right" delay={0.2}>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>{t("direct.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href={`mailto:${AUTHOR.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    {t("direct.email")}
                  </a>
                </Button>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="font-medium mb-2">{t("direct.note.title")}</h4>
                  <p className="text-sm text-muted-foreground">{t("direct.note.description")}</p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
