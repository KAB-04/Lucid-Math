import { Badge } from '../ui/Badge'
import { getTeachingStyleDescription } from '../../utils/tutor'

interface TeachingStyleBadgeProps {
  style: string
}

export const TeachingStyleBadge = ({ style }: TeachingStyleBadgeProps) => (
  <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-secondary)]/14 p-4">
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-sm font-semibold text-[var(--color-primary)]">Teaching approach</p>
      <Badge variant="accent">{style}</Badge>
    </div>
    <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
      {getTeachingStyleDescription(style)}
    </p>
  </div>
)
