export interface TopicDto {
  id: number
  name: string
  description: string
  difficultyLevel: string
}

export interface SafeAssessmentQuestionDto {
  id: number
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  difficultyLevel: number
  topicId: number
  topicName: string
}

export interface StartAssessmentRequest {
  TopicId?: number
  DifficultyLevel?: number
  QuestionCount: number
}

export interface StartAssessmentDto {
  id: number
  totalQuestions: number
  questions: SafeAssessmentQuestionDto[]
}

export interface AssessmentAvailabilityDto {
  topicId: number
  difficultyLevel: number
  questionCount: number
}

export interface SubmitAssessmentRequest {
  Answers: SubmitAnswerRequest[]
}

export interface SubmitAnswerRequest {
  QuestionId: number
  SelectedAnswer: string
}

export interface SubmittedAnswerDto {
  id: number
  questionText: string
  selectedAnswer: string
  correctAnswer: string
  isCorrect: boolean
  explanation: string
  topicId: number
  topicName: string
  difficultyLevel: number
}

export interface AssessmentResultDto {
  id: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  percentageScore: number
  isCompleted: boolean
  submittedAt?: string
  answers: SubmittedAnswerDto[]
}

export interface AssessmentSummaryAnswerDto {
  questionId: number
  questionText: string
  selectedAnswer: string
  isCorrect: boolean
  topicId: number | null
  topicName: string
  difficultyLevel: number | null
}

export interface AssessmentSummaryDto {
  id: number
  studentId: number
  studentName: string
  startedAt: string
  dateTaken: string | null
  isCompleted: boolean
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  percentageScore: number
  answers: AssessmentSummaryAnswerDto[]
}
