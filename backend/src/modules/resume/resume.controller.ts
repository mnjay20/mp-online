import { Request, Response } from 'express';
import { ResumeService } from './resume.service.js';
import { StudentService } from '../student/student.service.js';
import { ApiResponse } from '../../lib/api-response.js';
import { UnauthorizedError } from '../../utils/errors.js';
import { getParam } from '../../utils/params.js';

export class ResumeController {
  static async getMyResumes(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const resumes = await ResumeService.getStudentResumes(student.id);
    return ApiResponse.success(res, resumes);
  }

  static async registerResume(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const resume = await ResumeService.registerResume(student.id, req.body);
    return ApiResponse.success(res, resume, 201);
  }

  static async analyzeResume(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const { target_career_id, target_role } = req.body;
    const analysis = await ResumeService.analyzeResume(student.id, id, target_career_id, target_role);
    return ApiResponse.success(res, analysis);
  }
}
