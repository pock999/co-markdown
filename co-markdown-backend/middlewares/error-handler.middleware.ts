import type {
  NextFunction,
  Request,
  Response,
} from 'express';


import { HttpCode } from '../../shared/http-code.constant.js';
import { ErrorCode } from '../../shared/error-code.constant.js';
import { ResponseUtils } from '../response/response-utils.js';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  return ResponseUtils.sendResponse(res, {
    message: 'Internal Server Error',
    code: ErrorCode.UNKNOWN_ERROR,
    httpStatus: HttpCode.INTERNAL_SERVER_ERROR,
    data: null,
  });
}