import { useCallback, useEffect, useState } from 'react'
import { ClipboardCheck, History, RefreshCcw } from 'lucide-react'
import { normalizeApiError } from '../../api/error'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { learningHistoryService } from '../../services/learningHistoryService'
import type { FrontendApiError } from '../../types/api'
import type { LearningHistoryDto } from '../../types/dashboard'
import { formatDateTime, formatPercent } from '../../utils/format'

const getHistoryIcon = (eventType: string) => {
  if (eventType.includes('Assessment')) {
    return ClipboardCheck
  }

  if (eventType.includes('Profile')) {
    return RefreshCcw
  }

  return History
}

export const LearningHistoryPage = () => {
  const [history, setHistory] = useState<LearningHistoryDto[]>([])
  const [error, setError] = useState<FrontendApiError | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadHistory = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)

    try {
      setHistory(await learningHistoryService.getMine(signal))
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
    void loadHistory(controller.signal)
    return () => controller.abort()
  }, [loadHistory])

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
          Learning history
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">Recent learning activity</h1>
      </div>

      {isLoading ? <LoadingSpinner label="Loading learning history" /> : null}

      {error ? (
        <Alert title="Learning history unavailable" variant="danger">
          <p>{error.message}</p>
          <Button className="mt-3" onClick={() => void loadHistory()}>
            Retry
          </Button>
        </Alert>
      ) : null}

      {!isLoading && !error && history.length === 0 ? (
        <EmptyState title="No learning history yet">
          Your learning activity will appear here as you use Lucid.
        </EmptyState>
      ) : null}

      <Card>
        <ol className="grid gap-3">
          {history.map((item) => {
            const Icon = getHistoryIcon(item.eventType)

            return (
              <li className="flex gap-3 rounded-md border border-[var(--color-border)] p-4" key={item.id}>
                <div className="rounded-md bg-[var(--color-background)] p-2 text-[var(--color-primary)]">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-primary)]">{item.activity}</p>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    {item.topicName || 'No topic recorded'} · {formatDateTime(item.dateCompleted)}
                  </p>
                  {item.performance > 0 ? (
                    <p className="mt-1 text-sm font-medium text-[var(--color-primary)]">
                      Performance: {formatPercent(item.performance)}
                    </p>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ol>
      </Card>
    </section>
  )
}
