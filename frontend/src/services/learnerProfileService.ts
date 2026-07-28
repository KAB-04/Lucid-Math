import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../api/endpoints'
import type { ApiResponse } from '../types/api'
import type { LearnerProfileDto } from '../types/dashboard'

export const learnerProfileService = {
  async getMine(signal?: AbortSignal) {
    const response = await apiClient.get<ApiResponse<LearnerProfileDto>>(
      API_ENDPOINTS.learnerProfile.me,
      { signal },
    )

    return response.data.data
  },
}
