import { ClipboardCheck, History, RefreshCcw } from 'lucide-react'
import type { RecentActivity } from '../../types/dashboard'
import { formatDateTime, formatPercent } from '../../utils/format'
import { Card } from '../ui/Card'
import { EmptyState } from '../ui/EmptyState'

interface RecentActivityListProps {
  activities: RecentActivity[]
}

const getActivityIcon = (eventType: string) => {
  if (eventType.includes('Assessment')) {
    return ClipboardCheck
  }

  if (eventType.includes('Profile')) {
    return RefreshCcw
  }

  return History
}

export const RecentActivityList = ({ activities }: RecentActivityListProps) => (
  <Card>
    <h2 className="text-xl font-semibold text-[var(--color-primary)]">Recent learning activity</h2>

    {activities.length === 0 ? (
      <div className="mt-5">
        <EmptyState title="No learning activity yet">
          Your activity will appear here as you use Lucid.
        </EmptyState>
      </div>
    ) : (
      <ol className="mt-5 grid gap-3">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.eventType)

          return (
            <li className="flex gap-3 rounded-md border border-[var(--color-border)] p-4" key={activity.id}>
              <div className="rounded-md bg-[var(--color-background)] p-2 text-[var(--color-primary)]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[var(--color-primary)]">{activity.activity}</p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {activity.topicName || 'No topic recorded'} · {formatDateTime(activity.dateCompleted)}
                </p>
                {activity.performance !== null && activity.performance > 0 ? (
                  <p className="mt-1 text-sm font-semibold text-[var(--color-primary)]">
                    Performance: {formatPercent(activity.performance)}
                  </p>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>
    )}
  </Card>
)
