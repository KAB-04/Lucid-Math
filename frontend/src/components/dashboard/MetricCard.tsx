import type { ReactNode } from 'react'
import { Card } from '../ui/Card'

interface MetricCardProps {
  icon: ReactNode
  label: string
  value: string
  helper: string
}

export const MetricCard = ({ helper, icon, label, value }: MetricCardProps) => (
  <Card className="flex min-h-44 flex-col justify-between">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[var(--color-text-muted)]">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">{value}</p>
      </div>
      <div className="rounded-md border border-white/70 bg-white/62 p-2 text-[var(--color-primary)] shadow-sm backdrop-blur">
        {icon}
      </div>
    </div>
    <p className="mt-4 text-sm leading-6 text-[var(--color-text-muted)]">{helper}</p>
  </Card>
)
