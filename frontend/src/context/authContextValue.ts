import { createContext } from 'react'
import type { AuthRole, AuthUser, LoginRequest, RegisterRequest } from '../types/auth'

export interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  role: AuthRole | null
  roleDisplayName: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (request: LoginRequest) => Promise<AuthUser>
  register: (request: RegisterRequest) => Promise<AuthUser>
  logout: () => void
  hasRole: (roles: AuthRole | AuthRole[]) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
