import { Request, Response } from 'express';
import { CareersService } from './careers.service.js';
import { StudentService } from '../student/student.service.js';
import { ApiResponse } from '../../lib/api-response.js';
import { UnauthorizedError } from '../../utils/errors.js';
import { getParam } from '../../utils/params.js';

export class CareersController {
  static async getAll(req: Request, res: Response) {
    const careers = await CareersService.getAll();
    return ApiResponse.success(res, careers);
  }

  static async getById(req: Request, res: Response) {
    const id = getParam(req, 'id');
    const career = await CareersService.getById(id);
    return ApiResponse.success(res, career);
  }

  static async getGoals(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const goals = await CareersService.getStudentGoals(student.id);
    return ApiResponse.success(res, goals);
  }

  static async setGoal(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const goal = await CareersService.setStudentGoal(student.id, req.body);
    return ApiResponse.success(res, goal, 201);
  }

  static async deleteGoal(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const result = await CareersService.deleteStudentGoal(student.id, id);
    return ApiResponse.success(res, result);
  }
}
