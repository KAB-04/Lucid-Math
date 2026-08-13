interface SettingsToggleProps {
  checked: boolean
  description?: string
  label: string
  onChange: (checked: boolean) => void
}

export const SettingsToggle = ({
  checked,
  description,
  label,
  onChange,
}: SettingsToggleProps) => (
  <label className="flex items-center justify-between gap-4 rounded-md border border-[var(--color-border)] bg-white px-4 py-3">
    <span>
      <span className="block text-sm font-semibold text-[var(--color-primary)]">{label}</span>
      {description ? (
        <span className="mt-1 block text-sm leading-5 text-[var(--color-text-muted)]">{description}</span>
      ) : null}
    </span>
    <input
      checked={checked}
      className="h-5 w-5 accent-[var(--color-primary)]"
      onChange={(event) => onChange(event.target.checked)}
      type="checkbox"
    />
  </label>
)
