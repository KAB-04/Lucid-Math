import { AppShell } from '../components/layout/AppShell'
import { teacherNavigation } from '../components/layout/navigation'

export const TeacherLayout = () => (
  <AppShell navigation={teacherNavigation} role="Admin" />
)
