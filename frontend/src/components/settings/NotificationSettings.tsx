import type { LocalNotificationSettings } from '../../types/settings'
import { SettingsSection } from './SettingsSection'
import { SettingsToggle } from './SettingsToggle'

interface NotificationSettingsProps {
  notifications: LocalNotificationSettings
  onChange: <TKey extends keyof LocalNotificationSettings>(
    key: TKey,
    value: LocalNotificationSettings[TKey],
  ) => void
}

export const NotificationSettings = ({
  notifications,
  onChange,
}: NotificationSettingsProps) => (
  <SettingsSection
    description="These local preferences prepare the interface for notification support."
    title="Notifications"
  >
    <div className="grid gap-3">
      <SettingsToggle
        checked={notifications.assessmentReminders}
        label="Assessment reminders"
        onChange={(checked) => onChange('assessmentReminders', checked)}
      />
      <SettingsToggle
        checked={notifications.studyReminders}
        label="Study reminders"
        onChange={(checked) => onChange('studyReminders', checked)}
      />
      <SettingsToggle
        checked={notifications.progressUpdates}
        label="Learning progress updates"
        onChange={(checked) => onChange('progressUpdates', checked)}
      />
    </div>
  </SettingsSection>
)
