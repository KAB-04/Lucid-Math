import type { TopicPerformance } from '../../types/dashboard'
import { formatPercent } from '../../utils/format'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'

interface TopicProgressListProps {
  topics: TopicPerformance[]
}

const getStatusVariant = (status: TopicPerformance['status']) => {
  if (status === 'Proficient') {
    return 'success'
  }

  if (status === 'Developing') {
    return 'warning'
  }

  return 'danger'
}

export const TopicProgressList = ({ topics }: TopicProgressListProps) => (
  <Card>
    <div className="mb-5">
      <h2 className="text-xl font-semibold text-[var(--color-primary)]">Topic performance</h2>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        Topic insights are based on your learner profile after completed assessments.
      </p>
    </div>

    {topics.length === 0 ? (
      <EmptyState title="No topic insights yet">
        Complete an assessment to unlock topic-level strengths, weak spots, and mastery signals.
      </EmptyState>
    ) : (
      <div className="grid gap-4">
        {topics.map((topic) => {
          const progress = topic.masteryPercentage ?? 0

          return (
            <div className="rounded-md border border-[var(--color-border)] p-4" key={topic.topicName}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[var(--color-primary)]">{topic.topicName}</h3>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Mastery: {formatPercent(topic.masteryPercentage)}
                  </p>
                </div>
                <Badge variant={getStatusVariant(topic.status)}>{topic.status}</Badge>
              </div>
              <div
                aria-label={`${topic.topicName} mastery ${formatPercent(topic.masteryPercentage)}`}
                className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--color-background)]"
                role="progressbar"
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={Math.round(progress)}
              >
                <div
                  className="h-full rounded-full bg-[var(--color-primary)]"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    )}
  </Card>
)
