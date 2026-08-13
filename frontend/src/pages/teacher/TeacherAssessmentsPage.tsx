import { useCallback, useEffect, useState } from 'react'
import { Eye, Plus } from 'lucide-react'
import { normalizeApiError } from '../../api/error'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminTable } from '../../components/admin/AdminTable'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { adminService } from '../../services/adminService'
import type { FrontendApiError } from '../../types/api'
import type { AdminAssessmentDto } from '../../types/admin'
import { formatDateTime, formatPercent } from '../../utils/format'

export const TeacherAssessmentsPage = () => {
  const [assessments, setAssessments] = useState<AdminAssessmentDto[]>([])
  const [error, setError] = useState<FrontendApiError | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadAssessments = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    try {
      setAssessments(await adminService.getAssessments(signal))
    } catch (requestError) {
      if (!signal?.aborted) setError(normalizeApiError(requestError))
    } finally {
      if (!signal?.aborted) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadAssessments(controller.signal)
    return () => controller.abort()
  }, [loadAssessments])

  return (
    <section className="grid gap-6">
      <AdminPageHeader actions={<Button disabled variant="secondary"><Plus className="h-4 w-4" /> Create assessment</Button>} description="Review student-started assessments and completion performance." title="Assessments" />
      <Alert title="Assessment management note">The current backend supports student-started assessments and admin read/detail. Draft, publish, edit, and delete assessment APIs do not exist yet.</Alert>
      {isLoading ? <LoadingSpinner label="Loading assessments" /> : null}
      {error ? <Alert title="Assessments unavailable" variant="danger">{error.message}</Alert> : null}
      {!isLoading && !error && assessments.length === 0 ? <EmptyState title="No assessments have been created yet">Student assessment attempts will appear here.</EmptyState> : null}
      {assessments.length > 0 ? (
        <AdminTable>
          <thead className="bg-white/70 text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]"><tr><th className="px-4 py-3">Assessment</th><th className="px-4 py-3">Student</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Score</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {assessments.map((assessment) => (
              <tr key={assessment.id}>
                <td className="px-4 py-3 font-semibold text-[var(--color-primary)]">Assessment #{assessment.id}<p className="text-sm font-normal text-[var(--color-text-muted)]">{assessment.totalQuestions} questions · Level {assessment.difficultyLevel ?? 'Any'}</p></td>
                <td className="px-4 py-3">{assessment.studentName}</td>
                <td className="px-4 py-3"><Badge variant={assessment.isCompleted ? 'success' : 'warning'}>{assessment.isCompleted ? 'Completed' : 'In progress'}</Badge></td>
                <td className="px-4 py-3">{assessment.isCompleted ? formatPercent(assessment.percentageScore) : 'Pending'}</td>
                <td className="px-4 py-3">{formatDateTime(assessment.dateTaken ?? assessment.startedAt)}</td>
                <td className="px-4 py-3"><Button disabled variant="ghost"><Eye className="h-4 w-4" /> View</Button></td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      ) : null}
    </section>
  )
}
