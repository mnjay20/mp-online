import { Request, Response } from 'express';
import { SkillsService } from './skills.service.js';
import { StudentService } from '../student/student.service.js';
import { ApiResponse } from '../../lib/api-response.js';
import { UnauthorizedError } from '../../utils/errors.js';
import { getParam } from '../../utils/params.js';

export class SkillsController {
  static async getCatalog(req: Request, res: Response) {
    const category = req.query.category as string | undefined;
    const catalog = await SkillsService.getCatalog(category);
    return ApiResponse.success(res, catalog);
  }

  static async getStudentSkills(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const skills = await SkillsService.getStudentSkills(student.id);
    return ApiResponse.success(res, skills);
  }

  static async addStudentSkill(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const result = await SkillsService.addStudentSkill(student.id, req.body);
    return ApiResponse.success(res, result, 201);
  }

  static async updateStudentSkill(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const result = await SkillsService.updateStudentSkill(student.id, id, req.body);
    return ApiResponse.success(res, result);
  }

  static async removeStudentSkill(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const result = await SkillsService.removeStudentSkill(student.id, id);
    return ApiResponse.success(res, result);
  }
}
