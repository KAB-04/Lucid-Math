import type { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'

type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

interface AlertProps {
  children: ReactNode
  title?: string
  variant?: AlertVariant
}

const variantClasses: Record<AlertVariant, string> = {
  info: 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/20 text-[var(--color-primary)]',
  success: 'border-[var(--color-success)] bg-[var(--color-success)]/12 text-[var(--color-primary)]',
  warning: 'border-[var(--color-warning)] bg-[var(--color-warning)]/16 text-[var(--color-primary)]',
  danger: 'border-[var(--color-error)] bg-[var(--color-error)]/12 text-[var(--color-primary)]',
}

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
} satisfies Record<AlertVariant, typeof Info>

export const Alert = ({ children, title, variant = 'info' }: AlertProps) => {
  const Icon = icons[variant]

  return (
    <div className={`flex gap-3 rounded-md border p-4 ${variantClasses[variant]}`} role="status">
      <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="grid gap-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className="text-sm leading-6">{children}</div>
      </div>
    </div>
  )
}
