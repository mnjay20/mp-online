import { Response } from 'express';

export interface ApiResponseMeta {
  timestamp: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  [key: string]: unknown;
}

export class ApiResponse {
  /**
   * Sends a standardized successful JSON response
   */
  static success<T>(res: Response, data: T, statusCode = 200, meta?: Partial<ApiResponseMeta>): Response {
    return res.status(statusCode).json({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    });
  }

  static created<T>(res: Response, data: T, meta?: Partial<ApiResponseMeta>): Response {
    return this.success(res, data, 201, meta);
  }

  /**
   * Sends a standardized error JSON response
   */
  static error(res: Response, statusCode: number, code: string, message: string, details?: unknown): Response {
    return res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
        details: details || null,
      },
    });
  }
}
