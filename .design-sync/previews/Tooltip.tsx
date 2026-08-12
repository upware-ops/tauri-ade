import { Button } from '@/components/ui/button'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Search } from 'lucide-react'

export function Open() {
  return (
    <TooltipProvider>
      <div className="flex justify-center pt-14">
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Search">
              <Search />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Search this workspace</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export function WithShortcut() {
  return (
    <TooltipProvider>
      <div className="flex justify-center pt-14">
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button variant="outline">Quick pane</Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="flex items-center gap-2">
            Toggle quick pane
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>⇧</Kbd>
              <Kbd>Space</Kbd>
            </KbdGroup>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
