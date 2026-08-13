export interface AdminDashboardDto {
  totalStudents: number
  totalTopics: number
  totalQuestions: number
  totalCompletedAssessments: number
  averageStudentScore: number
  mostDifficultTopic: AdminTopicPerformanceDto | null
  mostActiveStudents: AdminActiveStudentDto[]
  recentAssessments: AdminRecentAssessmentDto[]
  topicPerformance: AdminTopicPerformanceDto[]
}

export interface AdminTopicPerformanceDto {
  topicId: number
  topicName: string
  totalAnswers: number
  correctAnswers: number
  averageScore: number
}

export interface AdminActiveStudentDto {
  studentId: number
  studentName: string
  completedAssessments: number
  averageScore: number
}

export interface AdminRecentAssessmentDto {
  id: number
  studentName: string
  percentageScore: number
  totalQuestions: number
  dateTaken: string
}

export interface AdminStudentDto {
  id: number
  fullName: string
  email: string
  educationLevel: string
  createdAt: string
}

export interface AdminAssessmentDto {
  id: number
  studentId: number
  studentName: string
  isCompleted: boolean
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  percentageScore: number
  topicId: number | null
  difficultyLevel: number | null
  startedAt: string
  dateTaken: string | null
}

export interface QuestionDto {
  id: number
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  explanation: string
  difficultyLevel: number
  topicId: number
  topicName: string
}

export interface QuestionFormRequest {
  QuestionText: string
  OptionA: string
  OptionB: string
  OptionC: string
  OptionD: string
  CorrectAnswer: string
  Explanation: string
  DifficultyLevel: number
  TopicId: number
}
