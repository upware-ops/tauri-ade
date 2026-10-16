import type { ReactNode } from 'react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'

interface SettingsFieldProps {
  htmlFor: string
  label: string
  children: ReactNode
  description?: string
}

interface SettingsSectionProps {
  title: string
  children: ReactNode
}

export function SettingsField({
  htmlFor,
  label,
  children,
  description,
}: SettingsFieldProps) {
  return (
    <Field className="settings-field">
      <FieldContent className="settings-field-copy">
        <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
        {description && (
          <FieldDescription id={`${htmlFor}-description`}>
            {description}
          </FieldDescription>
        )}
      </FieldContent>
      <div className="settings-field-control">{children}</div>
    </Field>
  )
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <section className="settings-section">
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  )
}
