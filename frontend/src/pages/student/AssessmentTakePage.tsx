import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { APP_ROUTES } from '../../constants/routes'
import { assessmentService } from '../../services/assessmentService'
import { normalizeApiError } from '../../api/error'
import type { FrontendApiError } from '../../types/api'
import type { SubmitAnswerRequest } from '../../types/learningModules'
import { assessmentSession } from '../../utils/assessmentSession'

const optionKeys = ['optionA', 'optionB', 'optionC', 'optionD'] as const

export const AssessmentTakePage = () => {
  const { assessmentId } = useParams()
  const navigate = useNavigate()
  const parsedAssessmentId = Number(assessmentId)
  const storedAssessment = Number.isInteger(parsedAssessmentId)
    ? assessmentSession.get(parsedAssessmentId)
    : null
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [error, setError] = useState<FrontendApiError | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = storedAssessment?.questions[currentIndex]
  const answeredCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers],
  )

  if (!storedAssessment || !currentQuestion) {
    return (
      <section className="grid gap-6">
        <Alert title="Assessment questions are not available" variant="warning">
          The backend returns assessment questions only when the assessment starts. If the page was refreshed, start a
          new assessment to continue. No correct answers are stored in the browser.
        </Alert>
        <Link
          className="inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
          to={APP_ROUTES.student.assessments}
        >
          Start another assessment
        </Link>
      </section>
    )
  }

  const selectAnswer = (questionId: number, selectedAnswer: string) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: selectedAnswer,
    }))
  }

  const submitAssessment = async () => {
    setError(null)

    const unansweredQuestions = storedAssessment.questions.filter((question) => !answers[question.id])

    if (unansweredQuestions.length > 0) {
      const shouldSubmit = window.confirm(
        `${unansweredQuestions.length} question(s) are unanswered. Submit anyway?`,
      )

      if (!shouldSubmit) {
        return
      }
    }

    const shouldConfirm = window.confirm('Submit this assessment for marking?')

    if (!shouldConfirm) {
      return
    }

    const payload: SubmitAnswerRequest[] = storedAssessment.questions.map((question) => ({
      QuestionId: question.id,
      SelectedAnswer: answers[question.id] ?? '',
    }))

    setIsSubmitting(true)

    try {
      const result = await assessmentService.submitAssessment(parsedAssessmentId, {
        Answers: payload,
      })
      assessmentSession.clear(parsedAssessmentId)
      navigate(`${APP_ROUTES.student.assessments}/${parsedAssessmentId}/result`, {
        state: { result },
      })
    } catch (requestError) {
      setError(normalizeApiError(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressPercent = ((currentIndex + 1) / storedAssessment.totalQuestions) * 100

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
          Assessment #{storedAssessment.assessmentId}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">
          Question {currentIndex + 1} of {storedAssessment.totalQuestions}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Answered {answeredCount} of {storedAssessment.totalQuestions}
        </p>
      </div>

      <div
        aria-label={`Assessment progress ${Math.round(progressPercent)} percent`}
        className="h-3 overflow-hidden rounded-full bg-white"
        role="progressbar"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(progressPercent)}
      >
        <div className="h-full bg-[var(--color-primary)]" style={{ width: `${progressPercent}%` }} />
      </div>

      {error ? (
        <Alert title="Submission failed" variant="danger">
          {error.message}
        </Alert>
      ) : null}

      <Card>
        <p className="text-sm font-semibold text-[var(--color-text-muted)]">
          {currentQuestion.topicName || 'Topic not recorded'} · Difficulty {currentQuestion.difficultyLevel}
        </p>
        <h2 className="mt-3 text-2xl font-semibold leading-snug text-[var(--color-primary)]">
          {currentQuestion.questionText}
        </h2>

        <fieldset className="mt-6 grid gap-3">
          <legend className="sr-only">Choose an answer</legend>
          {optionKeys.map((optionKey) => {
            const optionValue = currentQuestion[optionKey]
            const inputId = `question-${currentQuestion.id}-${optionKey}`
            const isSelected = answers[currentQuestion.id] === optionValue

            return (
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 text-sm transition ${
                  isSelected
                    ? 'border-[var(--color-primary)] bg-[var(--color-secondary)]/25'
                    : 'border-[var(--color-border)] bg-white hover:bg-[var(--color-background)]'
                }`}
                htmlFor={inputId}
                key={optionKey}
              >
                <input
                  checked={isSelected}
                  className="mt-1"
                  id={inputId}
                  name={`question-${currentQuestion.id}`}
                  onChange={() => selectAnswer(currentQuestion.id, optionValue)}
                  type="radio"
                />
                <span>{optionValue}</span>
              </label>
            )
          })}
        </fieldset>
      </Card>

      <div className="flex flex-wrap justify-between gap-3">
        <Button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
          variant="secondary"
        >
          Previous
        </Button>
        {currentIndex < storedAssessment.questions.length - 1 ? (
          <Button onClick={() => setCurrentIndex((index) => index + 1)}>
            Next question
          </Button>
        ) : (
          <Button isLoading={isSubmitting} onClick={submitAssessment}>
            Submit assessment
          </Button>
        )}
      </div>
    </section>
  )
}
