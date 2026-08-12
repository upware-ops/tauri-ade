import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function Default() {
  return (
    <div className="grid w-[280px] gap-2">
      <Label htmlFor="select-theme">Color Theme</Label>
      <Select defaultValue="system">
        <SelectTrigger id="select-theme">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export function Grouped() {
  return (
    <div className="grid w-[280px] gap-2">
      <Label htmlFor="select-language">Language</Label>
      <Select defaultValue="en">
        <SelectTrigger id="select-language">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>System</SelectLabel>
            <SelectItem value="auto">System Default</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Available</SelectLabel>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export function States() {
  return (
    <div className="grid w-[280px] gap-4">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">Example Option 1</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="one" disabled>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">Example Option 1</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger aria-invalid>
          <SelectValue placeholder="Required" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">Example Option 1</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
