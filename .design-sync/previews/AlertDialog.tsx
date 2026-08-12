import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function Open() {
  return (
    <AlertDialog open>
      <AlertDialogContent onOpenAutoFocus={e => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove this workspace?</AlertDialogTitle>
          <AlertDialogDescription>
            The folder stays on disk. Its index and saved settings are deleted
            and cannot be recovered.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
