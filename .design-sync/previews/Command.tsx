import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { Cog, FolderOpen, Moon, PanelLeft, Search } from 'lucide-react'

export function Palette() {
  return (
    <Command className="w-[420px] rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem>
            <Search />
            Search files
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <PanelLeft />
            Toggle left sidebar
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <Cog />
            Preferences
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Moon />
            Toggle theme
          </CommandItem>
          <CommandItem>
            <FolderOpen />
            Open folder…
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export function EmptyState() {
  return (
    <Command className="w-[420px] rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search…" value="zzzz" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </Command>
  )
}
