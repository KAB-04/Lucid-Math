import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../api/endpoints'
import type { ApiResponse } from '../types/api'
import type {
  AdminAssessmentDto,
  AdminDashboardDto,
  AdminStudentDto,
  QuestionDto,
  QuestionFormRequest,
} from '../types/admin'

export const adminService = {
  async getDashboard(signal?: AbortSignal) {
    const response = await apiClient.get<ApiResponse<AdminDashboardDto>>(
      API_ENDPOINTS.dashboard.admin,
      { signal },
    )

    return response.data.data
  },

  async getStudents(signal?: AbortSignal) {
    const response = await apiClient.get<AdminStudentDto[]>(
      API_ENDPOINTS.students.list,
      { signal },
    )

    return response.data
  },

  async getStudent(id: number, signal?: AbortSignal) {
    const response = await apiClient.get<AdminStudentDto>(
      API_ENDPOINTS.students.byId(id),
      { signal },
    )

    return response.data
  },

  async getLearnerProfile(studentId: number, signal?: AbortSignal) {
    const response = await apiClient.get(
      API_ENDPOINTS.learnerProfile.byStudent(studentId),
      { signal },
    )

    return response.data.data
  },

  async getAssessments(signal?: AbortSignal) {
    const response = await apiClient.get<ApiResponse<AdminAssessmentDto[]>>(
      API_ENDPOINTS.assessments.adminList,
      { params: { page: 1, pageSize: 100 }, signal },
    )

    return response.data.data
  },

  async getQuestions(signal?: AbortSignal) {
    const response = await apiClient.get<ApiResponse<QuestionDto[]>>(
      API_ENDPOINTS.questions.list,
      { signal },
    )

    return response.data.data
  },

  async createQuestion(request: QuestionFormRequest) {
    const response = await apiClient.post<ApiResponse<QuestionDto>>(
      API_ENDPOINTS.questions.list,
      request,
    )

    return response.data.data
  },

  async updateQuestion(id: number, request: QuestionFormRequest) {
    const response = await apiClient.put<ApiResponse<QuestionDto>>(
      API_ENDPOINTS.questions.byId(id),
      request,
    )

    return response.data.data
  },

  async deleteQuestion(id: number) {
    await apiClient.delete(API_ENDPOINTS.questions.byId(id))
  },
}
