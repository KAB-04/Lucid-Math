import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
}

export const Select = ({ children, className = '', error, id, label, ...props }: SelectProps) => {
  const selectId = id ?? props.name

  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-primary)]" htmlFor={selectId}>
      <span>{label}</span>
      <select
        className={`min-h-11 rounded-md border border-[var(--color-muted)] bg-white px-3 py-2 text-base text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-secondary)]/50 ${className}`}
        id={selectId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <span className="text-sm text-[var(--color-error)]" id={`${selectId}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  )
}
