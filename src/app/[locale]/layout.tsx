import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { AUTHOR, SITE_URL, absoluteUrl } from "@/lib/site";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Enumerating the locales lets every page under [locale] stay statically
// generated now that request.ts resolves the locale from the request.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// generateMetadata, not a static object: as a constant every locale served the
// same English title, description and OG tags.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  const title = t("title");
  const description = t("description");

  // No `alternates` here on purpose: metadata is inherited, so a canonical set
  // at the layout would be wrong for every child page. Each page declares its
  // own canonical and hreflang set.
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${AUTHOR.name}`,
    },
    description,
    keywords: t.raw("keywords") as string[],
    authors: [{ name: AUTHOR.name }],
    creator: AUTHOR.name,
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      url: absoluteUrl(locale),
      siteName: t("siteName"),
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
        {
          url: "/icon-light.png",
          sizes: "32x32",
          type: "image/png",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/icon-dark.png",
          sizes: "32x32",
          type: "image/png",
          media: "(prefers-color-scheme: dark)",
        },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <Navigation />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
