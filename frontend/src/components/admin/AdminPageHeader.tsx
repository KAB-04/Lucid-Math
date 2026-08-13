import type { ReactNode } from 'react'

interface AdminPageHeaderProps {
  actions?: ReactNode
  description?: string
  eyebrow?: string
  title: string
}

export const AdminPageHeader = ({
  actions,
  description,
  eyebrow = 'Teacher workspace',
  title,
}: AdminPageHeaderProps) => (
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">{title}</h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
          {description}
        </p>
      ) : null}
    </div>
    {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
  </div>
)
