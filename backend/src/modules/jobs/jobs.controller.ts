import { Request, Response } from 'express';
import { JobsService } from './jobs.service.js';
import { ApiResponse } from '../../lib/api-response.js';
import { getParam } from '../../utils/params.js';

export class JobsController {
  static async getAllJobs(req: Request, res: Response) {
    const { work_mode, location } = req.query as { work_mode?: string; location?: string };
    const jobs = await JobsService.getAllJobs({ work_mode, location });
    return ApiResponse.success(res, jobs);
  }

  static async getJobById(req: Request, res: Response) {
    const id = getParam(req, 'id');
    const job = await JobsService.getJobById(id);
    return ApiResponse.success(res, job);
  }

  static async getAllInternships(req: Request, res: Response) {
    const { work_mode, location } = req.query as { work_mode?: string; location?: string };
    const internships = await JobsService.getAllInternships({ work_mode, location });
    return ApiResponse.success(res, internships);
  }

  static async getInternshipById(req: Request, res: Response) {
    const id = getParam(req, 'id');
    const internship = await JobsService.getInternshipById(id);
    return ApiResponse.success(res, internship);
  }
}
