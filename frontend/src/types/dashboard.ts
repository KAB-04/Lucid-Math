export interface StudentDashboardDto {
  student: {
    id: number
    fullName: string
    email: string
    educationLevel: string
  }
  completedAssessments: number
  averageScore: number
  latestScore: number
  strongestTopic: string
  weakestTopic: string
  recommendedNextTopic: string
  recentHistory: DashboardRecentHistoryDto[]
  progress: AssessmentProgressDto[]
}

export interface DashboardRecentHistoryDto {
  activity: string
  eventType: string
  performance: number
  dateCompleted: string
  assessmentId: number | null
  topicId: number | null
}

export interface AssessmentProgressDto {
  id: number
  date: string | null
  score: number
}

export interface LearnerProfileDto {
  studentId: number
  overallMasteryPercentage: number
  strongestTopic: string
  weakestTopic: string
  recommendedDifficultyLevel: number
  recommendedNextTopic: string
  teachingApproach: string
  lastUpdated: string | null
}

export interface LearningHistoryDto {
  id: number
  activity: string
  eventType: string
  performance: number
  dateCompleted: string
  topicId: number | null
  topicName: string
  assessmentId: number | null
}

export interface AssessmentHistoryDto {
  id: number
  startedAt: string
  dateTaken: string | null
  isCompleted: boolean
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  percentageScore: number
  topicId: number | null
  difficultyLevel: number | null
}

export type PerformanceStatus = 'Foundation' | 'Developing' | 'Proficient'

export interface DashboardSummary {
  completedAssessments: number
  averageScore: number | null
  latestScore: number | null
  overallMasteryPercentage: number | null
}

export interface Recommendation {
  hasRecommendation: boolean
  nextTopic: string
  difficultyLevel: number | null
  teachingApproach: string
  weakestTopic: string
}

export interface TopicPerformance {
  topicName: string
  masteryPercentage: number | null
  status: PerformanceStatus
  source: 'learner-profile'
}

export interface RecentActivity {
  id: string
  activity: string
  eventType: string
  performance: number | null
  dateCompleted: string
  topicName: string
  assessmentId: number | null
}

export interface StudentDashboardViewModel {
  student: StudentDashboardDto['student']
  summary: DashboardSummary
  recommendation: Recommendation
  topicPerformance: TopicPerformance[]
  progress: AssessmentProgressDto[]
  recentActivities: RecentActivity[]
  assessments: AssessmentHistoryDto[]
  strongestTopic: string
  weakestTopic: string
  hasLearnerProfile: boolean
}
