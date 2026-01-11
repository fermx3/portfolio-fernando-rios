import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Metadata } from 'next'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://fernandorios.dev'),
  title: {
    default: 'Fernando Rios - Data Scientist & Full-Stack Developer',
    template: '%s | Fernando Rios'
  },
  description: 'Passionate about transforming data into insights and building scalable solutions that drive real-world impact.',
  keywords: ['data science', 'full-stack development', 'machine learning', 'web development', 'Fernando Rios'],
  authors: [{ name: 'Fernando Rios' }],
  creator: 'Fernando Rios',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fernandorios.dev',
    siteName: 'Fernando Rios Portfolio',
    title: 'Fernando Rios - Data Scientist & Full-Stack Developer',
    description: 'Passionate about transforming data into insights and building scalable solutions that drive real-world impact.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fernando Rios - Data Scientist & Full-Stack Developer',
    description: 'Passionate about transforming data into insights and building scalable solutions that drive real-world impact.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages({ locale })

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
  )
}
