import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function States() {
  return (
    <div className="flex items-center gap-6">
      <Switch defaultChecked aria-label="On" />
      <Switch aria-label="Off" />
      <Switch defaultChecked disabled aria-label="On and disabled" />
      <Switch disabled aria-label="Disabled" />
    </div>
  )
}

export function SettingsRows() {
  return (
    <div className="grid w-[340px] gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="sw-toggle">Example Toggle Setting</Label>
        <Switch id="sw-toggle" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="sw-updates">Automatic updates</Label>
        <Switch id="sw-updates" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="sw-advanced">Example Advanced Toggle</Label>
        <Switch id="sw-advanced" disabled />
      </div>
    </div>
  )
}
