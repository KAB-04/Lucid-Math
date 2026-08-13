import type { ReactNode } from 'react'

interface AdminTableProps {
  children: ReactNode
}

export const AdminTable = ({ children }: AdminTableProps) => (
  <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-white/70">
    <table className="min-w-full divide-y divide-[var(--color-border)] text-left text-sm">
      {children}
    </table>
  </div>
)
