import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Lightbulb, Target, Trophy } from 'lucide-react'
import { normalizeApiError } from '../../api/error'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { APP_ROUTES } from '../../constants/routes'
import { learnerProfileService } from '../../services/learnerProfileService'
import type { FrontendApiError } from '../../types/api'
import type { LearnerProfileDto } from '../../types/dashboard'
import { formatDateTime, formatPercent } from '../../utils/format'

export const LearnerProfilePage = () => {
  const [profile, setProfile] = useState<LearnerProfileDto | null>(null)
  const [error, setError] = useState<FrontendApiError | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadProfile = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)

    try {
      setProfile(await learnerProfileService.getMine(signal))
    } catch (requestError) {
      if (!signal?.aborted) {
        setError(normalizeApiError(requestError))
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadProfile(controller.signal)
    return () => controller.abort()
  }, [loadProfile])

  const hasProfile = Boolean(
    profile &&
      (profile.lastUpdated ||
        profile.strongestTopic ||
        profile.weakestTopic ||
        profile.recommendedNextTopic),
  )

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
          Learner profile
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">Your learning profile</h1>
      </div>

      {isLoading ? <LoadingSpinner label="Loading learner profile" /> : null}

      {error ? (
        <Alert title="Learner profile unavailable" variant="danger">
          <p>{error.message}</p>
          <Button className="mt-3" onClick={() => void loadProfile()}>
            Retry
          </Button>
        </Alert>
      ) : null}

      {!isLoading && !error && !hasProfile ? (
        <EmptyState title="Complete your first assessment">
          Your learner profile will appear after your first completed assessment.
          <div className="mt-4">
            <Link className="inline-flex min-h-11 items-center rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white" to={APP_ROUTES.student.assessments}>
              Start assessment
            </Link>
          </div>
        </EmptyState>
      ) : null}

      {profile && hasProfile ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <Brain className="h-6 w-6 text-[var(--color-primary)]" />
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">Overall mastery</p>
              <p className="mt-1 text-2xl font-semibold text-[var(--color-primary)]">
                {formatPercent(profile.overallMasteryPercentage)}
              </p>
            </Card>
            <Card>
              <Trophy className="h-6 w-6 text-[var(--color-success)]" />
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">Strongest topic</p>
              <p className="mt-1 text-xl font-semibold text-[var(--color-primary)]">
                {profile.strongestTopic || 'Not available yet'}
              </p>
            </Card>
            <Card>
              <Target className="h-6 w-6 text-[var(--color-warning)]" />
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">Weakest topic</p>
              <p className="mt-1 text-xl font-semibold text-[var(--color-primary)]">
                {profile.weakestTopic || 'Not available yet'}
              </p>
            </Card>
            <Card>
              <Lightbulb className="h-6 w-6 text-[var(--color-primary)]" />
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">Recommended difficulty</p>
              <p className="mt-1 text-xl font-semibold text-[var(--color-primary)]">
                Level {profile.recommendedDifficultyLevel}
              </p>
            </Card>
          </div>

          <Card className="bg-[var(--color-accent)]/24">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-[var(--color-primary)]">Recommendation</h2>
              <Badge variant="warning">Next step</Badge>
            </div>
            <p className="mt-4 text-2xl font-semibold text-[var(--color-primary)]">
              {profile.recommendedNextTopic || 'Complete more assessments for a topic recommendation'}
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--color-primary)]">{profile.teachingApproach}</p>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              Last updated: {formatDateTime(profile.lastUpdated)}
            </p>
          </Card>
        </>
      ) : null}
    </section>
  )
}
