import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../api/endpoints'
import type { ApiResponse } from '../types/api'
import type { StudentProfileDto, UpdateStudentProfileRequest } from '../types/settings'

export const studentProfileService = {
  async getMine(signal?: AbortSignal) {
    const response = await apiClient.get<ApiResponse<StudentProfileDto>>(
      API_ENDPOINTS.profile.me,
      { signal },
    )

    return response.data.data
  },

  async updateMine(request: UpdateStudentProfileRequest) {
    const response = await apiClient.put<ApiResponse<StudentProfileDto>>(
      API_ENDPOINTS.profile.me,
      request,
    )

    return response.data.data
  },
}
