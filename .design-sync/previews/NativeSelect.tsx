import { Label } from '@/components/ui/label'
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from '@/components/ui/native-select'

export function Default() {
  return (
    <div className="grid w-[280px] gap-2">
      <Label htmlFor="native-theme">Color Theme</Label>
      <NativeSelect
        id="native-theme"
        defaultValue="system"
        className="w-[280px]"
      >
        <NativeSelectOption value="light">Light</NativeSelectOption>
        <NativeSelectOption value="dark">Dark</NativeSelectOption>
        <NativeSelectOption value="system">System</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}

export function Grouped() {
  return (
    <NativeSelect defaultValue="en" className="w-[280px]">
      <NativeSelectOptGroup label="System">
        <NativeSelectOption value="auto">System Default</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Available">
        <NativeSelectOption value="en">English</NativeSelectOption>
        <NativeSelectOption value="de">Deutsch</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  )
}

export function States() {
  return (
    <div className="grid gap-4">
      <NativeSelect defaultValue="one" disabled className="w-[280px]">
        <NativeSelectOption value="one">Example Option 1</NativeSelectOption>
      </NativeSelect>
      <NativeSelect defaultValue="one" aria-invalid className="w-[280px]">
        <NativeSelectOption value="one">Example Option 1</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
