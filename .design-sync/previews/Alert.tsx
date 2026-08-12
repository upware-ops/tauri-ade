import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Info } from 'lucide-react'

export function Default() {
  return (
    <Alert className="w-[420px]">
      <Info />
      <AlertTitle>Update available</AlertTitle>
      <AlertDescription>
        Version 0.2.0 is ready to install. The app will restart once applied.
      </AlertDescription>
    </Alert>
  )
}

export function Destructive() {
  return (
    <Alert variant="destructive" className="w-[420px]">
      <AlertTriangle />
      <AlertTitle>Could not save preferences</AlertTitle>
      <AlertDescription>
        The preferences file is read-only. Check permissions and try again.
      </AlertDescription>
    </Alert>
  )
}

export function TitleOnly() {
  return (
    <Alert className="w-[420px]">
      <Info />
      <AlertTitle>Indexing finished — 1,284 files</AlertTitle>
    </Alert>
  )
}
