import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function WithInput() {
  return (
    <div className="grid w-[320px] gap-2">
      <Label htmlFor="label-shortcut">Quick Pane Shortcut</Label>
      <Input id="label-shortcut" defaultValue="Cmd+Shift+Space" />
    </div>
  )
}

export function WithCheckbox() {
  return (
    <Label htmlFor="label-launch" className="gap-3">
      <Checkbox id="label-launch" defaultChecked />
      Launch at login
    </Label>
  )
}

export function Disabled() {
  return (
    <div className="group grid w-[320px] gap-2" data-disabled="true">
      <Label htmlFor="label-disabled">Sync folder</Label>
      <Input id="label-disabled" defaultValue="~/Projects" disabled />
    </div>
  )
}
