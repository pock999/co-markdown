export const ErrorCode = {
  // 缺少必要欄位、格式錯誤，常配 400
  INVALID_REQUEST: 'INVALID_REQUEST',
  // 身份驗證不 OK ，常配 401 
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  // 沒有權限 ，常配 403
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  // 資源不存在，常配 404
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  // 資源衝突，常配 409
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  // db, be service 發生錯誤，常配 500
  INTERNAL_ERROR: 'INTERNAL_ERROR',

  // 預期外的 Error，通常配 500
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];