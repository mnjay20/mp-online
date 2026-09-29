import { Request, Response } from 'express';
import { CopilotService } from './copilot.service.js';
import { StudentService } from '../student/student.service.js';
import { ApiResponse } from '../../lib/api-response.js';
import { UnauthorizedError } from '../../utils/errors.js';
import { getParam } from '../../utils/params.js';

export class CopilotController {
  static async getConversations(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const conversations = await CopilotService.getConversations(student.id);
    return ApiResponse.success(res, conversations);
  }

  static async getConversationMessages(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const data = await CopilotService.getConversationMessages(student.id, id);
    return ApiResponse.success(res, data);
  }

  static async chat(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const { conversation_id, message } = req.body;
    const response = await CopilotService.chat(student.id, conversation_id, message);
    return ApiResponse.success(res, response);
  }

  static async recommendCareer(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const response = await CopilotService.recommendCareer(student.id);
    return ApiResponse.success(res, response);
  }

  static async analyzeSkillGap(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const { career_id } = req.body;
    const response = await CopilotService.analyzeSkillGap(student.id, career_id);
    return ApiResponse.success(res, response);
  }

  static async generateRoadmap(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const { career_id, target_months } = req.body;
    const response = await CopilotService.generateRoadmap(student.id, career_id, target_months);
    return ApiResponse.success(res, response);
  }

  static async matchJobs(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const response = await CopilotService.matchJobs(student.id);
    return ApiResponse.success(res, response);
  }

  static async matchInternships(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const response = await CopilotService.matchInternships(student.id);
    return ApiResponse.success(res, response);
  }
}
