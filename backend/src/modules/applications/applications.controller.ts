import { Request, Response } from 'express';
import { ApplicationsService } from './applications.service.js';
import { StudentService } from '../student/student.service.js';
import { ApiResponse } from '../../lib/api-response.js';
import { UnauthorizedError } from '../../utils/errors.js';
import { getParam } from '../../utils/params.js';

export class ApplicationsController {
  static async getMyApplications(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const applications = await ApplicationsService.getStudentApplications(student.id);
    return ApiResponse.success(res, applications);
  }

  static async createApplication(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const application = await ApplicationsService.createApplication(student.id, req.body);
    return ApiResponse.success(res, application, 201);
  }

  static async updateApplication(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const application = await ApplicationsService.updateApplication(student.id, id, req.body);
    return ApiResponse.success(res, application);
  }

  static async deleteApplication(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const result = await ApplicationsService.deleteApplication(student.id, id);
    return ApiResponse.success(res, result);
  }
}
