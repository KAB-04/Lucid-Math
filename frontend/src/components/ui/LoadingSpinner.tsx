import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  label?: string
}

export const LoadingSpinner = ({ label = 'Loading' }: LoadingSpinnerProps) => (
  <span className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)]">
    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
    <span>{label}</span>
  </span>
)
