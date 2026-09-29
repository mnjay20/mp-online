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

  static async createJob(req: Request, res: Response) {
    const job = await JobsService.createJob(req.body);
    return ApiResponse.success(res, job, 201);
  }

  static async getJobCandidates(req: Request, res: Response) {
    const id = getParam(req, 'id');
    const candidates = await JobsService.getJobCandidates(id);
    return ApiResponse.success(res, candidates);
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

  static async createInternship(req: Request, res: Response) {
    const internship = await JobsService.createInternship(req.body);
    return ApiResponse.success(res, internship, 201);
  }

  static async getInternshipCandidates(req: Request, res: Response) {
    const id = getParam(req, 'id');
    const candidates = await JobsService.getInternshipCandidates(id);
    return ApiResponse.success(res, candidates);
  }
}

