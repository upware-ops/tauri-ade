import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

// PanelGroup sets height:100% as an INLINE style, which wins over any h-*
// utility on the group itself — the sized wrapper is what gives it a height.

export function Horizontal() {
  return (
    <div className="h-[220px] w-[460px]">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={30}>
          <div className="flex h-full items-center justify-center p-4 text-sm font-medium">
            Sidebar
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <div className="flex h-full items-center justify-center p-4 text-sm font-medium">
            Editor
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export function Nested() {
  return (
    <div className="h-[220px] w-[460px]">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={35}>
          <div className="flex h-full items-center justify-center p-4 text-sm font-medium">
            Files
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={65}>
              <div className="flex h-full items-center justify-center p-4 text-sm font-medium">
                Editor
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={35}>
              <div className="flex h-full items-center justify-center p-4 text-sm font-medium">
                Terminal
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
