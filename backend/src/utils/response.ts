import { Response } from 'express';

export interface ApiResponseOptions<T = unknown> {
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponseOptions {
  statusCode?: number;
  message: string;
  error?: unknown;
}

export const sendResponse = <T>(res: Response, options: ApiResponseOptions<T>): Response => {
  const { statusCode = 200, message, data, meta } = options;
  return res.status(statusCode).json({
    success: true,
    ...(message && { message }),
    ...(data !== undefined && { data }),
    ...(meta && { meta }),
  });
};

export const sendErrorResponse = (res: Response, options: ApiErrorResponseOptions): Response => {
  const { statusCode = 500, message, error } = options;
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error !== undefined && { error }),
  });
};
