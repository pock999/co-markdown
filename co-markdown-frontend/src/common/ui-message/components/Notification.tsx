
import { useEffect } from 'react';
import { MessageType } from '../message-type';
import type { NotificationMessage } from '../ui-message';

interface NotificationProps {
  notification: NotificationMessage;
  onClose: () => void;
}

const DEFAULT_DURATION = 3000;

const notificationStyles: Record<MessageType, string> = {
  [MessageType.SUCCESS]:
    'border-green-200 bg-green-50 text-green-800',
  [MessageType.INFO]:
    'border-blue-200 bg-blue-50 text-blue-800',
  [MessageType.WARNING]:
    'border-amber-200 bg-amber-50 text-amber-800',
  [MessageType.ERROR]:
    'border-red-200 bg-red-50 text-red-800',
};

const notificationIcons: Record<MessageType, string> = {
  [MessageType.SUCCESS]: '✓',
  [MessageType.INFO]: 'i',
  [MessageType.WARNING]: '!',
  [MessageType.ERROR]: '×',
};

export function Notification({
  notification,
  onClose,
}: NotificationProps) {
  const { type, message, duration = DEFAULT_DURATION } = notification;

  useEffect(() => {
    if (duration <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(onClose, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [duration, onClose]);

  return (
    <div
      role={type === MessageType.ERROR ? 'alert' : 'status'}
      aria-live={type === MessageType.ERROR ? 'assertive' : 'polite'}
      className={[
        'flex items-start gap-3 rounded-lg border px-4 py-3 shadow-md',
        'min-w-0 max-w-md',
        notificationStyles[type],
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current font-semibold"
      >
        {notificationIcons[type]}
      </span>

      <p className="min-w-0 flex-1 break-words text-sm leading-6">
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="shrink-0 rounded p-1 text-current opacity-70 transition hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
