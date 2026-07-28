import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../api/endpoints'
import type { ApiResponse } from '../types/api'
import type {
  AssessmentAvailabilityDto,
  AssessmentResultDto,
  AssessmentSummaryDto,
  StartAssessmentDto,
  StartAssessmentRequest,
  SubmitAssessmentRequest,
} from '../types/learningModules'

export const assessmentService = {
  async getAvailability(signal?: AbortSignal) {
    const response = await apiClient.get<ApiResponse<AssessmentAvailabilityDto[]>>(
      API_ENDPOINTS.assessments.availability,
      { signal },
    )

    return response.data.data
  },

  async startAssessment(request: StartAssessmentRequest) {
    const response = await apiClient.post<ApiResponse<StartAssessmentDto>>(
      API_ENDPOINTS.assessments.start,
      request,
    )

    return response.data.data
  },

  async submitAssessment(assessmentId: number, request: SubmitAssessmentRequest) {
    const response = await apiClient.post<ApiResponse<AssessmentResultDto>>(
      API_ENDPOINTS.assessments.submit(assessmentId),
      request,
    )

    return response.data.data
  },

  async getAssessment(assessmentId: number, signal?: AbortSignal) {
    const response = await apiClient.get<ApiResponse<AssessmentSummaryDto>>(
      API_ENDPOINTS.assessments.byId(assessmentId),
      { signal },
    )

    return response.data.data
  },
}
