import { Bot, UserRound } from 'lucide-react'
import type { TutorMessage as TutorMessageType } from '../../types/tutor'

interface TutorMessageProps {
  message: TutorMessageType
}

const renderMathFriendlyText = (content: string) =>
  content.split('\n').map((line, index) => (
    <span className="block" key={`${line}-${index}`}>
      {line}
    </span>
  ))

export const TutorMessage = ({ message }: TutorMessageProps) => {
  const isStudent = message.role === 'student'

  return (
    <article className={`flex gap-3 ${isStudent ? 'justify-end' : 'justify-start'}`}>
      {!isStudent ? (
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[var(--color-primary)] text-white">
          <Bot aria-hidden="true" className="h-5 w-5" />
        </div>
      ) : null}
      <div
        className={[
          'max-w-[min(38rem,100%)] rounded-lg border px-4 py-3 shadow-sm',
          isStudent
            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
            : 'border-[var(--color-border)] bg-white text-[var(--color-text)]',
        ].join(' ')}
      >
        <p className="whitespace-pre-wrap text-sm leading-6">
          {renderMathFriendlyText(message.content)}
        </p>
        <time
          className={`mt-2 block text-xs ${isStudent ? 'text-white/70' : 'text-[var(--color-text-muted)]'}`}
          dateTime={message.timestamp}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
      {isStudent ? (
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[var(--color-secondary)] text-[var(--color-primary)]">
          <UserRound aria-hidden="true" className="h-5 w-5" />
        </div>
      ) : null}
    </article>
  )
}
