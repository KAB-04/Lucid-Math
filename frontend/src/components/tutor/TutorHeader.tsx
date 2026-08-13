import { History, MessageCircle, Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import type { TutorLearningContext } from '../../types/tutor'
import { TeachingStyleBadge } from './TeachingStyleBadge'

interface TutorHeaderProps {
  context: TutorLearningContext
  onNewSession: () => void
}

export const TutorHeader = ({ context, onNewSession }: TutorHeaderProps) => (
  <div className="grid gap-4">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
          AI Tutor
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">
          Learn with Lucid
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
          Ask questions, practise steps, and get guidance that follows your learner profile.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onNewSession} variant="secondary">
          <Plus aria-hidden="true" className="h-4 w-4" />
          New session
        </Button>
        <Button disabled variant="ghost" title="Tutor session history will be connected later.">
          <History aria-hidden="true" className="h-4 w-4" />
          Session history
        </Button>
      </div>
    </div>

    <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
      <Card className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Current topic
          </p>
          <p className="mt-1 font-semibold text-[var(--color-primary)]">{context.currentTopic}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Current level
          </p>
          <p className="mt-1 font-semibold text-[var(--color-primary)]">{context.currentLevel}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Tutor mode
          </p>
          <p className="mt-1 inline-flex items-center gap-2 font-semibold text-[var(--color-primary)]">
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            Guided chat
          </p>
        </div>
      </Card>
      <TeachingStyleBadge style={context.teachingStyle} />
    </div>
  </div>
)
