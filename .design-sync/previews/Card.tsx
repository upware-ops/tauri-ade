import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function Basic() {
  return (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Update available</CardTitle>
        <CardDescription>
          Version 0.2.0 is ready to install. The app will restart once the
          update has been applied.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Includes a rewritten preferences pane, faster window restore, and
          fixes for the global shortcut on Windows.
        </p>
      </CardContent>
      <CardFooter className="gap-3">
        <Button>Install and restart</Button>
        <Button variant="ghost">Later</Button>
      </CardFooter>
    </Card>
  )
}

export function WithAction() {
  return (
    <Card className="w-[360px]">
      <CardHeader className="border-b">
        <CardTitle>Workspace</CardTitle>
        <CardDescription>
          Local folder indexed for quick search.
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Change
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-2">
          <Label htmlFor="card-workspace-path">Path</Label>
          <Input id="card-workspace-path" defaultValue="~/Projects/tauri-ade" />
        </div>
      </CardContent>
    </Card>
  )
}
