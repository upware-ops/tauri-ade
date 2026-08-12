import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Cog, FolderOpen, RefreshCw, Trash2 } from 'lucide-react'

export function Open() {
  return (
    <div className="flex justify-center pt-2">
      <DropdownMenu open modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Workspace</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-56"
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <DropdownMenuLabel>tauri-ade</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <FolderOpen />
              Open folder…
              <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RefreshCw />
              Reindex
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Cog />
              Preferences
              <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>
            Watch for changes
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2 />
            Remove workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
