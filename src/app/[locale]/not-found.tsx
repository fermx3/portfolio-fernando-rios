import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

// Without this, notFound() fell through to Next's built-in 404: no layout, no
// navigation and untranslated.
export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <Section className="flex min-h-[60vh] items-center">
      <Container size="md">
        <div className="text-center">
          <p className="text-6xl font-bold tracking-tight text-muted-foreground">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
          <Button asChild className="mt-8">
            <Link href="/">{t("back")}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
