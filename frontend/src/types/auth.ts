export type AuthRole = 'Student' | 'Admin'

export interface LoginRequest {
  Email: string
  Password: string
}

export interface RegisterRequest {
  FullName: string
  Email: string
  Password: string
  EducationLevel: string
}

export interface AuthenticationResponse {
  Success: boolean
  Message: string
  Token: string | null
  Expires: string
}

export interface AuthUser {
  userId: string
  email: string
  fullName: string
  role: AuthRole
}

export interface JwtClaims {
  sub?: string
  email?: string
  exp?: number
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: AuthRole | AuthRole[]
}

export const getRoleDisplayName = (role: AuthRole) =>
  role === 'Admin' ? 'Teacher' : 'Student'
