export const APP_ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  unauthorized: '/unauthorized',
  student: {
    dashboard: '/student/dashboard',
    topics: '/student/topics',
    assessments: '/student/assessments',
    learnerProfile: '/student/learner-profile',
    learningHistory: '/student/learning-history',
    aiTutor: '/student/ai-tutor',
    settings: '/student/settings',
  },
  teacher: {
    dashboard: '/teacher/dashboard',
    topics: '/teacher/topics',
    questions: '/teacher/questions',
    assessments: '/teacher/assessments',
    students: '/teacher/students',
    analytics: '/teacher/analytics',
    settings: '/teacher/settings',
  },
} as const
