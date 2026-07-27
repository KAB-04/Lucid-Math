import { Outlet } from 'react-router-dom'
import { Logo } from '../components/common/Logo'

export const AuthLayout = () => (
  <main className="grid min-h-svh bg-[var(--color-background)] px-5 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(380px,480px)] lg:px-10">
    <section className="hidden content-center pr-12 lg:grid">
      <div className="max-w-2xl">
        <Logo className="rounded-lg bg-white p-3 shadow-sm" imageClassName="h-32" />
        <h1 className="mt-4 text-5xl font-semibold leading-tight text-[var(--color-primary)]">
          Calm foundations for stronger mathematics.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--color-text-muted)]">
          A focused learning platform for Ghanaian students and the teachers guiding their progress.
        </p>
      </div>
    </section>
    <section className="grid content-center">
      <Outlet />
    </section>
  </main>
)
