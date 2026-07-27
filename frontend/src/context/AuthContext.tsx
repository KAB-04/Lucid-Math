import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'react-hot-toast'
import { normalizeApiError } from '../api/error'
import { authService } from '../services/authService'
import type { AuthRole, AuthUser, LoginRequest, RegisterRequest } from '../types/auth'
import { getRoleDisplayName } from '../types/auth'
import { sessionStorageService } from '../utils/session'
import { AuthContext, type AuthContextValue } from './authContextValue'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const restoredSession = sessionStorageService.restoreSession()

    if (restoredSession) {
      setToken(restoredSession.token)
      setUser(restoredSession.user)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    const handleExpiredSession = () => {
      setToken(null)
      setUser(null)
      toast.error('Your session expired. Please sign in again.')
    }

    window.addEventListener('lucid:session-expired', handleExpiredSession)
    return () => window.removeEventListener('lucid:session-expired', handleExpiredSession)
  }, [])

  const persistAuth = useCallback((nextToken: string, nextUser: AuthUser) => {
    sessionStorageService.saveToken(nextToken)
    sessionStorageService.saveUser(nextUser)
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const login = useCallback(
    async (request: LoginRequest) => {
      try {
        const result = await authService.login(request)
        persistAuth(result.token, result.user)
        return result.user
      } catch (error) {
        throw normalizeApiError(error)
      }
    },
    [persistAuth],
  )

  const register = useCallback(
    async (request: RegisterRequest) => {
      try {
        const result = await authService.register(request)
        persistAuth(result.token, result.user)
        return result.user
      } catch (error) {
        throw normalizeApiError(error)
      }
    },
    [persistAuth],
  )

  const logout = useCallback(() => {
    sessionStorageService.clearSession()
    setToken(null)
    setUser(null)
  }, [])

  const hasRole = useCallback(
    (roles: AuthRole | AuthRole[]) => {
      if (!user) {
        return false
      }

      return Array.isArray(roles) ? roles.includes(user.role) : user.role === roles
    },
    [user],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      role: user?.role ?? null,
      roleDisplayName: user ? getRoleDisplayName(user.role) : null,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      register,
      logout,
      hasRole,
    }),
    [hasRole, isLoading, login, logout, register, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
