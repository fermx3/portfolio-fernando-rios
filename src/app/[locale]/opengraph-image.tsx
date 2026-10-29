import { ImageResponse } from "next/og";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { AUTHOR } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Fer Rios";

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

// The Bento light theme. ImageResponse does not understand oklch(), so these
// are the globals.css tokens converted to hex.
const ARENA = "#f3f0e7";
const PAPER = "#ffffff";
const INK = "#18160c";
const GREY = "#4f4d41";
const LIME = "#bde892";

/**
 * One weight of a Google font, subset to the text it has to draw. Returns null
 * on any failure, and the card falls back to the default font: a missing
 * typeface must not break link previews.
 */
async function loadFont(family: string, weight: number, text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`
    ).then((res) => res.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const tHero = await getTranslations({ locale, namespace: "hero" });
  const tAssistant = await getTranslations({ locale, namespace: "contact.assistant" });

  const [first, last] = AUTHOR.name.split(" ");
  const role = tHero("role");
  const kicker = tHero("kicker");
  const domain = "fernandorios.dev";
  const ask = tAssistant("title");
  const aiLabel = tAssistant("aiLabel");

  const [display, mono] = await Promise.all([
    loadFont("Bricolage+Grotesque", 700, `${AUTHOR.name}${role}${ask}`),
    loadFont("DM+Mono", 500, `${kicker}${domain}${aiLabel}`),
  ]);
  const fonts = [
    display && { name: "Bricolage", data: display, weight: 700 as const },
    mono && { name: "DM Mono", data: mono, weight: 500 as const },
  ].filter((font) => font !== null && font !== undefined);

  // The home page's first row, as a card: the hero module beside the anchor.
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        gap: 16,
        padding: 32,
        backgroundColor: ARENA,
        fontFamily: "Bricolage",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1.25,
          padding: 48,
          borderRadius: 36,
          backgroundColor: PAPER,
          color: INK,
        }}
      >
        <div style={{ display: "flex", fontFamily: "DM Mono", fontSize: 17, color: GREY }}>
          {kicker}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            fontSize: 150,
            fontWeight: 700,
            lineHeight: 0.86,
            letterSpacing: -6,
          }}
        >
          <span>{first}</span>
          <span>{last}</span>
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 34, fontWeight: 700 }}>{role}</div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          padding: 48,
          borderRadius: 36,
          backgroundColor: INK,
          color: ARENA,
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "6px 14px",
            borderRadius: 10,
            backgroundColor: LIME,
            color: INK,
            fontFamily: "DM Mono",
            fontSize: 22,
          }}
        >
          {aiLabel}
        </div>
        <div style={{ display: "flex", fontSize: 50, fontWeight: 700, lineHeight: 1 }}>{ask}</div>
        <div style={{ display: "flex", fontFamily: "DM Mono", fontSize: 24, color: LIME }}>
          {domain}
        </div>
      </div>
    </div>,
    { ...size, fonts }
  );
}
