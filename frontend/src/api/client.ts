import axios from 'axios'
import { APP_ROUTES } from '../constants/routes'
import { sessionStorageService } from '../utils/session'
import { getApiBaseUrl } from '../utils/env'

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = sessionStorageService.getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const currentPath = `${window.location.pathname}${window.location.search}`
      const isAuthRoute =
        window.location.pathname === APP_ROUTES.login ||
        window.location.pathname === APP_ROUTES.register

      if (!isAuthRoute) {
        sessionStorageService.clearSession()
        const returnTo = encodeURIComponent(currentPath)
        window.history.replaceState(null, '', `${APP_ROUTES.login}?returnTo=${returnTo}`)
        window.dispatchEvent(new CustomEvent('lucid:session-expired'))
      }
    }

    return Promise.reject(error)
  },
)
