'use client';

import type { ReactNode } from 'react';
import { useModal } from '@/hooks/modal';
import { cn } from '@/utils/cn';

interface ModalProps {
  modalKey: string;
  title?: string;
  children: ReactNode;
  widthClass?: string;
  onClose?: () => void;
}

export function Modal({ modalKey, title, children, widthClass = 'max-w-lg', onClose }: ModalProps) {
  const modal = useModal(modalKey);

  const closeModal = () => {
    modal.hide();
    onClose?.();
  };

  return (
    <>
      <button
        type="button"
        aria-label="modal overlay"
        onClick={closeModal}
        className={cn(
          'fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-200',
          modal.isShow ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 transform rounded-2xl bg-white shadow-2xl transition-all duration-200',
          widthClass,
          modal.isShow ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0',
        )}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
          >
            بستن
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </>
  );
}
