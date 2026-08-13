import { Save } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import type { StudentProfileDto } from '../../types/settings'
import { SettingsSection } from './SettingsSection'

interface AccountSettingsProps {
  form: {
    fullName: string
    educationLevel: string
  }
  isSaving: boolean
  onChange: (field: 'fullName' | 'educationLevel', value: string) => void
  onSubmit: () => void
  profile: StudentProfileDto | null
  roleLabel: string
}

export const AccountSettings = ({
  form,
  isSaving,
  onChange,
  onSubmit,
  profile,
  roleLabel,
}: AccountSettingsProps) => (
  <SettingsSection
    description="Keep your learner account details accurate for reports and progress tracking."
    title="Account"
  >
    <div className="grid gap-4 md:grid-cols-2">
      <Input
        label="Full name"
        name="fullName"
        onChange={(event) => onChange('fullName', event.target.value)}
        value={form.fullName}
      />
      <Input disabled label="Email" name="email" value={profile?.email ?? ''} />
      <Input disabled label="Role" name="role" value={roleLabel} />
      <Input disabled label="Student ID" name="studentId" value={profile ? String(profile.id) : 'Not available'} />
      <Select
        label="Education level"
        name="educationLevel"
        onChange={(event) => onChange('educationLevel', event.target.value)}
        value={form.educationLevel}
      >
        <option value="">Select level</option>
        <option value="JHS">JHS</option>
        <option value="SHS">SHS</option>
        <option value="Pre-University">Pre-University</option>
      </Select>
    </div>
    <div className="mt-5">
      <Button isLoading={isSaving} onClick={onSubmit}>
        <Save aria-hidden="true" className="h-4 w-4" />
        Save changes
      </Button>
    </div>
  </SettingsSection>
)
