interface TutorQuickActionsProps {
  onSelect: (prompt: string) => void
}

const quickActions = [
  'Explain differently',
  'Give me a hint',
  'Show an example',
  'Break it into steps',
  'Check my answer',
]

export const TutorQuickActions = ({ onSelect }: TutorQuickActionsProps) => (
  <div className="flex flex-wrap gap-2">
    {quickActions.map((action) => (
      <button
        className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-background)]"
        key={action}
        onClick={() => onSelect(action)}
        type="button"
      >
        {action}
      </button>
    ))}
  </div>
)
