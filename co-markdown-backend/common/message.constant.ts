export const MessageConstant = {
  INTERNAL_SERVER_ERROR: 'Internal server error.',
  INVALID_REQUEST: 'Invalid request.',
  RESOURCE_NOT_FOUND: 'Resource not found.',
} as const;

export type MessageConstant = typeof MessageConstant[keyof typeof MessageConstant];