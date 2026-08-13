import { useTranslations } from "next-intl";
import { Container } from "./container";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const t = useTranslations("footer");

  const year = new Date().getFullYear();

  return (
    <footer className="border-t">
      <Container>
        <div className="py-8">
          <Separator className="mb-8" />
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              {t("rights", { year })}
            </p>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              {t("copyright")}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
