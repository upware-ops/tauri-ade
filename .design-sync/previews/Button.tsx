import { Button } from '@/components/ui/button'
import { Check, Download, Trash2 } from 'lucide-react'

export function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Save changes</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="outline">Open folder</Button>
      <Button variant="ghost">Skip</Button>
      <Button variant="destructive">Delete workspace</Button>
      <Button variant="link">Release notes</Button>
    </div>
  )
}

export function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Confirm">
        <Check />
      </Button>
      <Button size="icon-sm" variant="outline" aria-label="Download">
        <Download />
      </Button>
    </div>
  )
}

export function WithIcons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <Download />
        Check for updates
      </Button>
      <Button variant="outline">
        <Check />
        Mark as read
      </Button>
      <Button variant="destructive">
        <Trash2 />
        Remove
      </Button>
    </div>
  )
}

export function Disabled() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Save changes</Button>
      <Button variant="secondary" disabled>
        Cancel
      </Button>
      <Button variant="outline" disabled>
        Open folder
      </Button>
    </div>
  )
}
