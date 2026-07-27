import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const Card = ({ children, className = '', ...props }: CardProps) => (
  <div
    className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
)
