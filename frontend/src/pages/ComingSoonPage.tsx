import { EmptyState } from '../components/ui/EmptyState'

interface ComingSoonPageProps {
  title: string
}

export const ComingSoonPage = ({ title }: ComingSoonPageProps) => (
  <section className="grid gap-6">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
        Foundation route
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">{title}</h1>
    </div>
    <EmptyState title={`${title} is coming soon`}>
      This route is wired into the app shell, but the full feature UI is intentionally left for the next phase.
    </EmptyState>
  </section>
)
