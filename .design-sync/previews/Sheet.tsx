import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

export function Open() {
  return (
    <Sheet open modal={false}>
      <SheetContent side="right" onOpenAutoFocus={e => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Workspace settings</SheetTitle>
          <SheetDescription>
            These apply to the currently open folder only.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor="sheet-name">Display name</Label>
            <Input id="sheet-name" defaultValue="tauri-ade" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sheet-ignore">Ignore globs</Label>
            <Input id="sheet-ignore" defaultValue="node_modules, dist" />
          </div>
        </div>
        <SheetFooter>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
