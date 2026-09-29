import { Request, Response } from 'express';
import { CoursesService } from './courses.service.js';
import { StudentService } from '../student/student.service.js';
import { ApiResponse } from '../../lib/api-response.js';
import { UnauthorizedError } from '../../utils/errors.js';
import { getParam } from '../../utils/params.js';

export class CoursesController {
  static async getAll(req: Request, res: Response) {
    const skillId = req.query.skill_id as string | undefined;
    const difficulty = req.query.difficulty as string | undefined;
    const courses = await CoursesService.getAll(skillId, difficulty);
    return ApiResponse.success(res, courses);
  }

  static async getById(req: Request, res: Response) {
    const id = getParam(req, 'id');
    const course = await CoursesService.getById(id);
    return ApiResponse.success(res, course);
  }

  static async getProgress(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const progress = await CoursesService.getStudentProgress(student.id);
    return ApiResponse.success(res, progress);
  }

  static async updateProgress(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const { progress_percent, status } = req.body;
    const result = await CoursesService.updateProgress(student.id, id, progress_percent, status);
    return ApiResponse.success(res, result);
  }
}
