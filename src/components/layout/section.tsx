// FILE: src/components/layout/section.tsx
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
  variant?: 'default' | 'muted'
}

export function Section({ children, className, id, variant = 'default' }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'section-padding',
        variant === 'muted' && 'bg-muted/30',
        className
      )}
    >
      {children}
    </section>
  )
}
