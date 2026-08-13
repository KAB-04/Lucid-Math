export type TutorMessageRole = 'tutor' | 'student'

export interface TutorMessage {
  id: string
  role: TutorMessageRole
  content: string
  timestamp: string
}

export interface TutorLearningContext {
  currentTopic: string
  currentLevel: string
  teachingStyle: string
}

export interface AiTutorMessageRequest {
  message: string
}

export interface AiTutorMessageResponse {
  reply: string
}
