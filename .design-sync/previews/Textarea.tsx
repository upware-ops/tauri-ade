import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function Default() {
  return (
    <div className="grid w-[360px] gap-2">
      <Label htmlFor="textarea-notes">Release notes</Label>
      <Textarea
        id="textarea-notes"
        defaultValue={
          'Rewritten preferences pane.\nFaster window restore on cold start.\nFixed the global shortcut on Windows.'
        }
      />
    </div>
  )
}

export function Placeholder() {
  return (
    <div className="grid w-[360px] gap-2">
      <Label htmlFor="textarea-feedback">Feedback</Label>
      <Textarea
        id="textarea-feedback"
        placeholder="Describe what happened before the crash…"
      />
    </div>
  )
}

export function States() {
  return (
    <div className="grid w-[360px] gap-4">
      <Textarea defaultValue="Disabled content" disabled />
      <Textarea defaultValue="Too short" aria-invalid />
    </div>
  )
}
