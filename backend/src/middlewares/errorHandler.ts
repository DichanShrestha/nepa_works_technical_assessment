import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { sendErrorResponse } from '../utils/response';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  if (env.NODE_ENV === 'development' && !(err instanceof AppError)) {
    console.error('Unhandled Error:', err);
  }

  sendErrorResponse(res, {
    statusCode,
    message,
    ...(env.NODE_ENV === 'development' && { error: { stack: err.stack } }),
  });
};
