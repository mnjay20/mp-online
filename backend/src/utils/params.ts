import { Request } from 'express';

/**
 * Extracts a named route parameter as a single string
 */
export const getParam = (req: Request, paramName = 'id'): string => {
  const val = req.params[paramName];
  if (Array.isArray(val)) {
    return val[0] || '';
  }
  return val || '';
};
