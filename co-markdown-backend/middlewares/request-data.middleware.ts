import { type NextFunction, type Request, type Response } from 'express';

export function requestDataMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.getData = () => ({
    ...req.query,
    ...req.params,
    ...req.body,
  });

  next();
}