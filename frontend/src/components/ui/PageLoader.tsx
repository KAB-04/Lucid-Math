import { LoadingSpinner } from './LoadingSpinner'
import { Logo } from '../common/Logo'

interface PageLoaderProps {
  label?: string
}

export const PageLoader = ({ label = 'Loading Lucid' }: PageLoaderProps) => (
  <main className="grid min-h-svh place-items-center bg-[var(--color-background)] p-6">
    <div className="grid justify-items-center gap-4">
      <Logo className="rounded-lg bg-white p-3 shadow-sm" imageClassName="h-24" />
      <LoadingSpinner label={label} />
    </div>
  </main>
)
