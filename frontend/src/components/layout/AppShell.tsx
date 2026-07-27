import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LogOut,
  Menu,
} from 'lucide-react'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { getRoleDisplayName, type AuthRole } from '../../types/auth'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import type { NavItem } from './navigation'

interface AppShellProps {
  role: AuthRole
  navigation: NavItem[]
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-[var(--color-secondary)] text-[var(--color-primary)]'
      : 'text-white/82 hover:bg-white/10 hover:text-white',
  ].join(' ')

export const AppShell = ({ navigation, role }: AppShellProps) => {
  const navigate = useNavigate()
  const { logout, roleDisplayName, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate(APP_ROUTES.login, { replace: true })
  }

  return (
    <div className="min-h-svh bg-[var(--color-background)] text-[var(--color-text)] lg:flex">
      <aside className="bg-[var(--color-primary)] text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-72">
        <div className="flex items-center justify-between border-b border-white/15 px-5 py-4 lg:block lg:border-b-0 lg:px-6 lg:py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Lucid Math</p>
            <h1 className="mt-1 text-xl font-semibold text-white">{getRoleDisplayName(role)} Workspace</h1>
          </div>
          <Menu aria-hidden="true" className="h-6 w-6 lg:hidden" />
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 py-3 lg:grid lg:gap-1 lg:overflow-visible lg:px-4">
          {navigation.map((item) => (
            <NavLink className={navLinkClass} key={item.path} to={item.path}>
              {item.icon}
              <span className="whitespace-nowrap">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden border-t border-white/15 p-4 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:block">
          <div className="rounded-lg bg-white/8 p-4">
            <p className="truncate text-sm font-semibold text-white">{user?.fullName}</p>
            <p className="mt-1 truncate text-xs text-white/65">{user?.email}</p>
            <Badge className="mt-3" variant="accent">{roleDisplayName}</Badge>
          </div>
          <Button className="mt-3 w-full text-white hover:bg-white/10" onClick={handleLogout} variant="ghost">
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="lg:ml-72 lg:min-h-svh lg:flex-1">
        <header className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-white/75 px-5 py-4 backdrop-blur lg:px-8">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">Welcome back</p>
            <p className="font-semibold text-[var(--color-primary)]">{user?.fullName ?? 'Lucid learner'}</p>
          </div>
          <Button className="lg:hidden" onClick={handleLogout} variant="ghost">
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </Button>
        </header>
        <main className="px-5 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
