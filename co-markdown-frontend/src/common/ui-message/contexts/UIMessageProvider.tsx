
import {
  createContext,
  useCallback,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { Notification } from '../components/Notification';
import { Dialog } from '../components/Dialog';
import type {
  DialogMessage,
  NotificationMessage,
} from '../ui-message';

interface UIMessageContextValue {
  notify: (message: NotificationMessage) => void;
  confirm: (message: DialogMessage) => Promise<boolean>;
}

interface NotificationItem {
  id: number;
  message: NotificationMessage;
}

interface PendingDialog {
  message: DialogMessage;
  resolve: (confirmed: boolean) => void;
}

/* eslint-disable react-refresh/only-export-components */
export const UIMessageContext =
  createContext<UIMessageContextValue | null>(null);

interface UIMessageProviderProps {
  children: ReactNode;
}

export function UIMessageProvider({
  children,
}: UIMessageProviderProps) {
  const [notifications, setNotifications] = useState<
    NotificationItem[]
  >([]);
  const [dialog, setDialog] = useState<PendingDialog | null>(null);

  const notify = useCallback((message: NotificationMessage) => {
    const id = Date.now() + Math.random();

    setNotifications((current) => [
      ...current,
      { id, message },
    ]);
  }, []);

  const closeNotification = useCallback((id: number) => {
    setNotifications((current) =>
      current.filter((item) => item.id !== id),
    );
  }, []);

  const confirm = useCallback(
    (message: DialogMessage): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        setDialog((current) => {
          if (current) {
            current.resolve(false);
          }

          return { message, resolve };
        });
      });
    },
    [],
  );

  const resolveDialog = useCallback((confirmed: boolean) => {
    setDialog((current) => {
      current?.resolve(confirmed);
      return null;
    });
  }, []);

  return (
    <UIMessageContext.Provider value={{ notify, confirm }}>
      {children}

      <div
        className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-md flex-col gap-3"
        aria-label="Notifications"
      >
        {notifications.map(({ id, message }) => (
          <div key={id} className="pointer-events-auto">
            <Notification
              notification={message}
              onClose={() => closeNotification(id)}
            />
          </div>
        ))}
      </div>

      {dialog && (
        <Dialog
          dialog={dialog.message}
          onConfirm={() => resolveDialog(true)}
          onCancel={() => resolveDialog(false)}
          onClose={() => resolveDialog(false)}
        />
      )}
    </UIMessageContext.Provider>
  );
}
