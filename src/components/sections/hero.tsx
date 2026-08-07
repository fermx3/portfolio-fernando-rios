"use client";

import { useTranslations } from "next-intl";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { FadeIn } from "@/components/motion/fade-in";

export function Hero() {
  const t = useTranslations("hero");

  const handleScrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Section id="hero" className="min-h-screen flex items-center">
      <Container>
        <div className="max-w-4xl">
          <FadeIn direction="up" delay={0.1}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block">{t("name")}</span>
              <span className="block text-muted-foreground mt-2">{t("role")}</span>
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <p className="mt-6 max-w-2xl text-xl text-muted-foreground sm:text-2xl">
              {t("description")}
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.3}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Button size="lg" onClick={handleScrollToProjects} className="text-base">
                {t("cta.primary")}
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleScrollToContact}
                className="text-base"
              >
                {t("cta.secondary")}
              </Button>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <div className="mt-16 flex gap-6">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://github.com/fermx3"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://www.linkedin.com/in/riosafernando/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="mailto:fer.riosalcantara@gmail.com" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
