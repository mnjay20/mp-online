import { Request, Response } from 'express';
import { GovernmentSchemesService } from './government-schemes.service.js';
import { ApiResponse } from '../../lib/api-response.js';
import { getParam } from '../../utils/params.js';

export class GovernmentSchemesController {
  static async getAllSchemes(req: Request, res: Response) {
    const { category, initiative, search } = req.query as {
      category?: string;
      initiative?: string;
      search?: string;
    };
    const schemes = await GovernmentSchemesService.getAllSchemes({ category, initiative, search });
    return ApiResponse.success(res, schemes);
  }

  static async getSchemeById(req: Request, res: Response) {
    const id = getParam(req, 'id');
    const scheme = await GovernmentSchemesService.getSchemeById(id);
    return ApiResponse.success(res, scheme);
  }

  static async recommendSchemes(req: Request, res: Response) {
    const studentId = req.studentId || req.body?.student_id;
    const recommendations = await GovernmentSchemesService.recommendSchemes(studentId, req.body);
    return ApiResponse.success(res, recommendations);
  }
}
