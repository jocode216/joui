import { create } from 'zustand';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
  confirmText: string;
  cancelText: string;
  variant: 'default' | 'destructive';
}

interface ConfirmDialogStore extends ConfirmDialogState {
  openConfirm: (options: {
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
  }) => void;
  closeConfirm: () => void;
}

export const useConfirmDialog = create<ConfirmDialogStore>((set) => ({
  isOpen: false,
  title: '',
  description: '',
  onConfirm: null,
  onCancel: null,
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'default',
  openConfirm: (options) =>
    set({
      isOpen: true,
      title: options.title,
      description: options.description,
      onConfirm: options.onConfirm,
      onCancel: options.onCancel || null,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      variant: options.variant || 'default',
    }),
  closeConfirm: () =>
    set({
      isOpen: false,
      title: '',
      description: '',
      onConfirm: null,
      onCancel: null,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      variant: 'default',
    }),
}));
