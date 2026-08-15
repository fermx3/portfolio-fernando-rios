import { ImageResponse } from "next/og";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { AUTHOR } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Fernando Rios";

// One image per locale, inherited by every page under [locale], so sharing any
// URL yields a card with an image -- twitter:card was already declared as
// summary_large_image with no image to show.
//
// Next renders this route on demand rather than at build time (it shows as
// dynamic in the build output); the CDN caches the result, and the HTML pages
// themselves stay static.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata" });
  const tHero = await getTranslations({ locale, namespace: "hero" });

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        padding: 80,
      }}
    >
      <div
        style={{
          display: "flex",
          width: 72,
          height: 8,
          backgroundColor: "#9de500",
          marginBottom: 48,
        }}
      />
      <div style={{ display: "flex", fontSize: 68, fontWeight: 700, color: "#fafafa" }}>
        {AUTHOR.name}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 40,
          color: "#9de500",
          marginTop: 12,
        }}
      >
        {tHero("role")}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 26,
          color: "#a1a1a1",
          marginTop: 32,
          maxWidth: 900,
          lineHeight: 1.4,
        }}
      >
        {t("description")}
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#737373", marginTop: 48 }}>
        www.fernandorios.dev
      </div>
    </div>,
    size
  );
}
