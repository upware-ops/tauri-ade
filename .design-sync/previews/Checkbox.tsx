import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export function States() {
  return (
    <div className="flex items-center gap-6">
      <Checkbox defaultChecked aria-label="Checked" />
      <Checkbox aria-label="Unchecked" />
      <Checkbox defaultChecked disabled aria-label="Checked and disabled" />
      <Checkbox disabled aria-label="Disabled" />
      <Checkbox aria-invalid aria-label="Invalid" />
    </div>
  )
}

export function WithLabels() {
  return (
    <div className="grid gap-3">
      <Label htmlFor="cb-updates" className="gap-3">
        <Checkbox id="cb-updates" defaultChecked />
        Check for updates automatically
      </Label>
      <Label htmlFor="cb-telemetry" className="gap-3">
        <Checkbox id="cb-telemetry" />
        Send anonymous usage data
      </Label>
      <Label htmlFor="cb-beta" className="gap-3">
        <Checkbox id="cb-beta" disabled />
        Join the beta channel
      </Label>
    </div>
  )
}
