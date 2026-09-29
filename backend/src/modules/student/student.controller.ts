import { Request, Response } from 'express';
import { StudentService } from './student.service.js';
import { ApiResponse } from '../../lib/api-response.js';
import { UnauthorizedError } from '../../utils/errors.js';
import { getParam } from '../../utils/params.js';

export class StudentController {
  // --- Profile ---
  static async getMe(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    return ApiResponse.success(res, student);
  }

  static async upsertMe(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.upsertProfile(req.user.id, req.body);
    return ApiResponse.success(res, student, 200);
  }

  // --- Education ---
  static async getEducation(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const education = await StudentService.getEducation(student.id);
    return ApiResponse.success(res, education);
  }

  static async addEducation(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const item = await StudentService.addEducation(student.id, req.body);
    return ApiResponse.success(res, item, 201);
  }

  static async deleteEducation(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const result = await StudentService.deleteEducation(student.id, id);
    return ApiResponse.success(res, result);
  }

  // --- Academics ---
  static async getAcademics(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const records = await StudentService.getAcademics(student.id);
    return ApiResponse.success(res, records);
  }

  static async addAcademicRecord(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const record = await StudentService.addAcademicRecord(student.id, req.body);
    return ApiResponse.success(res, record, 201);
  }

  static async deleteAcademicRecord(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const result = await StudentService.deleteAcademicRecord(student.id, id);
    return ApiResponse.success(res, result);
  }

  // --- Projects ---
  static async getProjects(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const projects = await StudentService.getProjects(student.id);
    return ApiResponse.success(res, projects);
  }

  static async addProject(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const project = await StudentService.addProject(student.id, req.body);
    return ApiResponse.success(res, project, 201);
  }

  static async deleteProject(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const result = await StudentService.deleteProject(student.id, id);
    return ApiResponse.success(res, result);
  }

  // --- Certifications ---
  static async getCertifications(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const certs = await StudentService.getCertifications(student.id);
    return ApiResponse.success(res, certs);
  }

  static async addCertification(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const cert = await StudentService.addCertification(student.id, req.body);
    return ApiResponse.success(res, cert, 201);
  }

  static async deleteCertification(req: Request, res: Response) {
    if (!req.user) throw new UnauthorizedError();
    const student = await StudentService.requireStudent(req.user.id);
    const id = getParam(req, 'id');
    const result = await StudentService.deleteCertification(student.id, id);
    return ApiResponse.success(res, result);
  }
}
