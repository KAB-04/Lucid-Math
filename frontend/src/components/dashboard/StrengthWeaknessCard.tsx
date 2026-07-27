import { ShieldCheck, Target } from 'lucide-react'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'

interface StrengthWeaknessCardProps {
  strongestTopic: string
  weakestTopic: string
}

export const StrengthWeaknessCard = ({ strongestTopic, weakestTopic }: StrengthWeaknessCardProps) => (
  <Card>
    <h2 className="text-xl font-semibold text-[var(--color-primary)]">Strengths and learning needs</h2>

    {!strongestTopic && !weakestTopic ? (
      <div className="mt-5">
        <EmptyState title="Profile insights will appear here">
          Your strongest and weakest topics will be identified after a completed assessment.
        </EmptyState>
      </div>
    ) : (
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-[var(--color-success)]/35 bg-[var(--color-success)]/10 p-4">
          <ShieldCheck aria-hidden="true" className="h-6 w-6 text-[var(--color-success)]" />
          <p className="mt-3 text-sm font-medium text-[var(--color-text-muted)]">Strongest topic</p>
          <p className="mt-1 text-lg font-semibold text-[var(--color-primary)]">
            {strongestTopic || 'Not available yet'}
          </p>
        </div>
        <div className="rounded-md border border-[var(--color-warning)]/45 bg-[var(--color-warning)]/12 p-4">
          <Target aria-hidden="true" className="h-6 w-6 text-[var(--color-warning)]" />
          <p className="mt-3 text-sm font-medium text-[var(--color-text-muted)]">Needs attention</p>
          <p className="mt-1 text-lg font-semibold text-[var(--color-primary)]">
            {weakestTopic || 'Not available yet'}
          </p>
        </div>
      </div>
    )}
  </Card>
)
