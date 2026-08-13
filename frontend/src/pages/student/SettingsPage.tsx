import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Eye, Monitor, RotateCcw, Trash2 } from 'lucide-react'
import { normalizeApiError } from '../../api/error'
import { AccountSettings } from '../../components/settings/AccountSettings'
import { LearningPreferences } from '../../components/settings/LearningPreferences'
import { NotificationSettings } from '../../components/settings/NotificationSettings'
import { SecuritySettings } from '../../components/settings/SecuritySettings'
import { SettingsSection } from '../../components/settings/SettingsSection'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { learnerProfileService } from '../../services/learnerProfileService'
import { studentProfileService } from '../../services/studentProfileService'
import type { FrontendApiError } from '../../types/api'
import type { LearnerProfileDto } from '../../types/dashboard'
import type {
  LocalLearningPreferences,
  LocalNotificationSettings,
  StudentProfileDto,
} from '../../types/settings'

const defaultLearningPreferences: LocalLearningPreferences = {
  explanationDetail: 'Balanced',
  difficultyPreference: 'Adaptive',
  showHintsAutomatically: true,
  stepByStepSolutions: true,
  practiceReminders: true,
}

const defaultNotifications: LocalNotificationSettings = {
  assessmentReminders: true,
  studyReminders: true,
  progressUpdates: false,
}

const fallbackTeachingStyle = 'Adaptive guidance'

