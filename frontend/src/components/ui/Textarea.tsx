import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const Textarea = ({ className = '', error, id, label, ...props }: TextareaProps) => {
  const textareaId = id ?? props.name

  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-primary)]" htmlFor={textareaId}>
      <span>{label}</span>
      <textarea
        className={`min-h-28 rounded-md border border-[var(--color-muted)] bg-white px-3 py-2 text-base text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-secondary)]/50 ${className}`}
        id={textareaId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...props}
      />
      {error ? (
        <span className="text-sm text-[var(--color-error)]" id={`${textareaId}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  )
}
