import { Request, Response, NextFunction } from 'express';
import { FailedResponse } from '../types/api.types';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  const response: FailedResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
    data: null,
    errors: {
      details: {
        message: err.message,
      },
    },
  };

  res.json(response);
};