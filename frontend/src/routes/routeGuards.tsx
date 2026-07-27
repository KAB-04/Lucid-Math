import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { APP_ROUTES } from '../constants/routes'
import { PageLoader } from '../components/ui/PageLoader'
import type { AuthRole } from '../types/auth'
import { useAuth } from '../hooks/useAuth'
import { getDashboardRouteForRole } from '../utils/authRoutes'

export const PublicRoute = () => {
  const { isAuthenticated, isLoading, role } = useAuth()

  if (isLoading) {
    return <PageLoader label="Restoring your session" />
  }

  if (isAuthenticated && role) {
    return <Navigate to={getDashboardRouteForRole(role)} replace />
  }

  return <Outlet />
}

interface ProtectedRouteProps {
  allowedRoles?: AuthRole[]
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <PageLoader label="Checking your session" />
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={APP_ROUTES.login}
        replace
        state={{ returnTo: `${location.pathname}${location.search}` }}
      />
    )
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to={APP_ROUTES.unauthorized} replace />
  }

  return <Outlet />
}
