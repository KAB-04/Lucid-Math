import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Monitor } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { SettingsSection } from '../../components/settings/SettingsSection'
import { SettingsToggle } from '../../components/settings/SettingsToggle'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'

export const TeacherSettingsPage = () => {
  const navigate = useNavigate()
  const { logout, roleDisplayName, user } = useAuth()
  const [duration, setDuration] = useState(30)
  const [passingScore, setPassingScore] = useState(60)
  const [difficulty, setDifficulty] = useState('Adaptive')
  const [notifications, setNotifications] = useState({
    activity: true,
    completion: true,
    lowPerformance: true,
  })
  const [appearance, setAppearance] = useState('System')

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully.')
    navigate(APP_ROUTES.login, { replace: true })
  }

  return (
    <section className="grid gap-6">
      <AdminPageHeader description="Manage teacher workspace preferences. Backend persistence for these preferences is not available yet." title="Settings" />
      <SettingsSection title="Account">
        <div className="grid gap-4 md:grid-cols-3">
          <Input disabled label="Full name" value={user?.fullName ?? ''} />
          <Input disabled label="Email" value={user?.email ?? ''} />
          <Input disabled label="Role" value={roleDisplayName ?? 'Teacher'} />
        </div>
      </SettingsSection>
      <SettingsSection description="These defaults are local UI state until teacher preference APIs are added." title="Teaching preferences">
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Default assessment duration" onChange={(event) => setDuration(Number(event.target.value))} type="number" value={duration} />
          <Input label="Default passing score" onChange={(event) => setPassingScore(Number(event.target.value))} type="number" value={passingScore} />
          <Select label="Default difficulty" onChange={(event) => setDifficulty(event.target.value)} value={difficulty}><option>Adaptive</option><option>Foundation</option><option>Developing</option><option>Challenge</option></Select>
        </div>
      </SettingsSection>
      <SettingsSection title="Notifications">
        <div className="grid gap-3">
          <SettingsToggle checked={notifications.activity} label="Student activity notifications" onChange={(checked) => setNotifications((current) => ({ ...current, activity: checked }))} />
          <SettingsToggle checked={notifications.completion} label="Assessment completion notifications" onChange={(checked) => setNotifications((current) => ({ ...current, completion: checked }))} />
          <SettingsToggle checked={notifications.lowPerformance} label="Low-performance alerts" onChange={(checked) => setNotifications((current) => ({ ...current, lowPerformance: checked }))} />
        </div>
      </SettingsSection>
      <SettingsSection title="Appearance">
        <Select label="Display mode" onChange={(event) => setAppearance(event.target.value)} value={appearance}><option>Light</option><option>Dark</option><option>System</option></Select>
        <p className="mt-3 flex items-center gap-2 text-sm text-[var(--color-text-muted)]"><Monitor className="h-4 w-4" /> Theme provider support is shared with the student settings UI and is prepared for future persistence.</p>
      </SettingsSection>
      <SettingsSection title="Security">
        <div className="flex flex-wrap gap-3">
          <Button disabled variant="secondary">Change password</Button>
          <Button onClick={handleLogout} variant="ghost"><LogOut className="h-4 w-4" /> Sign out</Button>
        </div>
        <Alert title="Security note">Password-change APIs are not currently available.</Alert>
      </SettingsSection>
    </section>
  )
}
