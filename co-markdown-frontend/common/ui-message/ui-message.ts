import { PresentationType } from './presentation-type';
import { MessageType } from './message-type';

export interface BaseUIMessage {
  type: MessageType;
  message: string;
}

export interface NotificationMessage extends BaseUIMessage {
  presentation: typeof PresentationType.NOTIFICATION;
  duration?: number;
}

export interface DialogMessage extends BaseUIMessage {
  presentation: typeof PresentationType.DIALOG;
  confirmText?: string;
  cancelText?: string;
}

export type UIMessage =
  | NotificationMessage
  | DialogMessage;