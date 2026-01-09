"use client"

import { Languages } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const t = useTranslations('language')
  const router = useRouter()

  // Get actual locale from URL
  const getCurrentLocale = () => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/').filter(Boolean)
      return pathSegments[0] || 'en'
    }
    return 'en'
  }

  const handleLanguageChange = () => {
    // Get current URL and extract the actual locale from it
    const currentPath = window.location.pathname
    const pathSegments = currentPath.split('/').filter(Boolean)
    const currentLocale = pathSegments[0] // First segment should be the locale

    const newLocale = currentLocale === 'en' ? 'es' : 'en'

    let newPath
    if (currentPath === `/${currentLocale}`) {
      // Exact match for root level
      newPath = `/${newLocale}`
    } else if (currentPath.startsWith(`/${currentLocale}/`)) {
      // For paths with subpages
      newPath = `/${newLocale}${currentPath.substring(currentLocale.length + 1)}`
    } else {
      // Fallback to root of new locale
      newPath = `/${newLocale}`
    }

    console.log('Current:', currentPath, 'Current Locale:', currentLocale, 'New:', newPath) // Debug log
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
        {getCurrentLocale().toUpperCase()}
      </span>
    </Button>
  )
}
