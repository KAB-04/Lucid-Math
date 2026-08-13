import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LogOut,
  Menu,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { getRoleDisplayName, type AuthRole } from '../../types/auth'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import type { NavItem } from './navigation'
import { Logo } from '../common/Logo'

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
    toast.success('Signed out successfully.')
    navigate(APP_ROUTES.login, { replace: true })
  }

  return (
    <div className="min-h-svh bg-[var(--color-background)] text-[var(--color-text)] lg:flex">
      <aside className="border-b border-white/15 bg-[var(--color-primary)] text-white shadow-[0_24px_60px_rgba(47,54,59,0.18)] lg:fixed lg:inset-y-4 lg:left-4 lg:flex lg:w-72 lg:flex-col lg:overflow-hidden lg:rounded-2xl lg:border lg:border-white/15">
        <div className="flex shrink-0 items-center justify-between border-b border-white/15 bg-white/5 px-5 py-4 backdrop-blur lg:block lg:px-5 lg:py-5">
          <div className="flex items-center gap-3">
            <Logo
              className="rounded-md bg-white p-1.5"
              imageClassName="h-11 w-11"
              variant="compact"
            />
            <h1 className="text-base font-semibold leading-tight text-white">
              {getRoleDisplayName(role)} Workspace
            </h1>
          </div>
          <Menu aria-hidden="true" className="h-6 w-6 lg:hidden" />
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 py-3 lg:grid lg:flex-1 lg:content-start lg:gap-2 lg:overflow-y-auto lg:px-4 lg:py-3">
          {navigation.map((item) => (
            <NavLink className={navLinkClass} key={item.path} to={item.path}>
              {item.icon}
              <span className="whitespace-nowrap">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden shrink-0 border-t border-white/15 p-4 lg:block">
          <div className="rounded-lg border border-white/12 bg-white/10 p-4 backdrop-blur">
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

      <div className="lg:ml-80 lg:min-h-svh lg:flex-1">
        <header className="flex items-center justify-between gap-4 border-b border-white/65 bg-white/58 px-5 py-4 shadow-sm backdrop-blur-xl lg:mx-4 lg:mt-4 lg:rounded-2xl lg:border lg:px-8">
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">Welcome back</p>
            <p className="font-semibold text-[var(--color-primary)]">{user?.fullName ?? 'Lucid learner'}</p>
          </div>
          <Button className="lg:hidden" onClick={handleLogout} variant="ghost">
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sign out
          </Button>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-5 lg:px-6 lg:py-6">
          <div className="min-h-[calc(100svh-8rem)] rounded-3xl border border-white/65 bg-white/38 p-4 shadow-[0_24px_70px_rgba(47,54,59,0.08)] backdrop-blur-xl ring-1 ring-white/35 sm:p-5 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
