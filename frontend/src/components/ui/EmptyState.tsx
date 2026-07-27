import type { ReactNode } from 'react'
import { BookOpen } from 'lucide-react'

interface EmptyStateProps {
  title: string
  children: ReactNode
}

export const EmptyState = ({ children, title }: EmptyStateProps) => (
  <div className="rounded-lg border border-dashed border-[var(--color-muted)] bg-white/60 p-8 text-center">
    <BookOpen aria-hidden="true" className="mx-auto mb-4 h-8 w-8 text-[var(--color-primary)]" />
    <h2 className="text-xl font-semibold text-[var(--color-primary)]">{title}</h2>
    <div className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--color-text-muted)]">
      {children}
    </div>
  </div>
)
