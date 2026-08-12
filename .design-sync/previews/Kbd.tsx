import { Kbd, KbdGroup } from '@/components/ui/kbd'

export function Single() {
  return (
    <div className="flex items-center gap-3">
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>Esc</Kbd>
      <Kbd>Enter</Kbd>
    </div>
  )
}

export function Combination() {
  return (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>Space</Kbd>
    </KbdGroup>
  )
}

export function InContext() {
  return (
    <div className="grid w-[320px] gap-3 text-sm">
      <div className="flex items-center justify-between">
        <span>Open quick pane</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>Space</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center justify-between">
        <span>Preferences</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>,</Kbd>
        </KbdGroup>
      </div>
    </div>
  )
}
