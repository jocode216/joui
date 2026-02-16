import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";

export function ConfirmDialog() {
  const {
    isOpen,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    variant,
    closeConfirm,
  } = useConfirmDialog();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    closeConfirm();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    closeConfirm();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && closeConfirm()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : ''
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
