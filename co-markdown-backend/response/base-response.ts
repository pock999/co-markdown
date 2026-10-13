import { HttpCode } from '../../shared/http-code.constant.js';
import { ErrorCode } from '../../shared/error-code.constant.js';

export interface BaseResponse<T> {
  message: string;
  code: ErrorCode | 'OK';
  httpStatus: HttpCode;
  data: T;
}