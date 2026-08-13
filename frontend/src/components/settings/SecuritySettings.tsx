import { LogOut, LockKeyhole } from 'lucide-react'
import { Button } from '../ui/Button'
import { SettingsSection } from './SettingsSection'

interface SecuritySettingsProps {
  onLogout: () => void
}

export const SecuritySettings = ({ onLogout }: SecuritySettingsProps) => (
  <SettingsSection
    description="Password changes are not connected yet because the backend does not expose that endpoint."
    title="Security"
  >
    <div className="flex flex-wrap gap-3">
      <Button disabled title="Password change API is not available yet." variant="secondary">
        <LockKeyhole aria-hidden="true" className="h-4 w-4" />
        Change password
      </Button>
      <Button onClick={onLogout} variant="ghost">
        <LogOut aria-hidden="true" className="h-4 w-4" />
        Sign out of current session
      </Button>
    </div>
  </SettingsSection>
)
