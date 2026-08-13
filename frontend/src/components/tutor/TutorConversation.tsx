import type { TutorMessage } from '../../types/tutor'
import { EmptyState } from '../ui/EmptyState'
import { TutorMessage as TutorMessageItem } from './TutorMessage'

interface TutorConversationProps {
  messages: TutorMessage[]
  onSuggestedPrompt: (prompt: string) => void
  studentName: string
}

const suggestedPrompts = [
  'Help me understand fractions',
  'Give me an algebra question',
  'Explain quadratic equations',
  'Test me on this topic',
]

export const TutorConversation = ({
  messages,
  onSuggestedPrompt,
  studentName,
}: TutorConversationProps) => {
  if (messages.length === 0) {
    return (
      <div className="p-5">
        <EmptyState title={`Hi ${studentName}. What would you like help with today?`}>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                className="rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-background)]"
                key={prompt}
                onClick={() => onSuggestedPrompt(prompt)}
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>
        </EmptyState>
      </div>
    )
  }

  return (
    <div className="grid max-h-[62svh] min-h-[24rem] gap-4 overflow-y-auto p-4 md:p-5">
      {messages.map((message) => (
        <TutorMessageItem key={message.id} message={message} />
      ))}
    </div>
  )
}
