import { AppException } from './app.exception';
import { ErrorCode } from '../../../shared/error-code.constant';

/**
 * 前端呼叫 API 錯誤
 */
export class ApiException extends AppException {
  constructor(
    public readonly code: ErrorCode,
    message?: string,
  ) {
    super(message);
    this.name = 'ApiException';
  }
}