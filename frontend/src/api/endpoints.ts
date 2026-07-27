export const API_ENDPOINTS = {
  auth: {
    register: '/Auth/register',
    login: '/Auth/login',
  },
  profile: {
    me: '/profile/me',
  },
  topics: {
    list: '/topics',
    byId: (id: number) => `/topics/${id}`,
  },
  questions: {
    list: '/questions',
    byId: (id: number) => `/questions/${id}`,
    byTopic: (topicId: number) => `/questions/topic/${topicId}`,
  },
  assessments: {
    start: '/assessments/start',
    submit: (assessmentId: number) => `/assessments/${assessmentId}/submit`,
    byId: (assessmentId: number) => `/assessments/${assessmentId}`,
    myHistory: '/assessments/my-history',
    adminList: '/admin/assessments',
  },
  learnerProfile: {
    me: '/learner-profile/me',
    byStudent: (studentId: number) => `/learner-profile/student/${studentId}`,
  },
  learningHistory: {
    me: '/learning-history/me',
  },
  dashboard: {
    student: '/dashboard/student',
    admin: '/dashboard/admin',
  },
  students: {
    list: '/Student',
    byId: (id: number) => `/Student/${id}`,
  },
} as const
