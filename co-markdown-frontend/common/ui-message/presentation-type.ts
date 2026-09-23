export const PresentationType = {
  NOTIFICATION: 'notification',
  DIALOG: 'dialog',
} as const;

export type PresentationType = typeof PresentationType[keyof typeof PresentationType];