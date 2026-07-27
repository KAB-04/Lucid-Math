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
import { TeacherDashboardPage } from '../pages/teacher/TeacherDashboardPage'
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
        <Route path="topics" element={<ComingSoonPage title="Topics" />} />
        <Route path="assessments" element={<ComingSoonPage title="Assessments" />} />
        <Route path="learner-profile" element={<ComingSoonPage title="Learner Profile" />} />
        <Route path="learning-history" element={<ComingSoonPage title="Learning History" />} />
        <Route path="ai-tutor" element={<ComingSoonPage title="AI Tutor" />} />
        <Route path="settings" element={<ComingSoonPage title="Settings" />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
      <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<Navigate to={APP_ROUTES.teacher.dashboard} replace />} />
        <Route path="dashboard" element={<TeacherDashboardPage />} />
        <Route path="topics" element={<ComingSoonPage title="Topics" />} />
        <Route path="questions" element={<ComingSoonPage title="Questions" />} />
        <Route path="assessments" element={<ComingSoonPage title="Assessments" />} />
        <Route path="students" element={<ComingSoonPage title="Students" />} />
        <Route path="analytics" element={<ComingSoonPage title="Analytics" />} />
        <Route path="settings" element={<ComingSoonPage title="Settings" />} />
      </Route>
    </Route>
    <Route path={APP_ROUTES.unauthorized} element={<UnauthorizedPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
)
