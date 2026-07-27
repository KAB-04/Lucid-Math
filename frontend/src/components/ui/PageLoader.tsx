import { LoadingSpinner } from './LoadingSpinner'

interface PageLoaderProps {
  label?: string
}

export const PageLoader = ({ label = 'Loading Lucid Math' }: PageLoaderProps) => (
  <main className="grid min-h-svh place-items-center bg-[var(--color-background)] p-6">
    <LoadingSpinner label={label} />
  </main>
)
