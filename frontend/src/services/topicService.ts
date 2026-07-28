import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../api/endpoints'
import type { ApiResponse } from '../types/api'
import type { TopicDto } from '../types/learningModules'

export const topicService = {
  async getTopics(signal?: AbortSignal) {
    const response = await apiClient.get<ApiResponse<TopicDto[]>>(API_ENDPOINTS.topics.list, {
      signal,
    })

    return response.data.data
  },
}