export const SettingsPage = () => {
  const navigate = useNavigate()
  const { logout, roleDisplayName, user } = useAuth()
  const [profile, setProfile] = useState<StudentProfileDto | null>(null)
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfileDto | null>(null)
  const [error, setError] = useState<FrontendApiError | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingAccount, setIsSavingAccount] = useState(false)
  const [accountForm, setAccountForm] = useState({ fullName: '', educationLevel: '' })
  const [learningPreferences, setLearningPreferences] = useState(defaultLearningPreferences)
  const [notifications, setNotifications] = useState(defaultNotifications)
  const [appearance, setAppearance] = useState<'Light' | 'Dark' | 'System'>('System')
  const [pendingConfirmation, setPendingConfirmation] = useState<'clearTutor' | 'resetPreferences' | 'deleteAccount' | null>(null)

  const teachingStyle = useMemo(
    () => learnerProfile?.teachingApproach || fallbackTeachingStyle,
    [learnerProfile],
  )

  const loadSettings = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)

    try {
      const [studentProfile, nextLearnerProfile] = await Promise.all([
        studentProfileService.getMine(signal),
        learnerProfileService.getMine(signal),
      ])

      setProfile(studentProfile)
      setLearnerProfile(nextLearnerProfile)
      setAccountForm({
        fullName: studentProfile.fullName,
        educationLevel: studentProfile.educationLevel,
      })
    } catch (requestError) {
      if (!signal?.aborted) {
        setError(normalizeApiError(requestError))
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    void loadSettings(controller.signal)
    return () => controller.abort()
  }, [loadSettings])

  const handleAccountChange = (field: 'fullName' | 'educationLevel', value: string) => {
    setAccountForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  const handleSaveAccount = async () => {
    if (!accountForm.fullName.trim() || !accountForm.educationLevel.trim()) {
      toast.error('Full name and education level are required.')
      return
    }

    setIsSavingAccount(true)

    try {
      const updatedProfile = await studentProfileService.updateMine({
        FullName: accountForm.fullName.trim(),
        EducationLevel: accountForm.educationLevel.trim(),
      })
      setProfile(updatedProfile)
      setAccountForm({
        fullName: updatedProfile.fullName,
        educationLevel: updatedProfile.educationLevel,
      })
      toast.success('Settings saved successfully.')
    } catch (requestError) {
      const apiError = normalizeApiError(requestError)
      toast.error(apiError.message)
    } finally {
      setIsSavingAccount(false)
    }
  }

  const handleLearningPreferenceChange = <TKey extends keyof LocalLearningPreferences>(
    key: TKey,
    value: LocalLearningPreferences[TKey],
  ) => {
    setLearningPreferences((currentPreferences) => ({
      ...currentPreferences,
      [key]: value,
    }))
  }

  const handleNotificationChange = <TKey extends keyof LocalNotificationSettings>(
    key: TKey,
    value: LocalNotificationSettings[TKey],
  ) => {
    setNotifications((currentNotifications) => ({
      ...currentNotifications,
      [key]: value,
    }))
  }

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully.')
    navigate(APP_ROUTES.login, { replace: true })
  }

  const handleConfirmAction = () => {
    if (pendingConfirmation === 'clearTutor') {
      toast.success('Local AI Tutor conversation history cleared.')
    }

    if (pendingConfirmation === 'resetPreferences') {
      setLearningPreferences(defaultLearningPreferences)
      setNotifications(defaultNotifications)
      toast.success('Local learning preferences reset.')
    }

    if (pendingConfirmation === 'deleteAccount') {
      toast.error('Account deletion is not available until the backend endpoint exists.')
    }

    setPendingConfirmation(null)
  }

  const roleLabel = roleDisplayName ?? user?.role ?? 'Student'

  return (
    <section className="grid gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--color-primary)]">
          Manage your Lucid workspace
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
          Update account details, review learning preferences, and manage local workspace options.
        </p>
      </div>

      {isLoading ? <LoadingSpinner label="Loading settings" /> : null}

      {error ? (
        <Alert title="Settings unavailable" variant="danger">
          {error.message}
          <div className="mt-3">
            <Button onClick={() => void loadSettings()}>Retry</Button>
          </div>
        </Alert>
      ) : null}

      {!isLoading && !error ? (
        <>
          <AccountSettings
            form={accountForm}
            isSaving={isSavingAccount}
            onChange={handleAccountChange}
            onSubmit={() => void handleSaveAccount()}
            profile={profile}
            roleLabel={roleLabel}
          />

          <LearningPreferences
            onChange={handleLearningPreferenceChange}
            preferences={learningPreferences}
            teachingStyle={teachingStyle}
          />

          <SettingsSection
            description="Theme controls are prepared here, but the current Lucid design does not yet include a full theme provider."
            title="Appearance"
          >
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <Select
                label="Display mode"
                onChange={(event) => setAppearance(event.target.value as 'Light' | 'Dark' | 'System')}
                value={appearance}
              >
                <option value="Light">Light mode</option>
                <option value="Dark">Dark mode</option>
                <option value="System">System/default mode</option>
              </Select>
              <p className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Monitor aria-hidden="true" className="h-4 w-4" />
                Stored locally for future theme support.
              </p>
            </div>
          </SettingsSection>

          <NotificationSettings
            notifications={notifications}
            onChange={handleNotificationChange}
          />

          <SettingsSection
            description="These actions are local or informational until matching backend endpoints are available."
            title="Privacy and data"
          >
            <div className="flex flex-wrap gap-3">
              <Button disabled title="Learning data is already visible in Learner Profile and Learning History." variant="secondary">
                <Eye aria-hidden="true" className="h-4 w-4" />
                View learning data
              </Button>
              <Button onClick={() => setPendingConfirmation('clearTutor')} variant="ghost">
                <Trash2 aria-hidden="true" className="h-4 w-4" />
                Clear AI Tutor history
              </Button>
              <Button onClick={() => setPendingConfirmation('resetPreferences')} variant="ghost">
                <RotateCcw aria-hidden="true" className="h-4 w-4" />
                Reset learning preferences
              </Button>
            </div>
          </SettingsSection>

          <SecuritySettings onLogout={handleLogout} />

          <SettingsSection
            description="Permanent account deletion needs a backend endpoint and stronger confirmation before it can be enabled."
            title="Danger zone"
          >
            <Button onClick={() => setPendingConfirmation('deleteAccount')} variant="danger">
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Delete account
            </Button>
          </SettingsSection>
        </>
      ) : null}

      <Modal
        isOpen={pendingConfirmation !== null}
        onClose={() => setPendingConfirmation(null)}
        title="Confirm action"
      >
        <p className="text-sm leading-6 text-[var(--color-text-muted)]">
          This action affects local settings or requires backend support. Please confirm that you want to continue.
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <Button onClick={() => setPendingConfirmation(null)} variant="ghost">Cancel</Button>
          <Button onClick={handleConfirmAction} variant={pendingConfirmation === 'deleteAccount' ? 'danger' : 'primary'}>
            Confirm
          </Button>
        </div>
      </Modal>
    </section>
  )
}
