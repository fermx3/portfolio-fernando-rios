// FILE: src/components/layout/language-toggle.tsx
"use client"

import { Languages } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const locale = useLocale()
  const t = useTranslations('language')
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = () => {
    const newLocale = locale === 'en' ? 'es' : 'en'
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleLanguageChange}
      aria-label={t('toggle')}
      className="relative"
    >
      <Languages className="h-4 w-4" />
      <span className="absolute -bottom-1 -right-1 text-xs font-medium">
        {locale.toUpperCase()}
      </span>
    </Button>
  )
}
