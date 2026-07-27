import type { AssessmentProgressDto } from '../../types/dashboard'
import { formatDate, formatPercent } from '../../utils/format'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'

interface AssessmentTrendProps {
  progress: AssessmentProgressDto[]
}

export const AssessmentTrend = ({ progress }: AssessmentTrendProps) => (
  <Card>
    <div className="mb-5">
      <h2 className="text-xl font-semibold text-[var(--color-primary)]">Assessment progress</h2>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Real scores from completed assessments, newest context shown in order.
      </p>
    </div>

    {progress.length < 2 ? (
      <EmptyState title="More assessment history needed">
        Complete at least two assessments to see a useful progress trend.
      </EmptyState>
    ) : (
      <div className="grid gap-4" aria-label="Assessment score history">
        {progress.map((item) => (
          <div className="grid gap-2" key={item.id}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-[var(--color-primary)]">{formatDate(item.date)}</span>
              <span className="font-semibold text-[var(--color-primary)]">{formatPercent(item.score)}</span>
            </div>
            <div
              aria-label={`Assessment on ${formatDate(item.date)} scored ${formatPercent(item.score)}`}
              className="h-3 overflow-hidden rounded-full bg-[var(--color-background)]"
              role="progressbar"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={Math.round(item.score)}
            >
              <div
                className="h-full rounded-full bg-[var(--color-secondary)]"
                style={{ width: `${Math.min(item.score, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
)
