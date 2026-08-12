import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function Default() {
  return (
    <RadioGroup defaultValue="system" className="gap-3">
      <Label htmlFor="rg-light" className="gap-3 font-normal">
        <RadioGroupItem value="light" id="rg-light" />
        Light
      </Label>
      <Label htmlFor="rg-dark" className="gap-3 font-normal">
        <RadioGroupItem value="dark" id="rg-dark" />
        Dark
      </Label>
      <Label htmlFor="rg-system" className="gap-3 font-normal">
        <RadioGroupItem value="system" id="rg-system" />
        System
      </Label>
    </RadioGroup>
  )
}

export function Horizontal() {
  return (
    <RadioGroup defaultValue="compact" className="flex flex-row gap-6">
      <Label htmlFor="rg-compact" className="gap-2 font-normal">
        <RadioGroupItem value="compact" id="rg-compact" />
        Compact
      </Label>
      <Label htmlFor="rg-cosy" className="gap-2 font-normal">
        <RadioGroupItem value="cosy" id="rg-cosy" />
        Cosy
      </Label>
    </RadioGroup>
  )
}

export function Disabled() {
  return (
    <RadioGroup defaultValue="stable" disabled className="gap-3">
      <Label htmlFor="rg-stable" className="gap-3 font-normal">
        <RadioGroupItem value="stable" id="rg-stable" />
        Stable channel
      </Label>
      <Label htmlFor="rg-beta" className="gap-3 font-normal">
        <RadioGroupItem value="beta" id="rg-beta" />
        Beta channel
      </Label>
    </RadioGroup>
  )
}
