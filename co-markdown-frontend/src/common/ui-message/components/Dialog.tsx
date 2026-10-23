
import { useEffect } from 'react';
import { MessageType } from '../message-type';
import type { DialogMessage } from '../ui-message';

interface DialogProps {
  dialog: DialogMessage;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
}

const dialogStyles: Record<MessageType, string> = {
  [MessageType.SUCCESS]: 'bg-green-100 text-green-800',
  [MessageType.INFO]: 'bg-blue-100 text-blue-800',
  [MessageType.WARNING]: 'bg-amber-100 text-amber-800',
  [MessageType.ERROR]: 'bg-red-100 text-red-800',
};

export function Dialog({
  dialog,
  onConfirm,
  onCancel,
  onClose,
}: DialogProps) {
  const {
    type,
    title,
    message,
    confirmText = '確認',
    cancelText = '取消',
    showCancel = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
  } = dialog;

  useEffect(() => {
    if (!closeOnEscape) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeOnEscape, onClose]);

  function handleOverlayClick(
    event: React.MouseEvent<HTMLDivElement>,
  ) {
    if (
      closeOnOverlayClick &&
      event.target === event.currentTarget
    ) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={handleOverlayClick}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={title ? 'ui-dialog-title' : undefined}
        aria-describedby="ui-dialog-message"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${dialogStyles[type]}`}
          >
            {type === MessageType.SUCCESS && '✓'}
            {type === MessageType.INFO && 'i'}
            {type === MessageType.WARNING && '!'}
            {type === MessageType.ERROR && '×'}
          </span>

          <div className="min-w-0 flex-1">
            {title && (
              <h2
                id="ui-dialog-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}

            <p
              id="ui-dialog-message"
              className={`text-sm leading-6 text-gray-600 ${title ? 'mt-2' : ''}`}
            >
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {showCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {confirmText}
          </button>
        </div>
      </section>
    </div>
  );
}
