export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ApiMessageResponse {
  success: boolean
  message: string
}

export interface FrontendApiError {
  status?: number
  message: string
  details: string[]
  isNetworkError: boolean
  isUnauthorized: boolean
  isForbidden: boolean
}
