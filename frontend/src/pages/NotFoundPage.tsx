import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../constants/routes'
import { Card } from '../components/ui/Card'

export const NotFoundPage = () => (
  <main className="grid min-h-svh place-items-center bg-[var(--color-background)] p-5">
    <Card className="max-w-md text-center">
      <h1 className="text-3xl font-semibold text-[var(--color-primary)]">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
        That Lucid Math page is not part of the current route foundation.
      </p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        to={APP_ROUTES.home}
      >
        Go home
      </Link>
    </Card>
  </main>
)
