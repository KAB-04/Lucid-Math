import type { AuthRole, AuthUser, JwtClaims } from '../types/auth'

const ROLE_CLAIM =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' as const
const NAME_CLAIM =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name' as const

const isAuthRole = (value: unknown): value is AuthRole =>
  value === 'Student' || value === 'Admin'

export const decodeJwtPayload = (token: string): JwtClaims | null => {
  const [, payload] = token.split('.')

  if (!payload) {
    return null
  }

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      window
        .atob(normalizedPayload)
        .split('')
        .map((character) => `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    )

    return JSON.parse(json) as JwtClaims
  } catch {
    return null
  }
}

export const isTokenExpired = (token: string) => {
  const claims = decodeJwtPayload(token)

  if (!claims?.exp) {
    return true
  }

  return claims.exp * 1000 <= Date.now()
}

export const mapTokenToAuthUser = (token: string): AuthUser | null => {
  const claims = decodeJwtPayload(token)

  if (!claims) {
    return null
  }

  const rawRole = claims[ROLE_CLAIM]
  const role = Array.isArray(rawRole) ? rawRole.find(isAuthRole) : rawRole

  if (!isAuthRole(role) || !claims.sub || !claims.email) {
    return null
  }

  return {
    userId: claims.sub,
    email: claims.email,
    fullName: claims[NAME_CLAIM] ?? claims.email,
    role,
  }
}
