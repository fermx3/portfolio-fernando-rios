"use client";

import { useTranslations } from "next-intl";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { FadeIn } from "@/components/motion/fade-in";

export function Contact() {
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
          {/* Contact Form Placeholder */}
          <FadeIn direction="left" delay={0.1}>
            <Card className="flex flex-col h-full bg-card/50 backdrop-blur-sm border-dashed">
              <CardHeader>
                <CardTitle>{t("form.title")}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <Send className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold">{t("form.comingSoon")}</p>
                  <p className="text-muted-foreground">{t("form.note")}</p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Direct Contact */}
          <FadeIn direction="right" delay={0.2}>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>{t("direct.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="mailto:fer.riosalcantara@gmail.com">
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
