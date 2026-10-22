import { type NextFunction, type Request, type Response } from 'express';

import { HttpCode } from '../../shared/http-code.constant.js';
import { ErrorCode } from '../../shared/error-code.constant.js';
import { ResponseUtils } from '../response/response-utils.js';
import { verifyUserToken } from '../utils/auth.utils.js';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return ResponseUtils.sendResponse(res, {
      message: 'Unauthorized',
      code: ErrorCode.AUTHENTICATION_REQUIRED,
      httpStatus: HttpCode.UNAUTHORIZED,
      data: null,
    });
  }

  const token = authorization.slice(7);
  const user = verifyUserToken(token);
  if (!user) {
    return ResponseUtils.sendResponse(res, {
      message: 'Invalid or expired token',
      code: ErrorCode.AUTHENTICATION_REQUIRED,
      httpStatus: HttpCode.UNAUTHORIZED,
      data: null,
    });
  }

  req.user = user;

  return next();
}