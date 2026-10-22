import { type Request, type Response, type NextFunction } from 'express';

import { HttpCode } from '../../shared/http-code.constant.js';
import { ErrorCode } from '../../shared/error-code.constant.js';
import { ResponseUtils } from '../response/response-utils.js';
import { verifyUserToken } from '../utils/auth.utils.js';

export function identifyUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  // 沒有 Token：視為 Guest
  if (!authorization) {
    return next();
  }

  // 有提供 Token，就必須是有效的 Bearer Token
  const [scheme, token, ...extra] = authorization.split(' ');

  if (
    scheme !== 'Bearer' ||
    !token ||
    extra.length > 0
  ) {
    return ResponseUtils.sendResponse(res, {
      message: 'Invalid authorization header',
      code: ErrorCode.AUTHENTICATION_REQUIRED,
      httpStatus: HttpCode.UNAUTHORIZED,
      data: null,
    });
  }

  const user = verifyUserToken(token);
  if (!user) {
    return ResponseUtils.sendResponse(res, {
      message: 'Invalid or expired token',
      code: ErrorCode.AUTHENTICATION_REQUIRED,
      httpStatus: HttpCode.UNAUTHORIZED,
      data: null,
    });
  }

  // 設定已登入使用者資訊，供後續 Controller 使用
  req.user = user;

  return next();
}