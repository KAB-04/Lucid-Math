import { BarChart3, ClipboardList, Users } from 'lucide-react'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { useAuth } from '../../hooks/useAuth'

export const TeacherDashboardPage = () => {
  const { role, roleDisplayName, user } = useAuth()

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
            Teacher dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">
            Welcome, {user?.fullName ?? 'teacher'}
          </h1>
        </div>
        <Badge variant="accent">{roleDisplayName}</Badge>
      </div>

      <Alert title="Role mapping">
        This user interface says Teacher, while authorization continues to use the backend role value{' '}
        <strong>{role}</strong>.
      </Alert>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <Users className="h-6 w-6 text-[var(--color-primary)]" />
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">Students</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--color-primary)]">API next</p>
        </Card>
        <Card>
          <ClipboardList className="h-6 w-6 text-[var(--color-primary)]" />
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">Assessments</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--color-primary)]">No mock totals</p>
        </Card>
        <Card>
          <BarChart3 className="h-6 w-6 text-[var(--color-primary)]" />
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">Analytics</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--color-primary)]">Ready route</p>
        </Card>
      </div>

      <EmptyState title="Teacher metrics are intentionally empty">
        The final dashboard should read from <strong>GET /api/dashboard/admin</strong>, preserving the Admin API role.
      </EmptyState>
    </section>
  )
}
