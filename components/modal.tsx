'use client';

import type { ReactNode } from 'react';
import { useModal } from '@/hooks/modal';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';

interface ModalProps {
  modalKey: string;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  widthClass?: string;
  onClose?: () => void;
}

export function Modal(props: ModalProps) {
  const modal = useModal(props.modalKey);

  const closeModal = () => {
    modal.hide();
    props.onClose?.();
  };

  return (
    <>
      <button
        type="button"
        aria-label="modal overlay"
        onClick={closeModal}
        className={cn(
          'fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-200',
          modal.isShow
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0',
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 transform rounded-2xl bg-white shadow-2xl transition-all duration-200',
          props.widthClass,
          modal.isShow
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0',
        )}
      >
        <div className="flex max-h-[80vh] flex-col">
          <div className="flex items-center justify-between border-b border-slate-300 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {props.title}
            </h2>
            <button
              type="button"
              onClick={closeModal}
              className="bg-secondary hover:bg-secondary/90 flex items-center gap-1.5 rounded-full p-1.5 text-sm font-medium text-white transition"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {props.children}
          </div>
          {props.footer && (
            <div className="border-t border-slate-300 px-6 py-4">
              {props.footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
