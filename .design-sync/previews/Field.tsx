import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function Basic() {
  return (
    <FieldGroup className="w-[380px]">
      <Field>
        <FieldLabel htmlFor="field-example-text">
          Example Text Setting
        </FieldLabel>
        <Input id="field-example-text" placeholder="Enter example text" />
        <FieldDescription>
          This is an example text input setting (not persisted).
        </FieldDescription>
      </Field>
    </FieldGroup>
  )
}

export function Invalid() {
  return (
    <FieldGroup className="w-[380px]">
      <Field data-invalid>
        <FieldLabel htmlFor="field-shortcut">Quick Pane Shortcut</FieldLabel>
        <Input id="field-shortcut" defaultValue="Cmd+" aria-invalid />
        <FieldError>Shortcut must include at least one key.</FieldError>
      </Field>
    </FieldGroup>
  )
}

export function Horizontal() {
  return (
    <FieldGroup className="w-[380px]">
      <Field orientation="horizontal">
        <FieldLabel htmlFor="field-launch">Launch at login</FieldLabel>
        <Switch id="field-launch" defaultChecked />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="field-updates">Automatic updates</FieldLabel>
        <Switch id="field-updates" />
      </Field>
    </FieldGroup>
  )
}

export function InFieldSet() {
  return (
    <FieldSet className="w-[380px]">
      <FieldLegend>Appearance</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="field-theme">Color Theme</FieldLabel>
          <Select defaultValue="system">
            <SelectTrigger id="field-theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>
            Choose your preferred color theme.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
