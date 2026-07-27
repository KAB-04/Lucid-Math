import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { KeyRound } from 'lucide-react'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { getDashboardRouteForRole } from '../../utils/authRoutes'
import type { FrontendApiError } from '../../types/api'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { FormError } from '../../components/ui/FormError'
import { Input } from '../../components/ui/Input'
import { Logo } from '../../components/common/Logo'

const loginSchema = z.object({
  Email: z.string().email('Enter a valid email address.'),
  Password: z.string().min(1, 'Password is required.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LocationState {
  returnTo?: string
}

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [formError, setFormError] = useState<string>()

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      Email: '',
      Password: '',
    },
  })

  const fillTeacherAccount = () => {
    setValue('Email', 'admin@lucidmath.local', { shouldValidate: true })
    setValue('Password', 'Admin12345', { shouldValidate: true })
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(undefined)

    try {
      const user = await login(values)
      toast.success('Welcome back to Lucid.')
      const state = location.state as LocationState | null
      const returnTo = state?.returnTo ?? searchParams.get('returnTo')
      navigate(returnTo || getDashboardRouteForRole(user.role), { replace: true })
    } catch (error) {
      const apiError = error as FrontendApiError
      setFormError(apiError.message)
    }
  })

  return (
    <Card className="mx-auto w-full max-w-md">
      <div className="mb-6">
        <Logo className="mb-4 rounded-md bg-white" imageClassName="h-20" />
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">Sign in</p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">Continue learning</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
          Use your registered Lucid email and password.
        </p>
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <FormError message={formError} />
        <Input
          autoComplete="email"
          error={errors.Email?.message}
          label="Email"
          type="email"
          {...register('Email')}
        />
        <Input
          autoComplete="current-password"
          error={errors.Password?.message}
          label="Password"
          type="password"
          {...register('Password')}
        />
        <Button isLoading={isSubmitting} type="submit">
          Sign in
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-[var(--color-text-muted)]">
        New to Lucid?{' '}
        <Link className="font-semibold text-[var(--color-primary)] underline" to={APP_ROUTES.register}>
          Create a student account
        </Link>
      </p>

      <div className="mt-5 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] p-4">
        <div className="flex gap-3">
          <KeyRound aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-primary)]">Teacher access</p>
            <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
              Teacher sign-in uses the backend Admin role.
            </p>
            <Button className="mt-3" onClick={fillTeacherAccount} variant="secondary">
              Use development teacher account
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
