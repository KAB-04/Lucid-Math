import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { normalizeApiError } from '../../api/error'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminTable } from '../../components/admin/AdminTable'
import { Alert } from '../../components/ui/Alert'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { adminService } from '../../services/adminService'
import { topicService } from '../../services/topicService'
import type { FrontendApiError } from '../../types/api'
import type { QuestionDto, QuestionFormRequest } from '../../types/admin'
import type { TopicDto } from '../../types/learningModules'

const emptyQuestionForm: QuestionFormRequest = {
  QuestionText: '',
  OptionA: '',
  OptionB: '',
  OptionC: '',
  OptionD: '',
  CorrectAnswer: '',
  Explanation: '',
  DifficultyLevel: 1,
  TopicId: 0,
}

export const TeacherQuestionsPage = () => {
  const [questions, setQuestions] = useState<QuestionDto[]>([])
  const [topics, setTopics] = useState<TopicDto[]>([])
  const [editingQuestion, setEditingQuestion] = useState<QuestionDto | null>(null)
  const [form, setForm] = useState<QuestionFormRequest>(emptyQuestionForm)
  const [error, setError] = useState<FrontendApiError | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [topicId, setTopicId] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const loadQuestions = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    try {
      const [nextQuestions, nextTopics] = await Promise.all([
        adminService.getQuestions(signal),
        topicService.getTopics(signal),
      ])
      setQuestions(nextQuestions)
      setTopics(nextTopics)
    } catch (requestError) {
      if (!signal?.aborted) setError(normalizeApiError(requestError))
    } finally {
      if (!signal?.aborted) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadQuestions(controller.signal)
    return () => controller.abort()
  }, [loadQuestions])

  const filteredQuestions = useMemo(() => questions.filter((question) => {
    const matchesSearch = question.questionText.toLowerCase().includes(search.toLowerCase())
    const matchesTopic = topicId === 'all' || question.topicId === Number(topicId)
    return matchesSearch && matchesTopic
  }), [questions, search, topicId])

  const openForm = (question?: QuestionDto) => {
    setEditingQuestion(question ?? null)
    setForm(question ? {
      QuestionText: question.questionText,
      OptionA: question.optionA,
      OptionB: question.optionB,
      OptionC: question.optionC,
      OptionD: question.optionD,
      CorrectAnswer: question.correctAnswer,
      Explanation: question.explanation,
      DifficultyLevel: question.difficultyLevel,
      TopicId: question.topicId,
    } : { ...emptyQuestionForm, TopicId: topics[0]?.id ?? 0 })
    setIsFormOpen(true)
  }

  const saveQuestion = async () => {
    try {
      if (editingQuestion) {
        await adminService.updateQuestion(editingQuestion.id, form)
        toast.success('Question updated.')
      } else {
        await adminService.createQuestion(form)
        toast.success('Question added.')
      }
      setIsFormOpen(false)
      await loadQuestions()
    } catch (requestError) {
      toast.error(normalizeApiError(requestError).message)
    }
  }

  const deleteQuestion = async (question: QuestionDto) => {
    if (!window.confirm('Delete this question?')) return
    try {
      await adminService.deleteQuestion(question.id)
      toast.success('Question deleted.')
      await loadQuestions()
    } catch (requestError) {
      toast.error(normalizeApiError(requestError).message)
    }
  }

  const setField = <TKey extends keyof QuestionFormRequest>(key: TKey, value: QuestionFormRequest[TKey]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <section className="grid gap-6">
      <AdminPageHeader actions={<Button onClick={() => openForm()}><Plus className="h-4 w-4" /> Add question</Button>} description="Manage Lucid's multiple-choice question bank." title="Questions" />
      <div className="grid gap-3 md:grid-cols-[1fr_16rem]">
        <Input label="Search questions" onChange={(event) => setSearch(event.target.value)} value={search} />
        <Select label="Topic" onChange={(event) => setTopicId(event.target.value)} value={topicId}>
          <option value="all">All topics</option>
          {topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
        </Select>
      </div>
      {isLoading ? <LoadingSpinner label="Loading questions" /> : null}
      {error ? <Alert title="Questions unavailable" variant="danger">{error.message}</Alert> : null}
      {!isLoading && !error && filteredQuestions.length === 0 ? <EmptyState title="No questions are available yet">Add questions to build the assessment bank.</EmptyState> : null}
      {filteredQuestions.length > 0 ? (
        <AdminTable>
          <thead className="bg-white/70 text-xs uppercase tracking-[0.12em] text-[var(--color-text-muted)]"><tr><th className="px-4 py-3">Question</th><th className="px-4 py-3">Topic</th><th className="px-4 py-3">Difficulty</th><th className="px-4 py-3">Correct</th><th className="px-4 py-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {filteredQuestions.map((question) => (
              <tr key={question.id}>
                <td className="max-w-xl px-4 py-3"><p className="font-semibold text-[var(--color-primary)]">{question.questionText}</p><p className="text-sm text-[var(--color-text-muted)]">Multiple choice</p></td>
                <td className="px-4 py-3">{question.topicName}</td>
                <td className="px-4 py-3"><Badge variant="neutral">Level {question.difficultyLevel}</Badge></td>
                <td className="px-4 py-3">{question.correctAnswer}</td>
                <td className="px-4 py-3"><div className="flex gap-2"><Button onClick={() => openForm(question)} variant="ghost"><Pencil className="h-4 w-4" /> Edit</Button><Button onClick={() => void deleteQuestion(question)} variant="danger"><Trash2 className="h-4 w-4" /> Delete</Button></div></td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      ) : null}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingQuestion ? 'Edit question' : 'Add question'}>
        <div className="grid gap-3">
          <Select label="Topic" onChange={(event) => setField('TopicId', Number(event.target.value))} value={form.TopicId}><option value={0}>Select topic</option>{topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}</Select>
          <Textarea label="Question text" onChange={(event) => setField('QuestionText', event.target.value)} value={form.QuestionText} />
          <div className="grid gap-3 sm:grid-cols-2"><Input label="Option A" onChange={(event) => setField('OptionA', event.target.value)} value={form.OptionA} /><Input label="Option B" onChange={(event) => setField('OptionB', event.target.value)} value={form.OptionB} /><Input label="Option C" onChange={(event) => setField('OptionC', event.target.value)} value={form.OptionC} /><Input label="Option D" onChange={(event) => setField('OptionD', event.target.value)} value={form.OptionD} /></div>
          <div className="grid gap-3 sm:grid-cols-2"><Input label="Correct answer" onChange={(event) => setField('CorrectAnswer', event.target.value)} value={form.CorrectAnswer} /><Select label="Difficulty" onChange={(event) => setField('DifficultyLevel', Number(event.target.value))} value={form.DifficultyLevel}><option value={1}>Level 1</option><option value={2}>Level 2</option><option value={3}>Level 3</option></Select></div>
          <Textarea label="Explanation" onChange={(event) => setField('Explanation', event.target.value)} value={form.Explanation} />
          <div className="flex justify-end gap-2"><Button onClick={() => setIsFormOpen(false)} variant="ghost">Cancel</Button><Button onClick={() => void saveQuestion()}>Save question</Button></div>
        </div>
      </Modal>
    </section>
  )
}
