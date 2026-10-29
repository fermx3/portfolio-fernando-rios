import { useTranslations } from "next-intl";
import { Container } from "./container";

export function Footer() {
  const t = useTranslations("footer");

  const year = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <div className="flex flex-col items-center justify-between gap-2 py-6 font-mono text-xs text-muted-foreground md:flex-row">
          <p className="text-center md:text-left">{t("rights", { year })}</p>
          <p className="text-center md:text-right">{t("copyright")}</p>
        </div>
      </Container>
    </footer>
  );
}
