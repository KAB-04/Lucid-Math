import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { getDashboardRouteForRole } from '../../utils/authRoutes'
import type { FrontendApiError } from '../../types/api'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { FormError } from '../../components/ui/FormError'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'

const registerSchema = z.object({
  FullName: z.string().min(2, 'Full name is required.'),
  Email: z.string().email('Enter a valid email address.'),
  Password: z.string().min(8, 'Password must be at least 8 characters.'),
  EducationLevel: z.string().min(1, 'Select your education level.'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { register: registerAccount } = useAuth()
  const [formError, setFormError] = useState<string>()

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      FullName: '',
      Email: '',
      Password: '',
      EducationLevel: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(undefined)

    try {
      const user = await registerAccount(values)
      toast.success('Your Lucid Math account is ready.')
      navigate(getDashboardRouteForRole(user.role), { replace: true })
    } catch (error) {
      const apiError = error as FrontendApiError
      setFormError(apiError.message)
    }
  })

  return (
    <Card className="mx-auto w-full max-w-md">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          Student registration
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">Build your foundation</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
          Registration creates a Student account in the existing backend.
        </p>
      </div>

      <form className="grid gap-4" onSubmit={onSubmit}>
        <FormError message={formError} />
        <Input
          autoComplete="name"
          error={errors.FullName?.message}
          label="Full name"
          {...register('FullName')}
        />
        <Input
          autoComplete="email"
          error={errors.Email?.message}
          label="Email"
          type="email"
          {...register('Email')}
        />
        <Select error={errors.EducationLevel?.message} label="Education level" {...register('EducationLevel')}>
          <option value="">Select level</option>
          <option value="JHS">JHS</option>
          <option value="SHS">SHS</option>
          <option value="Pre-University">Pre-University</option>
        </Select>
        <Input
          autoComplete="new-password"
          error={errors.Password?.message}
          label="Password"
          type="password"
          {...register('Password')}
        />
        <Button isLoading={isSubmitting} type="submit">
          Create account
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-[var(--color-text-muted)]">
        Already registered?{' '}
        <Link className="font-semibold text-[var(--color-primary)] underline" to={APP_ROUTES.login}>
          Sign in
        </Link>
      </p>
    </Card>
  )
}
