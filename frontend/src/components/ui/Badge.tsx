import type { HTMLAttributes, ReactNode } from 'react'

type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-[var(--color-background)] text-[var(--color-primary)]',
  accent: 'bg-[var(--color-accent)]/45 text-[var(--color-primary)]',
  success: 'bg-[var(--color-success)]/15 text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]/18 text-[#79551f]',
  danger: 'bg-[var(--color-error)]/15 text-[var(--color-error)]',
}

export const Badge = ({ children, className = '', variant = 'neutral', ...props }: BadgeProps) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variantClasses[variant]} ${className}`}
    {...props}
  >
    {children}
  </span>
)
