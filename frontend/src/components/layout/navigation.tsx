import {
  BarChart3,
  BookOpen,
  Brain,
  ClipboardCheck,
  GraduationCap,
  History,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Users,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { APP_ROUTES } from '../../constants/routes'

export interface NavItem {
  label: string
  path: string
  icon: ReactNode
}

export const studentNavigation: NavItem[] = [
  { label: 'Dashboard', path: APP_ROUTES.student.dashboard, icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Topics', path: APP_ROUTES.student.topics, icon: <BookOpen className="h-5 w-5" /> },
  { label: 'Assessments', path: APP_ROUTES.student.assessments, icon: <ClipboardCheck className="h-5 w-5" /> },
  { label: 'Learner Profile', path: APP_ROUTES.student.learnerProfile, icon: <Brain className="h-5 w-5" /> },
  { label: 'Learning History', path: APP_ROUTES.student.learningHistory, icon: <History className="h-5 w-5" /> },
  { label: 'AI Tutor', path: APP_ROUTES.student.aiTutor, icon: <MessageCircle className="h-5 w-5" /> },
  { label: 'Settings', path: APP_ROUTES.student.settings, icon: <Settings className="h-5 w-5" /> },
]

export const teacherNavigation: NavItem[] = [
  { label: 'Dashboard', path: APP_ROUTES.teacher.dashboard, icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Topics', path: APP_ROUTES.teacher.topics, icon: <BookOpen className="h-5 w-5" /> },
  { label: 'Questions', path: APP_ROUTES.teacher.questions, icon: <ClipboardCheck className="h-5 w-5" /> },
  { label: 'Assessments', path: APP_ROUTES.teacher.assessments, icon: <GraduationCap className="h-5 w-5" /> },
  { label: 'Students', path: APP_ROUTES.teacher.students, icon: <Users className="h-5 w-5" /> },
  { label: 'Analytics', path: APP_ROUTES.teacher.analytics, icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'Settings', path: APP_ROUTES.teacher.settings, icon: <Settings className="h-5 w-5" /> },
]
