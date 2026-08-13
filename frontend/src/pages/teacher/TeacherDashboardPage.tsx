import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, ClipboardList, HelpCircle, Plus, Users } from 'lucide-react'
import { normalizeApiError } from '../../api/error'
import { AdminMetricCard } from '../../components/admin/AdminMetricCard'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { adminService } from '../../services/adminService'
import type { FrontendApiError } from '../../types/api'
import type { AdminDashboardDto } from '../../types/admin'
import { formatDateTime, formatPercent } from '../../utils/format'

export const TeacherDashboardPage = () => {
  const { role, roleDisplayName, user } = useAuth()
  const [dashboard, setDashboard] = useState<AdminDashboardDto | null>(null)
  const [error, setError] = useState<FrontendApiError | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadDashboard = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)

    try {
      setDashboard(await adminService.getDashboard(signal))
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
    void loadDashboard(controller.signal)
    return () => controller.abort()
  }, [loadDashboard])

  return (
    <section className="grid gap-6">
      <AdminPageHeader
        actions={<Badge variant="accent">{roleDisplayName}</Badge>}
        description={`Welcome, ${user?.fullName ?? 'teacher'}. Review learner progress and manage Lucid content.`}
        title="Teacher dashboard"
      />

      <Alert title="Role mapping">
        This user interface says Teacher, while authorization continues to use the backend role value{' '}
        <strong>{role}</strong>.
      </Alert>

      {isLoading ? <LoadingSpinner label="Loading teacher dashboard" /> : null}

      {error ? (
        <Alert title="Teacher metrics unavailable" variant="danger">
          {error.message}
          <div className="mt-3">
            <Button onClick={() => void loadDashboard()}>Retry</Button>
          </div>
        </Alert>
      ) : null}

      {dashboard ? (
        <>
          <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AdminMetricCard icon={<Users className="h-5 w-5" />} label="Total students" value={dashboard.totalStudents} />
            <AdminMetricCard icon={<ClipboardList className="h-5 w-5" />} label="Completed assessments" value={dashboard.totalCompletedAssessments} />
            <AdminMetricCard icon={<HelpCircle className="h-5 w-5" />} label="Total questions" value={dashboard.totalQuestions} />
            <AdminMetricCard icon={<BarChart3 className="h-5 w-5" />} label="Average score" value={formatPercent(dashboard.averageStudentScore)} />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <h2 className="text-xl font-semibold text-[var(--color-primary)]">Recent assessment activity</h2>
              {dashboard.recentAssessments.length === 0 ? (
                <div className="mt-5">
                  <EmptyState title="No completed assessments yet">
                    Recent submissions will appear after students complete assessments.
                  </EmptyState>
                </div>
              ) : (
                <div className="mt-5 grid gap-3">
                  {dashboard.recentAssessments.map((assessment) => (
                    <div className="rounded-md border border-[var(--color-border)] bg-white/65 p-4" key={assessment.id}>
                      <p className="font-semibold text-[var(--color-primary)]">{assessment.studentName || 'Student'}</p>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        {formatPercent(assessment.percentageScore)} · {assessment.totalQuestions} questions · {formatDateTime(assessment.dateTaken)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <h2 className="text-xl font-semibold text-[var(--color-primary)]">Quick actions</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ['Add student', APP_ROUTES.teacher.students],
                  ['Create assessment', APP_ROUTES.teacher.assessments],
                  ['Add question', APP_ROUTES.teacher.questions],
                  ['View analytics', APP_ROUTES.teacher.analytics],
                ].map(([label, path]) => (
                  <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--color-border)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] hover:bg-white" key={label} to={path}>
                    <Plus className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </>
      ) : null}
    </section>
  )
}
