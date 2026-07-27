import { API_ENDPOINTS } from '../api/endpoints'
import { apiClient } from '../api/client'
import type {
  AuthenticationResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '../types/auth'
import { mapTokenToAuthUser } from '../utils/jwt'

export interface AuthResult {
  response: AuthenticationResponse
  user: AuthUser
  token: string
}

const mapAuthResponse = (response: AuthenticationResponse): AuthResult => {
  const success = response.success ?? response.Success ?? false
  const token = response.token ?? response.Token ?? null
  const message = response.message ?? response.Message ?? 'Authentication failed.'

  if (!success || !token) {
    throw new Error(message)
  }

  const user = mapTokenToAuthUser(token)

  if (!user) {
    throw new Error('The authentication token did not contain the expected Lucid claims.')
  }

  return {
    response,
    user,
    token,
  }
}

export const authService = {
  async login(request: LoginRequest) {
    const { data } = await apiClient.post<AuthenticationResponse>(
      API_ENDPOINTS.auth.login,
      request,
    )

    return mapAuthResponse(data)
  },

  async register(request: RegisterRequest) {
    const { data } = await apiClient.post<AuthenticationResponse>(
      API_ENDPOINTS.auth.register,
      request,
    )

    return mapAuthResponse(data)
  },
}
