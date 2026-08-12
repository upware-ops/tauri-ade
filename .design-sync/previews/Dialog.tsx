import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Open() {
  return (
    <Dialog open modal={false}>
      <DialogContent
        showCloseButton
        className="sm:max-w-[420px]"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Rename workspace</DialogTitle>
          <DialogDescription>
            This changes the display name only. The folder on disk is left
            untouched.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="dialog-workspace-name">Name</Label>
          <Input id="dialog-workspace-name" defaultValue="tauri-ade" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
