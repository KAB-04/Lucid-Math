import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../api/endpoints'
import type { ApiResponse } from '../types/api'
import type { LearningHistoryDto } from '../types/dashboard'

export const learningHistoryService = {
  async getMine(signal?: AbortSignal) {
    const response = await apiClient.get<ApiResponse<LearningHistoryDto[]>>(
      API_ENDPOINTS.learningHistory.me,
      {
        params: { page: 1, pageSize: 25 },
        signal,
      },
    )

    return response.data.data
  },
}
