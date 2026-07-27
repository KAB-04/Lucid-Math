import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  isLoading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]',
  secondary: 'bg-[var(--color-secondary)] text-[var(--color-primary)] hover:bg-[#8da6b5]',
  accent: 'bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[#b99f7c]',
  success: 'bg-[var(--color-success)] text-white hover:bg-[#43785a]',
  danger: 'bg-[var(--color-error)] text-white hover:bg-[#af4d4d]',
  ghost: 'bg-transparent text-[var(--color-primary)] hover:bg-white/60',
}

export const Button = ({
  children,
  className = '',
  disabled,
  isLoading = false,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) => (
  <button
    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
    disabled={disabled || isLoading}
    type={type}
    {...props}
  >
    {isLoading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
    {children}
  </button>
)
