import type { SafeAssessmentQuestionDto, StartAssessmentDto } from '../types/learningModules'

const getAssessmentStorageKey = (assessmentId: number) => `lucid.assessment.${assessmentId}`

export interface StoredAssessment {
  assessmentId: number
  totalQuestions: number
  questions: SafeAssessmentQuestionDto[]
}

export const assessmentSession = {
  save(startedAssessment: StartAssessmentDto) {
    const storedAssessment: StoredAssessment = {
      assessmentId: startedAssessment.id,
      totalQuestions: startedAssessment.totalQuestions,
      questions: startedAssessment.questions,
    }

    sessionStorage.setItem(
      getAssessmentStorageKey(startedAssessment.id),
      JSON.stringify(storedAssessment),
    )
  },

  get(assessmentId: number) {
    const rawAssessment = sessionStorage.getItem(getAssessmentStorageKey(assessmentId))

    if (!rawAssessment) {
      return null
    }

    try {
      return JSON.parse(rawAssessment) as StoredAssessment
    } catch {
      this.clear(assessmentId)
      return null
    }
  },

  clear(assessmentId: number) {
    sessionStorage.removeItem(getAssessmentStorageKey(assessmentId))
  },
}
