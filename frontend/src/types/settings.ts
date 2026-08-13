export interface StudentProfileDto {
  id: number
  fullName: string
  email: string
  educationLevel: string
  createdAt?: string
}

export interface UpdateStudentProfileRequest {
  FullName: string
  EducationLevel: string
}

export interface LocalLearningPreferences {
  explanationDetail: 'Concise' | 'Balanced' | 'Detailed'
  difficultyPreference: 'Adaptive' | 'Foundation' | 'Developing' | 'Challenge'
  showHintsAutomatically: boolean
  stepByStepSolutions: boolean
  practiceReminders: boolean
}

export interface LocalNotificationSettings {
  assessmentReminders: boolean
  studyReminders: boolean
  progressUpdates: boolean
}
