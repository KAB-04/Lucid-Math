import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ClipboardCheck } from 'lucide-react'
import { normalizeApiError } from '../../api/error'
import { APP_ROUTES } from '../../constants/routes'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Select } from '../../components/ui/Select'
import { assessmentService } from '../../services/assessmentService'
import { topicService } from '../../services/topicService'
import type { FrontendApiError } from '../../types/api'
import type { AssessmentAvailabilityDto, TopicDto } from '../../types/learningModules'
import { assessmentSession } from '../../utils/assessmentSession'

const questionCountOptions = [1, 3, 5, 10]

export const AssessmentsPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialTopicId = searchParams.get('topicId') ?? ''
  const [topics, setTopics] = useState<TopicDto[]>([])
  const [availability, setAvailability] = useState<AssessmentAvailabilityDto[]>([])
  const [topicId, setTopicId] = useState(initialTopicId)
  const [difficultyLevel, setDifficultyLevel] = useState('')
  const [questionCount, setQuestionCount] = useState('3')
  const [error, setError] = useState<FrontendApiError | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isLoadingTopics, setIsLoadingTopics] = useState(true)
  const [isStarting, setIsStarting] = useState(false)

  const selectedTopic = useMemo(
    () => topics.find((topic) => String(topic.id) === topicId),
    [topicId, topics],
  )

  const availableQuestionCount = useMemo(
    () =>
      availability.reduce((total, item) => {
        const matchesTopic = !topicId || String(item.topicId) === topicId
        const matchesDifficulty = !difficultyLevel || String(item.difficultyLevel) === difficultyLevel

        return matchesTopic && matchesDifficulty ? total + item.questionCount : total
      }, 0),
    [availability, difficultyLevel, topicId],
  )

  const loadTopics = useCallback(async (signal?: AbortSignal) => {
    setIsLoadingTopics(true)
    setError(null)

    try {
      const [topicData, availabilityData] = await Promise.all([
        topicService.getTopics(signal),
        assessmentService.getAvailability(signal),
      ])
      setTopics(topicData)
      setAvailability(availabilityData)
    } catch (requestError) {
      if (!signal?.aborted) {
        setError(normalizeApiError(requestError))
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoadingTopics(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadTopics(controller.signal)
    return () => controller.abort()
  }, [loadTopics])

  useEffect(() => {
    if (availableQuestionCount <= 0) {
      return
    }

    const parsedQuestionCount = Number(questionCount)

    if (parsedQuestionCount <= availableQuestionCount) {
      return
    }

    const nextQuestionCount =
      [...questionCountOptions].reverse().find((count) => count <= availableQuestionCount) ?? 1

    setQuestionCount(String(nextQuestionCount))
  }, [availableQuestionCount, questionCount])

  const startAssessment = async () => {
    setFormError(null)
    const parsedQuestionCount = Number(questionCount)

    if (!Number.isInteger(parsedQuestionCount) || parsedQuestionCount < 1 || parsedQuestionCount > 50) {
      setFormError('Question count must be between 1 and 50.')
      return
    }

    if (availableQuestionCount < parsedQuestionCount) {
      setFormError(`Only ${availableQuestionCount} question(s) are available for this assessment request.`)
      return
    }

    setIsStarting(true)

    try {
      const startedAssessment = await assessmentService.startAssessment({
        TopicId: topicId ? Number(topicId) : undefined,
        DifficultyLevel: difficultyLevel ? Number(difficultyLevel) : undefined,
        QuestionCount: parsedQuestionCount,
      })
      assessmentSession.save(startedAssessment)
      navigate(`${APP_ROUTES.student.assessments}/${startedAssessment.id}`)
    } catch (requestError) {
      const normalizedError = normalizeApiError(requestError)
      setFormError(normalizedError.message)
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">Assessments</p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">Start a diagnostic assessment</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
          Select a topic and difficulty if you want a focused assessment, or leave them open for a broader diagnostic.
        </p>
      </div>

      {isLoadingTopics ? <LoadingSpinner label="Loading assessment options" /> : null}

      {error ? (
        <Alert title="Assessment options unavailable" variant="danger">
          <p>{error.message}</p>
          <Button className="mt-3" onClick={() => void loadTopics()}>
            Retry
          </Button>
        </Alert>
      ) : null}

      {!isLoadingTopics && !error && topics.length === 0 ? (
        <EmptyState title="No topics are available">
          Topics are required before a focused assessment can be started.
        </EmptyState>
      ) : null}

      {!error ? (
        <Card className="max-w-2xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-md bg-[var(--color-background)] p-2 text-[var(--color-primary)]">
              <ClipboardCheck aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-primary)]">Assessment setup</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Backend request fields: TopicId, DifficultyLevel, QuestionCount.
              </p>
            </div>
          </div>

          {formError ? (
            <Alert title="Unable to start assessment" variant="danger">
              {formError}
            </Alert>
          ) : null}

          <div className="mt-5 grid gap-4">
            <Select label="Topic" onChange={(event) => setTopicId(event.target.value)} value={topicId}>
              <option value="">Any topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </Select>
            <Select
              label="Difficulty level"
              onChange={(event) => setDifficultyLevel(event.target.value)}
              value={difficultyLevel}
            >
              <option value="">Any difficulty</option>
              <option value="1">1 - Foundation</option>
              <option value="2">2 - Developing</option>
              <option value="3">3 - Proficient</option>
            </Select>
            <Select
              label="Number of questions"
              onChange={(event) => setQuestionCount(event.target.value)}
              value={questionCount}
            >
              {questionCountOptions.map((count) => (
                <option disabled={count > availableQuestionCount} key={count} value={count}>
                  {count} {count === 1 ? 'question' : 'questions'}
                </option>
              ))}
            </Select>
            <p className="text-sm text-[var(--color-text-muted)]">
              Available for this selection: <strong>{availableQuestionCount}</strong>
            </p>
            {selectedTopic ? (
              <p className="rounded-md bg-[var(--color-background)] p-3 text-sm text-[var(--color-primary)]">
                Selected topic: <strong>{selectedTopic.name}</strong>
              </p>
            ) : null}
            <Button isLoading={isStarting} onClick={startAssessment}>
              Start assessment
            </Button>
          </div>
        </Card>
      ) : null}
    </section>
  )
}
