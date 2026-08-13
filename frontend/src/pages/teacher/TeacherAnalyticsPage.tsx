import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { BarChart3, Target, Trophy, Users } from 'lucide-react'
import { normalizeApiError } from '../../api/error'
import { AdminMetricCard } from '../../components/admin/AdminMetricCard'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { Alert } from '../../components/ui/Alert'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { adminService } from '../../services/adminService'
import type { FrontendApiError } from '../../types/api'
import type { AdminDashboardDto } from '../../types/admin'
import { formatPercent } from '../../utils/format'

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, Tooltip)

export const TeacherAnalyticsPage = () => {
  const [dashboard, setDashboard] = useState<AdminDashboardDto | null>(null)
  const [error, setError] = useState<FrontendApiError | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadAnalytics = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    try {
      setDashboard(await adminService.getDashboard(signal))
    } catch (requestError) {
      if (!signal?.aborted) setError(normalizeApiError(requestError))
    } finally {
      if (!signal?.aborted) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadAnalytics(controller.signal)
    return () => controller.abort()
  }, [loadAnalytics])

  const topicChart = useMemo(() => ({
    labels: dashboard?.topicPerformance.map((topic) => topic.topicName) ?? [],
    datasets: [{ label: 'Average score', data: dashboard?.topicPerformance.map((topic) => topic.averageScore) ?? [], backgroundColor: '#9FB2BF' }],
  }), [dashboard])

  const styleChart = useMemo(() => ({
    labels: ['Students with activity', 'Awaiting activity'],
    datasets: [{ data: [dashboard?.mostActiveStudents.length ?? 0, Math.max((dashboard?.totalStudents ?? 0) - (dashboard?.mostActiveStudents.length ?? 0), 0)], backgroundColor: ['#4F8A68', '#C6AE8D'] }],
  }), [dashboard])

  return (
    <section className="grid gap-6">
      <AdminPageHeader description="Review assessment outcomes and topic-level performance signals." title="Analytics" />
      {isLoading ? <LoadingSpinner label="Loading analytics" /> : null}
      {error ? <Alert title="Analytics unavailable" variant="danger">{error.message}</Alert> : null}
      {dashboard ? (
        <>
          <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AdminMetricCard icon={<Users className="h-5 w-5" />} label="Students" value={dashboard.totalStudents} />
            <AdminMetricCard icon={<BarChart3 className="h-5 w-5" />} label="Average score" value={formatPercent(dashboard.averageStudentScore)} />
            <AdminMetricCard icon={<Target className="h-5 w-5" />} label="Tracked topics" value={dashboard.topicPerformance.length} />
            <AdminMetricCard icon={<Trophy className="h-5 w-5" />} label="Most difficult topic" value={dashboard.mostDifficultTopic?.topicName || 'Not available'} />
          </div>
          <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
            <Card>
              <h2 className="text-xl font-semibold text-[var(--color-primary)]">Topic performance</h2>
              {dashboard.topicPerformance.length === 0 ? <div className="mt-5"><EmptyState title="Analytics will appear after students complete assessments.">Topic mastery needs submitted answers.</EmptyState></div> : <div className="mt-5"><Bar data={topicChart} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 } } }} /></div>}
            </Card>
            <Card>
              <h2 className="text-xl font-semibold text-[var(--color-primary)]">Activity distribution</h2>
              {dashboard.totalStudents === 0 ? <div className="mt-5"><EmptyState title="No student data yet">Students will appear here after registration.</EmptyState></div> : <div className="mt-5"><Doughnut data={styleChart} /></div>}
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">Teaching-style distribution needs a dedicated backend aggregate; current chart shows student activity coverage.</p>
            </Card>
          </div>
        </>
      ) : null}
    </section>
  )
}
