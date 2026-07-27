import { ArrowRight, BookOpen, Brain, ClipboardCheck, History } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../../constants/routes'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

const actions = [
  {
    icon: BookOpen,
    label: 'Browse topics',
    path: APP_ROUTES.student.topics,
  },
  {
    icon: ClipboardCheck,
    label: 'Start assessment',
    path: APP_ROUTES.student.assessments,
  },
  {
    icon: Brain,
    label: 'View learner profile',
    path: APP_ROUTES.student.learnerProfile,
  },
  {
    icon: History,
    label: 'View learning history',
    path: APP_ROUTES.student.learningHistory,
  },
]

export const QuickActions = () => (
  <Card>
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="text-xl font-semibold text-[var(--color-primary)]">Quick actions</h2>
      <Badge variant="neutral">Foundation routes</Badge>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      {actions.map((action) => {
        const Icon = action.icon

        return (
          <Link
            className="flex min-h-14 items-center justify-between gap-3 rounded-md border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-background)]"
            key={action.path}
            to={action.path}
          >
            <span className="flex items-center gap-3">
              <Icon aria-hidden="true" className="h-5 w-5" />
              {action.label}
            </span>
            <span className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              Coming soon
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </span>
          </Link>
        )
      })}
    </div>
  </Card>
)
