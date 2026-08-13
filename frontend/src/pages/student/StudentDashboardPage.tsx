import { useCallback, useEffect, useState } from 'react'
import { Activity, BarChart3, ClipboardCheck, Target } from 'lucide-react'
import { normalizeApiError } from '../../api/error'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { MetricCard } from '../../components/dashboard/MetricCard'
import { DashboardSkeleton } from '../../components/dashboard/DashboardSkeleton'
import { RecommendationCard } from '../../components/dashboard/RecommendationCard'
import { TopicProgressList } from '../../components/dashboard/TopicProgressList'
import { AssessmentTrend } from '../../components/dashboard/AssessmentTrend'
import { StrengthWeaknessCard } from '../../components/dashboard/StrengthWeaknessCard'
import { RecentActivityList } from '../../components/dashboard/RecentActivityList'
import { QuickActions } from '../../components/dashboard/QuickActions'
import { useAuth } from '../../hooks/useAuth'
import { dashboardService } from '../../services/dashboardService'
import type { FrontendApiError } from '../../types/api'
import type { StudentDashboardViewModel } from '../../types/dashboard'
import { formatNumber, formatPercent, formatToday } from '../../utils/format'

export const StudentDashboardPage = () => {
  const { roleDisplayName, user } = useAuth()
  const [dashboard, setDashboard] = useState<StudentDashboardViewModel | null>(null)
  const [error, setError] = useState<FrontendApiError | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadDashboard = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)

    try {
      const nextDashboard = await dashboardService.getStudentDashboard(signal)
      setDashboard(nextDashboard)
    } catch (requestError) {
      if (signal?.aborted) {
        return
      }

      setError(normalizeApiError(requestError))
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadDashboard(controller.signal)

    return () => controller.abort()
  }, [loadDashboard])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <section className="grid gap-6" aria-live="polite">
        <Alert title="Dashboard data unavailable" variant="danger">
          {error.message}
        </Alert>
        <div>
          <Button onClick={() => void loadDashboard()}>
            Retry
          </Button>
        </div>
      </section>
    )
  }

  if (!dashboard) {
    return (
      <section className="grid gap-6" aria-live="polite">
        <Alert title="Dashboard not available">
          Lucid could not load your dashboard data yet. Please try again.
        </Alert>
        <div>
          <Button onClick={() => void loadDashboard()}>
            Retry
          </Button>
        </div>
      </section>
    )
  }

  const displayName = dashboard.student.fullName || user?.fullName || 'student'
  const firstName = displayName.split(' ')[0]

  return (
    <section className="grid gap-6" aria-live="polite">
      <div className="rounded-lg border border-white/65 bg-white/72 p-5 shadow-[0_18px_45px_rgba(47,54,59,0.08)] backdrop-blur-xl ring-1 ring-white/45">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
              {formatToday()}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">
              Welcome back, {firstName}. Let's make progress today.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              {dashboard.student.educationLevel} learner · {dashboard.student.email}
            </p>
          </div>
          <Badge variant="accent">{roleDisplayName ?? 'Student'}</Badge>
        </div>
      </div>

      <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          helper="Completed assessments recorded by Lucid."
          icon={<ClipboardCheck aria-hidden="true" className="h-5 w-5" />}
          label="Assessments completed"
          value={formatNumber(dashboard.summary.completedAssessments)}
        />
        <MetricCard
          helper="Average score across completed assessments."
          icon={<BarChart3 aria-hidden="true" className="h-5 w-5" />}
          label="Average score"
          value={formatPercent(dashboard.summary.averageScore)}
        />
        <MetricCard
          helper="Most recent completed assessment score."
          icon={<Activity aria-hidden="true" className="h-5 w-5" />}
          label="Latest score"
          value={formatPercent(dashboard.summary.latestScore)}
        />
        <MetricCard
          helper="Current learner profile mastery."
          icon={<Target aria-hidden="true" className="h-5 w-5" />}
          label="Mastery level"
          value={formatPercent(dashboard.summary.overallMasteryPercentage)}
        />
      </div>

      <RecommendationCard recommendation={dashboard.recommendation} />

      <div className="grid auto-rows-fr items-stretch gap-4 xl:grid-cols-2">
        <TopicProgressList topics={dashboard.topicPerformance} />
        <AssessmentTrend progress={dashboard.progress} />
      </div>

      <div className="grid auto-rows-fr items-stretch gap-4 xl:grid-cols-2">
        <StrengthWeaknessCard
          strongestTopic={dashboard.strongestTopic}
          weakestTopic={dashboard.weakestTopic}
        />
        <RecentActivityList activities={dashboard.recentActivities} />
      </div>

      <QuickActions />
    </section>
  )
}
