import { Request, Response } from 'express';
import { RecommendationsService } from './recommendations.service.js';
import { StudentService } from '../student/student.service.js';
import { ApiResponse } from '../../lib/api-response.js';
import { UnauthorizedError } from '../../utils/errors.js';
import { getParam } from '../../utils/params.js';

export class RecommendationsController {
  static async getMyRecommendations(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const recommendations = await RecommendationsService.getStudentRecommendations(student.id);
    return ApiResponse.success(res, recommendations);
  }

  static async dismissRecommendation(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const result = await RecommendationsService.dismissRecommendation(student.id, id);
    return ApiResponse.success(res, result);
  }
}
