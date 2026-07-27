import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../constants/routes'
import { Card } from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'
import { getDashboardRouteForRole } from '../utils/authRoutes'

export const UnauthorizedPage = () => {
  const { role } = useAuth()
  const dashboardRoute = role ? getDashboardRouteForRole(role) : APP_ROUTES.login

  return (
    <main className="grid min-h-svh place-items-center bg-[var(--color-background)] p-5">
      <Card className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-[var(--color-primary)]">Access denied</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
          Your account does not have permission to open that workspace.
        </p>
        <Link
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
          to={dashboardRoute}
        >
          Return to dashboard
        </Link>
      </Card>
    </main>
  )
}
