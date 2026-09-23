export const MessageType = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export type MessageType = typeof MessageType[keyof typeof MessageType];