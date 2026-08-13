import { Navigate, Route, Routes } from 'react-router-dom'
import { APP_ROUTES } from '../constants/routes'
import { AuthLayout } from '../layouts/AuthLayout'
import { StudentLayout } from '../layouts/StudentLayout'
import { TeacherLayout } from '../layouts/TeacherLayout'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { UnauthorizedPage } from '../pages/UnauthorizedPage'
import { StudentDashboardPage } from '../pages/student/StudentDashboardPage'
import { TopicsPage } from '../pages/student/TopicsPage'
import { AssessmentsPage } from '../pages/student/AssessmentsPage'
import { AssessmentTakePage } from '../pages/student/AssessmentTakePage'
import { AssessmentResultPage } from '../pages/student/AssessmentResultPage'
import { AiTutorPage } from '../pages/student/AiTutorPage'
import { LearnerProfilePage } from '../pages/student/LearnerProfilePage'
import { LearningHistoryPage } from '../pages/student/LearningHistoryPage'
import { SettingsPage } from '../pages/student/SettingsPage'
import { TeacherDashboardPage } from '../pages/teacher/TeacherDashboardPage'
import { TeacherAnalyticsPage } from '../pages/teacher/TeacherAnalyticsPage'
import { TeacherAssessmentsPage } from '../pages/teacher/TeacherAssessmentsPage'
import { TeacherQuestionsPage } from '../pages/teacher/TeacherQuestionsPage'
import { TeacherSettingsPage } from '../pages/teacher/TeacherSettingsPage'
import { TeacherStudentsPage } from '../pages/teacher/TeacherStudentsPage'
import { ComingSoonPage } from '../pages/ComingSoonPage'
import { ProtectedRoute, PublicRoute } from './routeGuards'

export const AppRoutes = () => (
  <Routes>
    <Route path={APP_ROUTES.home} element={<HomePage />} />
    <Route element={<PublicRoute />}>
      <Route element={<AuthLayout />}>
        <Route path={APP_ROUTES.login} element={<LoginPage />} />
        <Route path={APP_ROUTES.register} element={<RegisterPage />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to={APP_ROUTES.student.dashboard} replace />} />
        <Route path="dashboard" element={<StudentDashboardPage />} />
        <Route path="topics" element={<TopicsPage />} />
        <Route path="assessments" element={<AssessmentsPage />} />
        <Route path="assessments/:assessmentId" element={<AssessmentTakePage />} />
        <Route path="assessments/:assessmentId/result" element={<AssessmentResultPage />} />
        <Route path="learner-profile" element={<LearnerProfilePage />} />
        <Route path="learning-history" element={<LearningHistoryPage />} />
        <Route path="ai-tutor" element={<AiTutorPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
      <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<Navigate to={APP_ROUTES.teacher.dashboard} replace />} />
        <Route path="dashboard" element={<TeacherDashboardPage />} />
        <Route path="topics" element={<ComingSoonPage title="Topics" />} />
        <Route path="questions" element={<TeacherQuestionsPage />} />
        <Route path="assessments" element={<TeacherAssessmentsPage />} />
        <Route path="students" element={<TeacherStudentsPage />} />
        <Route path="analytics" element={<TeacherAnalyticsPage />} />
        <Route path="settings" element={<TeacherSettingsPage />} />
      </Route>
    </Route>
    <Route path={APP_ROUTES.unauthorized} element={<UnauthorizedPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
)
