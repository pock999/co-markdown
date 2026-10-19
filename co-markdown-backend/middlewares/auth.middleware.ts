import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';

import { HttpCode } from '../../shared/http-code.constant.js';
import { ErrorCode } from '../../shared/error-code.constant.js';
import { ResponseUtils } from '../response/response-utils.js';
import config from '../config/config.json' with { type: 'json' };

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

  try {
    const payload = jwt.verify(token, config.jwt.secret);

    if (
      typeof payload === 'string' ||
      typeof payload.sub !== 'string'
    ) {
      return ResponseUtils.sendResponse(res, {
        message: 'Invalid token payload',
        code: ErrorCode.AUTHENTICATION_REQUIRED,
        httpStatus: HttpCode.UNAUTHORIZED,
        data: null,
      });
    }

    req.user = {
      id: payload.sub,
    };

    return next();
  } catch {
    return ResponseUtils.sendResponse(res, {
      message: 'Invalid or expired token',
      code: ErrorCode.AUTHENTICATION_REQUIRED,
      httpStatus: HttpCode.UNAUTHORIZED,
      data: null,
    });
  }
}