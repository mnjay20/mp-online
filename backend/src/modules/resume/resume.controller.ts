import { Request, Response } from 'express';
import { ResumeService } from './resume.service.js';
import { StudentService } from '../student/student.service.js';
import { ApiResponse } from '../../lib/api-response.js';
import { UnauthorizedError, BadRequestError } from '../../utils/errors.js';
import { getParam } from '../../utils/params.js';

export class ResumeController {
  static async getMyResumes(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const resumes = await ResumeService.getStudentResumes(student.id);
    return ApiResponse.success(res, resumes);
  }

  /**
   * Multipart Resume Upload & Automated ATS Analysis
   */
  static async uploadResume(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);

    if (!req.file) {
      throw new BadRequestError("No file uploaded. Please upload a resume file under the 'resume' field.");
    }

    const targetRole = (req.body?.target_role as string) || 'Software Engineer';
    const targetCareerId = req.body?.target_career_id as string | undefined;

    const result = await ResumeService.uploadAndAnalyze(
      student.id,
      req.user.id,
      req.file,
      targetRole,
      targetCareerId
    );

    return ApiResponse.success(res, result, 201);
  }

  /**
   * Generates a secure, temporary signed download link for an existing resume.
   */
  static async getDownloadUrl(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');

    const downloadUrl = await ResumeService.getDownloadUrl(student.id, id);
    return ApiResponse.success(res, {
      download_url: downloadUrl,
      expires_in_seconds: 3600,
    });
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
