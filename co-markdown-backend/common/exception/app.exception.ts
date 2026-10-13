import { ErrorCode } from '../../../shared/error-code.constant.js';
import { HttpCode } from '../../../shared/http-code.constant.js';
import { MessageConstant } from '../message.constant.js';
/**
 * 後端錯誤 Base
 */
export class AppException extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly httpStatus: HttpCode,
    message?: string | MessageConstant,
  ) {
    super(message);
    this.name = 'AppException';
  }
}