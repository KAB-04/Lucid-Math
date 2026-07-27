import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react'
import { APP_ROUTES } from '../constants/routes'
import { Card } from '../components/ui/Card'

export const HomePage = () => (
  <main className="min-h-svh bg-[var(--color-background)] text-[var(--color-text)]">
    <section className="mx-auto grid min-h-svh max-w-6xl content-center gap-10 px-5 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          Lucid Math
        </p>
        <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight text-[var(--color-primary)] lg:text-6xl">
          Adaptive mathematics support for stronger foundations.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-muted)]">
          A calm workspace for students and teachers using the existing Lucid Math API contracts.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            to={APP_ROUTES.login}
          >
            Sign in
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold text-[var(--color-primary)] hover:bg-white/55"
            to={APP_ROUTES.register}
          >
            Register as student
          </Link>
        </div>
      </div>

      <div className="grid content-center gap-4">
        <Card className="border-[var(--color-secondary)]">
          <GraduationCap aria-hidden="true" className="h-7 w-7 text-[var(--color-primary)]" />
          <h2 className="mt-4 text-xl font-semibold text-[var(--color-primary)]">Students</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
            Register, sign in, and enter the protected student workspace.
          </p>
        </Card>
        <Card className="bg-[var(--color-accent)]/35">
          <BookOpen aria-hidden="true" className="h-7 w-7 text-[var(--color-primary)]" />
          <h2 className="mt-4 text-xl font-semibold text-[var(--color-primary)]">Teachers</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--color-primary)]">
            Backend role remains Admin. The interface presents it as Teacher.
          </p>
        </Card>
      </div>
    </section>
  </main>
)
