
import type { Response } from 'express';
import type { BaseResponse } from './base-response.js';

export class ResponseUtils {
  public static sendResponse<T>(
    res: Response,
    response: BaseResponse<T>,
  ) {
    return res
      .status(response.httpStatus)
      .json(response);
  }
}