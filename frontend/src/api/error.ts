import axios, { type AxiosError } from 'axios'
import type { FrontendApiError } from '../types/api'

interface ProblemDetails {
  title?: string
  detail?: string
  message?: string
  Message?: string
  errors?: Record<string, string[] | string>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const collectErrors = (errors: ProblemDetails['errors']) => {
  if (!errors) {
    return []
  }

  return Object.values(errors).flatMap((value) =>
    Array.isArray(value) ? value : [value],
  )
}

const parsePayload = (payload: unknown) => {
  if (typeof payload === 'string') {
    return { message: payload, details: [payload] }
  }

  if (!isRecord(payload)) {
    return { message: 'An unexpected error occurred.', details: [] }
  }

  const problem = payload as ProblemDetails
  const details = collectErrors(problem.errors)
  const message =
    problem.message ??
    problem.Message ??
    problem.title ??
    problem.detail ??
    details[0] ??
    'The request could not be completed.'

  return { message, details }
}

export const normalizeApiError = (error: unknown): FrontendApiError => {
  if (!axios.isAxiosError(error)) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
    return {
      message,
      details: [message],
      isNetworkError: false,
      isUnauthorized: false,
      isForbidden: false,
    }
  }

  const axiosError = error as AxiosError<unknown>
  const status = axiosError.response?.status

  if (!axiosError.response) {
    const message = axiosError.code === 'ECONNABORTED'
      ? 'The request timed out. Please try again.'
      : 'Unable to reach the Lucid Math API. Check that the backend is running.'

    return {
      status,
      message,
      details: [message],
      isNetworkError: true,
      isUnauthorized: false,
      isForbidden: false,
    }
  }

  const parsed = parsePayload(axiosError.response.data)

  return {
    status,
    message: parsed.message,
    details: parsed.details.length > 0 ? parsed.details : [parsed.message],
    isNetworkError: false,
    isUnauthorized: status === 401,
    isForbidden: status === 403,
  }
}
