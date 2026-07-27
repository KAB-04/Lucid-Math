import { ArrowRight, Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../../constants/routes'
import type { Recommendation } from '../../types/dashboard'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

interface RecommendationCardProps {
  recommendation: Recommendation
}

export const RecommendationCard = ({ recommendation }: RecommendationCardProps) => (
  <Card className="border-[var(--color-accent)] bg-[var(--color-accent)]/22">
    <div className="flex items-start gap-4">
      <div className="rounded-md bg-white p-2 text-[var(--color-primary)]">
        <Lightbulb aria-hidden="true" className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold text-[var(--color-primary)]">Recommended next step</h2>
          {recommendation.difficultyLevel ? (
            <Badge variant="warning">Difficulty {recommendation.difficultyLevel}</Badge>
          ) : null}
        </div>

        {recommendation.hasRecommendation ? (
          <>
            <p className="mt-3 text-2xl font-semibold text-[var(--color-primary)]">
              {recommendation.nextTopic || recommendation.weakestTopic}
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--color-primary)]">
              {recommendation.teachingApproach}
            </p>
            <Link
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
              to={APP_ROUTES.student.assessments}
            >
              Start assessment
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm leading-6 text-[var(--color-primary)]">
              Complete your first diagnostic assessment to unlock a recommendation tailored to your learning needs.
            </p>
            <Link
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
              to={APP_ROUTES.student.assessments}
            >
              Take first assessment
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </>
        )}
      </div>
    </div>
  </Card>
)
