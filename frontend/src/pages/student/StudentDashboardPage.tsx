import { Activity, BookMarked, ClipboardCheck } from 'lucide-react'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { useAuth } from '../../hooks/useAuth'

export const StudentDashboardPage = () => {
  const { roleDisplayName, user } = useAuth()

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
            Student dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">
            Hello, {user?.fullName ?? 'student'}
          </h1>
        </div>
        <Badge variant="accent">{roleDisplayName}</Badge>
      </div>

      <Alert title="Backend route ready">
        Student dashboard data should be loaded from <strong>GET /api/dashboard/student</strong> in the next UI phase.
      </Alert>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <BookMarked className="h-6 w-6 text-[var(--color-primary)]" />
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">Topics</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--color-primary)]">Connected later</p>
        </Card>
        <Card>
          <ClipboardCheck className="h-6 w-6 text-[var(--color-primary)]" />
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">Assessments</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--color-primary)]">No fake data</p>
        </Card>
        <Card>
          <Activity className="h-6 w-6 text-[var(--color-primary)]" />
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">Progress</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--color-primary)]">Awaiting API UI</p>
        </Card>
      </div>

      <EmptyState title="Dashboard data is not mocked">
        This foundation page demonstrates the layout and protected routing without inventing learning metrics.
      </EmptyState>
    </section>
  )
}
