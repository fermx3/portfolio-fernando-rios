import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Project dates are calendar dates (YYYY-MM-DD), which `new Date` parses as UTC
// midnight. Formatting those in the runtime's local zone renders the previous day
// anywhere west of UTC, so the date is formatted in UTC to match what was authored
// in the frontmatter — and to stay identical between the server and the browser.
export function formatDate(dateString: string, locale: string = 'en-US'): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function getCategoryColor(category: string): string {
  const colors = {
    'data-science': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'full-stack': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'ml': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    'visualization': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  }

  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

export function generatePlaceholderGradient(seed: string): string {
  // Simple hash function to generate consistent colors from string
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }

  const hue1 = Math.abs(hash) % 360
  const hue2 = (hue1 + 60) % 360

  return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%) 0%, hsl(${hue2}, 70%, 70%) 100%)`
}
