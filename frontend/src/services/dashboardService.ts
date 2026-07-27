import { API_ENDPOINTS } from '../api/endpoints'
import { apiClient } from '../api/client'
import type { ApiResponse } from '../types/api'
import type {
  AssessmentHistoryDto,
  LearnerProfileDto,
  LearningHistoryDto,
  PerformanceStatus,
  RecentActivity,
  StudentDashboardDto,
  StudentDashboardViewModel,
  TopicPerformance,
} from '../types/dashboard'

const emptyText = ''

const hasText = (value: string | null | undefined) => Boolean(value?.trim())

const getPerformanceStatus = (score: number | null): PerformanceStatus => {
  if (score === null || score < 40) {
    return 'Foundation'
  }

  if (score < 70) {
    return 'Developing'
  }

  return 'Proficient'
}

const mapTopicPerformance = (
  profile: LearnerProfileDto,
  completedAssessments: number,
): TopicPerformance[] => {
  if (completedAssessments === 0 || !hasText(profile.strongestTopic) && !hasText(profile.weakestTopic)) {
    return []
  }

  const topics: TopicPerformance[] = []

  if (hasText(profile.weakestTopic)) {
    topics.push({
      topicName: profile.weakestTopic,
      masteryPercentage: profile.overallMasteryPercentage,
      status: getPerformanceStatus(profile.overallMasteryPercentage),
      source: 'learner-profile',
    })
  }

  if (hasText(profile.strongestTopic) && profile.strongestTopic !== profile.weakestTopic) {
    topics.push({
      topicName: profile.strongestTopic,
      masteryPercentage: profile.overallMasteryPercentage,
      status: getPerformanceStatus(profile.overallMasteryPercentage),
      source: 'learner-profile',
    })
  }

  return topics
}

const mapRecentActivities = (
  dashboardHistory: StudentDashboardDto['recentHistory'],
  learningHistory: LearningHistoryDto[],
): RecentActivity[] => {
  if (learningHistory.length > 0) {
    return learningHistory.map((activity) => ({
      id: String(activity.id),
      activity: activity.activity,
      eventType: activity.eventType,
      performance: activity.performance,
      dateCompleted: activity.dateCompleted,
      topicName: activity.topicName,
      assessmentId: activity.assessmentId,
    }))
  }

  return dashboardHistory.map((activity, index) => ({
    id: `${activity.eventType}-${activity.dateCompleted}-${index}`,
    activity: activity.activity,
    eventType: activity.eventType,
    performance: activity.performance,
    dateCompleted: activity.dateCompleted,
    topicName: emptyText,
    assessmentId: activity.assessmentId,
  }))
}

const mapDashboardViewModel = (
  dashboard: StudentDashboardDto,
  profile: LearnerProfileDto,
  learningHistory: LearningHistoryDto[],
  assessments: AssessmentHistoryDto[],
): StudentDashboardViewModel => {
  const completedAssessments = dashboard.completedAssessments
  const hasCompletedAssessments = completedAssessments > 0
  const hasLearnerProfile =
    hasCompletedAssessments ||
    hasText(profile.strongestTopic) ||
    hasText(profile.weakestTopic) ||
    hasText(profile.recommendedNextTopic)

  return {
    student: dashboard.student,
    summary: {
      completedAssessments,
      averageScore: hasCompletedAssessments ? dashboard.averageScore : null,
      latestScore: hasCompletedAssessments ? dashboard.latestScore : null,
      overallMasteryPercentage: hasLearnerProfile ? profile.overallMasteryPercentage : null,
    },
    recommendation: {
      hasRecommendation: hasText(profile.recommendedNextTopic) || hasText(dashboard.recommendedNextTopic),
      nextTopic: profile.recommendedNextTopic || dashboard.recommendedNextTopic,
      difficultyLevel: hasLearnerProfile ? profile.recommendedDifficultyLevel : null,
      teachingApproach: profile.teachingApproach,
      weakestTopic: profile.weakestTopic || dashboard.weakestTopic,
    },
    topicPerformance: mapTopicPerformance(profile, completedAssessments),
    progress: dashboard.progress.filter((item) => item.date !== null),
    recentActivities: mapRecentActivities(dashboard.recentHistory, learningHistory),
    assessments,
    strongestTopic: profile.strongestTopic || dashboard.strongestTopic,
    weakestTopic: profile.weakestTopic || dashboard.weakestTopic,
    hasLearnerProfile,
  }
}

export const dashboardService = {
  async getStudentDashboard(signal?: AbortSignal) {
    const [dashboardResponse, profileResponse, learningHistoryResponse, assessmentHistoryResponse] =
      await Promise.all([
        apiClient.get<ApiResponse<StudentDashboardDto>>(API_ENDPOINTS.dashboard.student, { signal }),
        apiClient.get<ApiResponse<LearnerProfileDto>>(API_ENDPOINTS.learnerProfile.me, { signal }),
        apiClient.get<ApiResponse<LearningHistoryDto[]>>(API_ENDPOINTS.learningHistory.me, {
          params: { page: 1, pageSize: 5 },
          signal,
        }),
        apiClient.get<ApiResponse<AssessmentHistoryDto[]>>(API_ENDPOINTS.assessments.myHistory, { signal }),
      ])

    return mapDashboardViewModel(
      dashboardResponse.data.data,
      profileResponse.data.data,
      learningHistoryResponse.data.data,
      assessmentHistoryResponse.data.data,
    )
  },
}
