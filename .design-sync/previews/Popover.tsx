import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function Open() {
  return (
    <div className="flex justify-center pt-2">
      <Popover open modal={false}>
        <PopoverTrigger asChild>
          <Button variant="outline">Ignore globs</Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80"
          align="center"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <div className="grid gap-3">
            <div className="space-y-1">
              <h4 className="text-sm leading-none font-medium">Ignore globs</h4>
              <p className="text-muted-foreground text-sm">
                Paths matching these patterns are never indexed.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="popover-glob">Pattern</Label>
              <Input id="popover-glob" defaultValue="**/node_modules/**" />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
