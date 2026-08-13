import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const Card = ({ children, className = '', ...props }: CardProps) => (
  <div
    className={`h-full rounded-lg border border-white/65 bg-white/72 p-5 shadow-[0_18px_45px_rgba(47,54,59,0.08)] backdrop-blur-xl ring-1 ring-white/45 ${className}`}
    {...props}
  >
    {children}
  </div>
)
