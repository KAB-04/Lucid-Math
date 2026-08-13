import { Select } from '../ui/Select'
import type { LocalLearningPreferences } from '../../types/settings'
import { TeachingStyleBadge } from '../tutor/TeachingStyleBadge'
import { SettingsSection } from './SettingsSection'
import { SettingsToggle } from './SettingsToggle'

interface LearningPreferencesProps {
  onChange: <TKey extends keyof LocalLearningPreferences>(
    key: TKey,
    value: LocalLearningPreferences[TKey],
  ) => void
  preferences: LocalLearningPreferences
  teachingStyle: string
}

export const LearningPreferences = ({
  onChange,
  preferences,
  teachingStyle,
}: LearningPreferencesProps) => (
  <SettingsSection
    description="Lucid automatically recommends a teaching approach based on your assessment and learning behaviour."
    title="Learning preferences"
  >
    <div className="grid gap-4">
      <TeachingStyleBadge style={teachingStyle} />
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Explanation detail level"
          onChange={(event) => onChange('explanationDetail', event.target.value as LocalLearningPreferences['explanationDetail'])}
          value={preferences.explanationDetail}
        >
          <option value="Concise">Concise</option>
          <option value="Balanced">Balanced</option>
          <option value="Detailed">Detailed</option>
        </Select>
        <Select
          label="Difficulty preference"
          onChange={(event) => onChange('difficultyPreference', event.target.value as LocalLearningPreferences['difficultyPreference'])}
          value={preferences.difficultyPreference}
        >
          <option value="Adaptive">Adaptive</option>
          <option value="Foundation">Foundation</option>
          <option value="Developing">Developing</option>
          <option value="Challenge">Challenge</option>
        </Select>
      </div>
      <div className="grid gap-3">
        <SettingsToggle
          checked={preferences.showHintsAutomatically}
          description="Let Lucid offer a hint when you pause during practice."
          label="Show hints automatically"
          onChange={(checked) => onChange('showHintsAutomatically', checked)}
        />
        <SettingsToggle
          checked={preferences.stepByStepSolutions}
          description="Prefer worked steps after you attempt a problem."
          label="Step-by-step solutions"
          onChange={(checked) => onChange('stepByStepSolutions', checked)}
        />
        <SettingsToggle
          checked={preferences.practiceReminders}
          description="Keep gentle reminders visible in the learning workspace."
          label="Practice reminders"
          onChange={(checked) => onChange('practiceReminders', checked)}
        />
      </div>
    </div>
  </SettingsSection>
)
