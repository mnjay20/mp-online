import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { ApiResponse } from '../../lib/api-response.js';
import { UnauthorizedError } from '../../utils/errors.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    const result = await AuthService.register(req.body);
    return ApiResponse.success(res, result, 201);
  }

  static async login(req: Request, res: Response) {
    const result = await AuthService.login(req.body);
    return ApiResponse.success(res, result);
  }

  static async logout(_req: Request, res: Response) {
    const result = await AuthService.logout();
    return ApiResponse.success(res, result);
  }

  static async getMe(req: Request, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const userData = await AuthService.getCurrentUser(req.user.id);
    return ApiResponse.success(res, {
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
      student: userData.student,
    });
  }
}
