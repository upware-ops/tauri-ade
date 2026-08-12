import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { FolderOpen, Search } from 'lucide-react'

export function Default() {
  return (
    <Empty className="w-[420px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpen />
        </EmptyMedia>
        <EmptyTitle>No workspace open</EmptyTitle>
        <EmptyDescription>
          Open a folder to start indexing files and searching across them.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Open folder…</Button>
      </EmptyContent>
    </Empty>
  )
}

export function NoResults() {
  return (
    <Empty className="w-[420px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search />
        </EmptyMedia>
        <EmptyTitle>No matching commands</EmptyTitle>
        <EmptyDescription>
          Try a different search term, or browse all commands.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
