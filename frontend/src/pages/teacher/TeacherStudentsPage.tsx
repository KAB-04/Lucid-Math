import { useCallback, useEffect, useMemo, useState } from 'react'
import { Eye, UserPlus } from 'lucide-react'
import { normalizeApiError } from '../../api/error'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminTable } from '../../components/admin/AdminTable'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { adminService } from '../../services/adminService'
import type { FrontendApiError } from '../../types/api'
import type { AdminStudentDto } from '../../types/admin'
import type { LearnerProfileDto } from '../../types/dashboard'
import { formatDateTime, formatPercent } from '../../utils/format'

export const TeacherStudentsPage = () => {
  const [students, setStudents] = useState<AdminStudentDto[]>([])
  const [selectedStudent, setSelectedStudent] = useState<AdminStudentDto | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<LearnerProfileDto | null>(null)
  const [error, setError] = useState<FrontendApiError | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('all')

  const loadStudents = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    try {
      setStudents(await adminService.getStudents(signal))
    } catch (requestError) {
      if (!signal?.aborted) setError(normalizeApiError(requestError))
    } finally {
      if (!signal?.aborted) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadStudents(controller.signal)
    return () => controller.abort()
  }, [loadStudents])

  const levels = useMemo(() => Array.from(new Set(students.map((student) => student.educationLevel).filter(Boolean))), [students])
  const filteredStudents = students.filter((student) => {
    const matchesSearch = `${student.fullName} ${student.email}`.toLowerCase().includes(search.toLowerCase())
    const matchesLevel = level === 'all' || student.educationLevel === level
    return matchesSearch && matchesLevel
  })

  const openStudent = async (student: AdminStudentDto) => {
    setSelectedStudent(student)
    setSelectedProfile(null)
    try {
      setSelectedProfile(await adminService.getLearnerProfile(student.id))
    } catch {
      setSelectedProfile(null)
    }
  }

  return (
    <section className="grid gap-6">
      <AdminPageHeader
        actions={<Button disabled variant="secondary"><UserPlus className="h-4 w-4" /> Add student</Button>}
        description="Search students and inspect their learner profile information."
        title="Students"
      />
      <Alert title="Student creation note">The backend has an admin create-student route, but it does not create an Identity login account yet, so the add-student action is kept disabled.</Alert>

      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_16rem]">
          <Input label="Search by name or email" onChange={(event) => setSearch(event.target.value)} value={search} />
          <Select label="Level/Class" onChange={(event) => setLevel(event.target.value)} value={level}>
            <option value="all">All levels</option>
            {levels.map((item) => <option key={item} value={item}>{item}</option>)}
          </Select>
        </div>
      </Card>

      {isLoading ? <LoadingSpinner label="Loading students" /> : null}
      {error ? <Alert title="Students unavailable" variant="danger">{error.message}</Alert> : null}
      {!isLoading && !error && filteredStudents.length === 0 ? <EmptyState title="No students found">Try changing your search or filters.</EmptyState> : null}

      {filteredStudents.length > 0 ? (
        <AdminTable>
          <thead className="bg-white/70 text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
            <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">ID</th><th className="px-4 py-3">Level</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-3"><p className="font-semibold text-[var(--color-primary)]">{student.fullName}</p><p className="text-sm text-[var(--color-text-muted)]">{student.email}</p></td>
                <td className="px-4 py-3">{student.id}</td>
                <td className="px-4 py-3">{student.educationLevel || 'Not set'}</td>
                <td className="px-4 py-3"><Badge variant="success">Active</Badge></td>
                <td className="px-4 py-3"><Button onClick={() => void openStudent(student)} variant="ghost"><Eye className="h-4 w-4" /> View</Button></td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      ) : null}

      <Modal isOpen={selectedStudent !== null} onClose={() => setSelectedStudent(null)} title="Student profile">
        {selectedStudent ? (
          <div className="grid gap-4">
            <div><p className="text-lg font-semibold text-[var(--color-primary)]">{selectedStudent.fullName}</p><p className="text-sm text-[var(--color-text-muted)]">{selectedStudent.email}</p></div>
            <div className="grid gap-2 text-sm">
              <p><strong>ID:</strong> {selectedStudent.id}</p>
              <p><strong>Level:</strong> {selectedStudent.educationLevel || 'Not set'}</p>
              <p><strong>Joined:</strong> {formatDateTime(selectedStudent.createdAt)}</p>
              <p><strong>Teaching approach:</strong> {selectedProfile?.teachingApproach || 'Complete an assessment to generate a learner profile.'}</p>
              <p><strong>Mastery:</strong> {selectedProfile ? formatPercent(selectedProfile.overallMasteryPercentage) : 'Not available'}</p>
              <p><strong>Strongest topic:</strong> {selectedProfile?.strongestTopic || 'Not available'}</p>
              <p><strong>Weakest topic:</strong> {selectedProfile?.weakestTopic || 'Not available'}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  )
}
