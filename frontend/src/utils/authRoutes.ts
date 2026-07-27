import { APP_ROUTES } from '../constants/routes'
import type { AuthRole } from '../types/auth'

export const getDashboardRouteForRole = (role: AuthRole) =>
  role === 'Admin' ? APP_ROUTES.teacher.dashboard : APP_ROUTES.student.dashboard
