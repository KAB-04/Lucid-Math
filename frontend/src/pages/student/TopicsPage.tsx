import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { normalizeApiError } from '../../api/error'
import { APP_ROUTES } from '../../constants/routes'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { topicService } from '../../services/topicService'
import type { FrontendApiError } from '../../types/api'
import type { TopicDto } from '../../types/learningModules'

export const TopicsPage = () => {
  const [topics, setTopics] = useState<TopicDto[]>([])
  const [error, setError] = useState<FrontendApiError | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadTopics = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)

    try {
      setTopics(await topicService.getTopics(signal))
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
    void loadTopics(controller.signal)
    return () => controller.abort()
  }, [loadTopics])

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">Topics</p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">Browse mathematics topics</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
          Choose a topic and start a real backend assessment from that area.
        </p>
      </div>

      {isLoading ? <LoadingSpinner label="Loading topics" /> : null}

      {error ? (
        <Alert title="Topics unavailable" variant="danger">
          <p>{error.message}</p>
          <Button className="mt-3" onClick={() => void loadTopics()}>
            Retry
          </Button>
        </Alert>
      ) : null}

      {!isLoading && !error && topics.length === 0 ? (
        <EmptyState title="No topics available">
          The backend did not return any topics yet.
        </EmptyState>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <Card className="flex min-h-64 flex-col" key={topic.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-md bg-[var(--color-background)] p-2 text-[var(--color-primary)]">
                <BookOpen aria-hidden="true" className="h-5 w-5" />
              </div>
              {topic.difficultyLevel ? <Badge variant="neutral">{topic.difficultyLevel}</Badge> : null}
            </div>
            <h2 className="mt-5 text-xl font-semibold text-[var(--color-primary)]">{topic.name}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-[var(--color-text-muted)]">
              {topic.description || 'No description provided.'}
            </p>
            <Link
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
              to={`${APP_ROUTES.student.assessments}?topicId=${topic.id}`}
            >
              Start assessment
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Card>
        ))}
      </div>
    </section>
  )
}
