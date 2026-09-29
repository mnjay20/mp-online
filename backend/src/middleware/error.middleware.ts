import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { ApiResponse } from '../lib/api-response.js';
import { logger } from '../lib/logger.js';

/**
 * Global Centralized Error Handling Middleware
 */
export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.warn(`Application error [${err.code}]: ${err.message}`, { details: err.details });
    ApiResponse.error(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  // Unexpected / System Exceptions
  logger.error(`Unhandled system exception: ${err.message}`, { stack: err.stack });
  ApiResponse.error(
    res,
    500,
    'INTERNAL_SERVER_ERROR',
    process.env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred.'
      : err.message
  );
};
