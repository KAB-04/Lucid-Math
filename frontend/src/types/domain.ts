export interface StudentProfile {
  Id: number
  FullName: string
  Email: string
  EducationLevel: string
  CreatedAt?: string
}

export interface Topic {
  Id: number
  Name: string
  Description: string
  DifficultyLevel: string
}

export interface Question {
  Id: number
  QuestionText: string
  OptionA: string
  OptionB: string
  OptionC: string
  OptionD: string
  CorrectAnswer?: string
  Explanation: string
  DifficultyLevel: number
  TopicId: number
  TopicName?: string
}
