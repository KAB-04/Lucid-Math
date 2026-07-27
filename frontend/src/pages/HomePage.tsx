import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Users,
} from 'lucide-react'
import { APP_ROUTES } from '../constants/routes'
import { Logo } from '../components/common/Logo'

export const HomePage = () => (
  <main className="min-h-svh bg-[var(--color-background)] text-[var(--color-text)]">
    <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Logo imageClassName="h-14" />
        <div className="flex items-center gap-2">
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md px-4 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-background)]"
            to={APP_ROUTES.login}
          >
            Sign in
          </Link>
          <Link
            className="hidden min-h-10 items-center justify-center rounded-md bg-[var(--color-primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] sm:inline-flex"
            to={APP_ROUTES.register}
          >
            Register
          </Link>
        </div>
      </div>
    </section>

    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:min-h-[calc(100svh-83px)] lg:grid-cols-[1.05fr_0.95fr] lg:content-center lg:px-8 lg:py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          Understand. Practice. Master.
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-[var(--color-primary)] sm:text-5xl lg:text-6xl">
          Mathematics support built for steady progress.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-muted)] sm:text-lg">
          Lucid helps students strengthen foundations while giving teachers a focused workspace for topics,
          assessments, and learning progress.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            to={APP_ROUTES.register}
          >
            Create student account
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--color-muted)] bg-white px-5 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-background)]"
            to={APP_ROUTES.login}
          >
            Teacher sign in
          </Link>
        </div>

        <div className="mt-8 grid gap-3 text-sm text-[var(--color-primary)] sm:grid-cols-3">
          {['Diagnostic assessments', 'Learner profiles', 'Teacher dashboards'].map((item) => (
            <div className="flex items-center gap-2" key={item}>
              <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[var(--color-success)]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 self-center">
        <div className="rounded-lg border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--color-primary)]">Student Workspace</p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                Register, take assessments, and track learning history.
              </p>
            </div>
            <GraduationCap aria-hidden="true" className="h-8 w-8 text-[var(--color-primary)]" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-md bg-[var(--color-background)] p-3">
              <BookOpen aria-hidden="true" className="h-5 w-5 text-[var(--color-primary)]" />
              <p className="mt-3 text-xs font-semibold text-[var(--color-primary)]">Topics</p>
            </div>
            <div className="rounded-md bg-[var(--color-secondary)]/25 p-3">
              <ClipboardCheck aria-hidden="true" className="h-5 w-5 text-[var(--color-primary)]" />
              <p className="mt-3 text-xs font-semibold text-[var(--color-primary)]">Practice</p>
            </div>
            <div className="rounded-md bg-[var(--color-accent)]/35 p-3">
              <BarChart3 aria-hidden="true" className="h-5 w-5 text-[var(--color-primary)]" />
              <p className="mt-3 text-xs font-semibold text-[var(--color-primary)]">Progress</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-accent)]/30 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--color-primary)]">Teacher Workspace</p>
              <p className="mt-1 text-sm leading-6 text-[var(--color-primary)]">
                Admin accounts enter here and are displayed as Teacher in the interface.
              </p>
            </div>
            <Users aria-hidden="true" className="h-8 w-8 text-[var(--color-primary)]" />
          </div>
        </div>
      </div>
    </section>
  </main>
)
