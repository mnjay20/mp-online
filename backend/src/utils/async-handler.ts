import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps asynchronous route handlers to safely catch and forward rejected promises
 * to the global error middleware without explicit try/catch blocks in every controller.
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
