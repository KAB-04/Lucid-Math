import { Paperclip, Send, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { TutorQuickActions } from './TutorQuickActions'

interface TutorComposerProps {
  draft: string
  onChange: (value: string) => void
  onClear: () => void
  onQuickAction: (prompt: string) => void
  onSend: () => void
  isSending?: boolean
}

export const TutorComposer = ({
  draft,
  onChange,
  onClear,
  onQuickAction,
  onSend,
  isSending = false,
}: TutorComposerProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <div className="grid gap-3 border-t border-[var(--color-border)] bg-white p-4">
      <TutorQuickActions onSelect={onQuickAction} />
      <div className="grid gap-3 md:grid-cols-[auto_1fr_auto]">
        <Button disabled title="Attachments will be available when tutor uploads are supported." variant="ghost">
          <Paperclip aria-hidden="true" className="h-4 w-4" />
          Attach
        </Button>
        <label className="sr-only" htmlFor="ai-tutor-message">Ask Lucid anything about this topic</label>
        <textarea
          className="max-h-40 min-h-24 resize-y rounded-md border border-[var(--color-muted)] bg-white px-3 py-2 text-base text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-secondary)]/50"
          id="ai-tutor-message"
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Lucid anything about this topic..."
          value={draft}
        />
        <div className="flex flex-wrap gap-2 md:grid md:content-start">
          <Button disabled={!draft.trim()} isLoading={isSending} onClick={onSend}>
            <Send aria-hidden="true" className="h-4 w-4" />
            Send
          </Button>
          <Button onClick={onClear} variant="ghost">
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
