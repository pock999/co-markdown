import { ErrorCode } from '../../../shared/error-code.constant.js';
import { HttpCode } from '../../../shared/http-code.constant.js';

/**
 * 後端錯誤 Base
 */
export class AppException extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly httpStatus: HttpCode,
    message?: string,
  ) {
    super(message);
    this.name = 'AppException';
  }
}