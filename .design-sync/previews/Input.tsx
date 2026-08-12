import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Default() {
  return (
    <div className="grid w-[320px] gap-2">
      <Label htmlFor="input-name">Workspace name</Label>
      <Input id="input-name" defaultValue="tauri-ade" />
    </div>
  )
}

export function Placeholder() {
  return (
    <div className="grid w-[320px] gap-2">
      <Label htmlFor="input-example">Example Text Setting</Label>
      <Input id="input-example" placeholder="Enter example text" />
    </div>
  )
}

export function States() {
  return (
    <div className="grid w-[320px] gap-4">
      <Input defaultValue="Read-only value" readOnly />
      <Input placeholder="Disabled" disabled />
      <Input defaultValue="Not a valid path" aria-invalid />
    </div>
  )
}

export function Types() {
  return (
    <div className="grid w-[320px] gap-4">
      <Input type="search" placeholder="Search commands" />
      <Input type="email" defaultValue="team@example.com" />
      <Input type="password" defaultValue="hunter2" />
    </div>
  )
}
