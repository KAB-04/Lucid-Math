import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../api/endpoints'
import type { ApiResponse } from '../types/api'
import type { AiTutorMessageResponse } from '../types/tutor'

export const aiTutorService = {
  async sendMessage(message: string) {
    const response = await apiClient.post<ApiResponse<AiTutorMessageResponse>>(
      API_ENDPOINTS.aiTutor.message,
      { message },
    )

    return response.data.data
  },
}
