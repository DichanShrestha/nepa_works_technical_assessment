import { Request, Response } from 'express';
import { sendResponse } from '../utils/response';

export const getHealth = (_req: Request, res: Response): void => {
  sendResponse(res, {
    statusCode: 200,
    message: 'API is running',
  });
};
