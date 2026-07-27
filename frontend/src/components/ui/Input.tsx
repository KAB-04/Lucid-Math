import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = ({ className = '', error, id, label, ...props }: InputProps) => {
  const inputId = id ?? props.name

  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-primary)]" htmlFor={inputId}>
      <span>{label}</span>
      <input
        className={`min-h-11 rounded-md border border-[var(--color-muted)] bg-white px-3 py-2 text-base text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-secondary)]/50 disabled:bg-[var(--color-background)] ${className}`}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <span className="text-sm text-[var(--color-error)]" id={`${inputId}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  )
}
