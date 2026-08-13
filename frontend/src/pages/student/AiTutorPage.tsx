import { useCallback, useEffect, useMemo, useState } from 'react'
import { normalizeApiError } from '../../api/error'
import { Alert } from '../../components/ui/Alert'
import { Card } from '../../components/ui/Card'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { TutorComposer } from '../../components/tutor/TutorComposer'
import { TutorConversation } from '../../components/tutor/TutorConversation'
import { TutorHeader } from '../../components/tutor/TutorHeader'
import { useAuth } from '../../hooks/useAuth'
import { aiTutorService } from '../../services/aiTutorService'
import { learnerProfileService } from '../../services/learnerProfileService'
import type { FrontendApiError } from '../../types/api'
import type { LearnerProfileDto } from '../../types/dashboard'
import type { TutorLearningContext, TutorMessage } from '../../types/tutor'

const fallbackContext: TutorLearningContext = {
  currentTopic: 'Algebra',
  currentLevel: 'Foundation',
  teachingStyle: 'Inquiry-Based Teaching',
}

const getLevelFromDifficulty = (difficultyLevel?: number) => {
  if (!difficultyLevel || difficultyLevel <= 1) {
    return 'Foundation'
  }

  if (difficultyLevel === 2) {
    return 'Developing'
  }

  return 'Challenge'
}

const createTutorReply = (prompt: string, context: TutorLearningContext) => {
  const loweredPrompt = prompt.toLowerCase()

  if (loweredPrompt.includes('algebra question')) {
    return `Let's try this:\n2x + 5 = 15\n\nWhat do you think we should do first?`
  }

  if (loweredPrompt.includes('hint')) {
    return `Hint: focus on one operation at a time. For ${context.currentTopic}, ask: what operation is stopping the variable from standing alone?`
  }

  if (loweredPrompt.includes('example')) {
    return 'Example:\n3x - 4 = 11\nAdd 4 to both sides: 3x = 15\nDivide both sides by 3: x = 5'
  }

  if (loweredPrompt.includes('steps')) {
    return 'Step 1: Identify what is attached to the variable.\nStep 2: Undo addition or subtraction.\nStep 3: Undo multiplication or division.\nStep 4: Check your answer in the original equation.'
  }

  if (loweredPrompt.includes('check')) {
    return 'Share your answer and your working. I will check the reasoning first, then the final answer.'
  }

  if (loweredPrompt.includes('differently')) {
    return 'Think of an equation like a balanced scale. Whatever you do to one side, do the same to the other side so the scale stays level.'
  }

  return `Good question. For ${context.currentTopic}, I would start by naming what you already know, then choosing the smallest next step. What have you tried so far?`
}

export const AiTutorPage = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<LearnerProfileDto | null>(null)
  const [error, setError] = useState<FrontendApiError | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [tutorError, setTutorError] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<TutorMessage[]>([])

  const studentName = user?.fullName?.split(' ')[0] || 'learner'

  const learningContext = useMemo<TutorLearningContext>(() => {
    if (!profile) {
      return fallbackContext
    }

    return {
      currentTopic: profile.recommendedNextTopic || profile.weakestTopic || fallbackContext.currentTopic,
      currentLevel: getLevelFromDifficulty(profile.recommendedDifficultyLevel),
      teachingStyle: profile.teachingApproach || fallbackContext.teachingStyle,
    }
  }, [profile])

  const loadProfile = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)

    try {
      setProfile(await learnerProfileService.getMine(signal))
    } catch (requestError) {
      if (!signal?.aborted) {
        setError(normalizeApiError(requestError))
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadProfile(controller.signal)
    return () => controller.abort()
  }, [loadProfile])

  const handleSend = async () => {
    const trimmedDraft = draft.trim()

    if (!trimmedDraft || isSending) {
      return
    }

    const timestamp = new Date().toISOString()
    const studentMessage: TutorMessage = {
      id: `student-${timestamp}`,
      role: 'student',
      timestamp,
      content: trimmedDraft,
    }
    setMessages((currentMessages) => [...currentMessages, studentMessage])
    setDraft('')
    setIsSending(true)
    setTutorError(null)

    try {
      const response = await aiTutorService.sendMessage(trimmedDraft)
      const tutorMessage: TutorMessage = {
        id: `tutor-${timestamp}`,
        role: 'tutor',
        timestamp: new Date().toISOString(),
        content: response.reply,
      }

      setMessages((currentMessages) => [...currentMessages, tutorMessage])
    } catch (requestError) {
      const apiError = normalizeApiError(requestError)
      const fallbackReply = createTutorReply(trimmedDraft, learningContext)
      const tutorMessage: TutorMessage = {
        id: `tutor-fallback-${timestamp}`,
        role: 'tutor',
        timestamp: new Date().toISOString(),
        content: fallbackReply,
      }

      setTutorError(`${apiError.message} Lucid is using a local tutor response for now. Make sure the backend was started with LUCID_API set.`)
      setMessages((currentMessages) => [...currentMessages, tutorMessage])
    } finally {
      setIsSending(false)
    }
  }

  const handleNewSession = () => {
    setDraft('')
    setMessages([])
  }

  const handleQuickAction = (prompt: string) => {
    setDraft(prompt)
  }

  const hasProfileData = Boolean(
    profile?.recommendedNextTopic ||
      profile?.weakestTopic ||
      profile?.teachingApproach && !profile.teachingApproach.includes('Complete an assessment'),
  )

  return (
    <section className="grid gap-6">
      <TutorHeader context={learningContext} onNewSession={handleNewSession} />

      {isLoading ? <LoadingSpinner label="Loading tutor context" /> : null}

      {error ? (
        <Alert title="Using fallback tutor context" variant="warning">
          {error.message}
        </Alert>
      ) : null}

      {!isLoading && !error && !hasProfileData ? (
        <Alert title="Tutor context is using starter values">
          Complete an assessment to let Lucid personalize the tutor with your real learner profile.
        </Alert>
      ) : null}

      {tutorError ? (
        <Alert title="AI provider unavailable" variant="warning">
          {tutorError}
        </Alert>
      ) : null}

      <Card className="overflow-hidden p-0">
        <TutorConversation
          messages={messages}
          onSuggestedPrompt={setDraft}
          studentName={studentName}
        />
        <TutorComposer
          draft={draft}
          isSending={isSending}
          onChange={setDraft}
          onClear={handleNewSession}
          onQuickAction={handleQuickAction}
          onSend={() => void handleSend()}
        />
      </Card>
    </section>
  )
}
