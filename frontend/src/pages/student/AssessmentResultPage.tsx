import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { APP_ROUTES } from '../../constants/routes'
import { assessmentService } from '../../services/assessmentService'
import { normalizeApiError } from '../../api/error'
import type { FrontendApiError } from '../../types/api'
import type { AssessmentResultDto, AssessmentSummaryDto } from '../../types/learningModules'
import { formatDateTime, formatPercent } from '../../utils/format'

interface ResultLocationState {
  result?: AssessmentResultDto
}

export const AssessmentResultPage = () => {
  const { assessmentId } = useParams()
  const location = useLocation()
  const state = location.state as ResultLocationState | null
  const parsedAssessmentId = Number(assessmentId)
  const [summary, setSummary] = useState<AssessmentSummaryDto | null>(null)
  const [error, setError] = useState<FrontendApiError | null>(null)
  const [isLoading, setIsLoading] = useState(!state?.result)

  const loadSummary = useCallback(async (signal?: AbortSignal) => {
    if (!Number.isInteger(parsedAssessmentId)) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      setSummary(await assessmentService.getAssessment(parsedAssessmentId, signal))
    } catch (requestError) {
      if (!signal?.aborted) {
        setError(normalizeApiError(requestError))
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [parsedAssessmentId])

  useEffect(() => {
    if (state?.result) {
      return
    }

    const controller = new AbortController()
    void loadSummary(controller.signal)
    return () => controller.abort()
  }, [loadSummary, state?.result])

  const result = state?.result
  const totalQuestions = result?.totalQuestions ?? summary?.totalQuestions ?? 0
  const correctAnswers = result?.correctAnswers ?? summary?.correctAnswers ?? 0
  const incorrectAnswers = result?.incorrectAnswers ?? summary?.incorrectAnswers ?? 0
  const percentageScore = result?.percentageScore ?? summary?.percentageScore ?? 0
  const submittedAt = result?.submittedAt ?? summary?.dateTaken
  const reviewAnswers = result?.answers

  if (isLoading) {
    return <LoadingSpinner label="Loading assessment result" />
  }

  if (error) {
    return (
      <section className="grid gap-6">
        <Alert title="Result unavailable" variant="danger">
          {error.message}
        </Alert>
        <Button onClick={() => void loadSummary()}>
          Retry
        </Button>
      </section>
    )
  }

  return (
    <section className="grid gap-6">
      <Card className="border-[var(--color-secondary)]">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
          Assessment result
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-[var(--color-primary)]">
          {formatPercent(percentageScore)}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Submitted: {formatDateTime(submittedAt)}
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Badge variant="success">{correctAnswers} correct</Badge>
          <Badge variant="danger">{incorrectAnswers} incorrect</Badge>
          <Badge variant="neutral">{totalQuestions} total</Badge>
        </div>
      </Card>

      {reviewAnswers ? (
        <Card>
          <h2 className="text-xl font-semibold text-[var(--color-primary)]">Question review</h2>
          <div className="mt-5 grid gap-4">
            {reviewAnswers.map((answer) => (
              <div className="rounded-md border border-[var(--color-border)] p-4" key={answer.id}>
                <div className="flex items-start gap-3">
                  {answer.isCorrect ? (
                    <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-[var(--color-success)]" />
                  ) : (
                    <XCircle aria-hidden="true" className="h-5 w-5 text-[var(--color-error)]" />
                  )}
                  <div>
                    <p className="font-semibold text-[var(--color-primary)]">{answer.questionText}</p>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                      Your answer: <strong>{answer.selectedAnswer || 'No answer submitted'}</strong>
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      Correct answer: <strong>{answer.correctAnswer}</strong>
                    </p>
                    {answer.explanation ? (
                      <p className="mt-2 text-sm leading-6 text-[var(--color-primary)]">{answer.explanation}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Alert title="Limited review after refresh" variant="info">
          The backend result lookup does not return correct answers or explanations after page refresh. The score
          summary above is real backend data.
        </Alert>
      )}

      <div className="flex flex-wrap gap-3">
        <Link className="inline-flex min-h-11 items-center rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white" to={APP_ROUTES.student.dashboard}>
          Return to dashboard
        </Link>
        <Link className="inline-flex min-h-11 items-center rounded-md border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-primary)]" to={APP_ROUTES.student.learnerProfile}>
          View learner profile
        </Link>
        <Link className="inline-flex min-h-11 items-center rounded-md border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-primary)]" to={APP_ROUTES.student.learningHistory}>
          View learning history
        </Link>
        <Link className="inline-flex min-h-11 items-center rounded-md border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-primary)]" to={APP_ROUTES.student.assessments}>
          Take another assessment
        </Link>
      </div>
    </section>
  )
}
