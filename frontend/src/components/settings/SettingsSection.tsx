import type { ReactNode } from 'react'
import { Card } from '../ui/Card'

interface SettingsSectionProps {
  children: ReactNode
  description?: string
  title: string
}

export const SettingsSection = ({ children, description, title }: SettingsSectionProps) => (
  <Card>
    <div className="mb-5">
      <h2 className="text-xl font-semibold text-[var(--color-primary)]">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p>
      ) : null}
    </div>
    {children}
  </Card>
)
