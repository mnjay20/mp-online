import { Request, Response } from 'express';
import { InterviewsService } from './interviews.service.js';
import { StudentService } from '../student/student.service.js';
import { ApiResponse } from '../../lib/api-response.js';
import { UnauthorizedError } from '../../utils/errors.js';
import { getParam } from '../../utils/params.js';

export class InterviewsController {
  static async getMyInterviews(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const interviews = await InterviewsService.getStudentInterviews(student.id);
    return ApiResponse.success(res, interviews);
  }

  static async generateInterview(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const interview = await InterviewsService.generateInterview(student.id, req.body);
    return ApiResponse.success(res, interview, 201);
  }

  static async submitAnswer(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const { question_id, student_answer } = req.body;
    const answer = await InterviewsService.submitAnswer(student.id, id, question_id, student_answer);
    return ApiResponse.success(res, answer, 201);
  }

  /**
   * Real-time Interactive Turn Evaluation with Guardrails & Persona Feedback
   */
  static async processTurn(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const result = await InterviewsService.processTurn(student.id, id, req.body);
    return ApiResponse.success(res, result);
  }

  /**
   * Generate Final Comprehensive Interview Performance Scorecard
   */
  static async generateReport(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const careerTitle = req.body?.career_title || 'Software Engineer';
    const report = await InterviewsService.generateReport(student.id, id, careerTitle);
    return ApiResponse.success(res, report);
  }
}
