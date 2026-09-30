import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { NotFoundError } from './utils/errors.js';
import { ApiResponse } from './lib/api-response.js';

// Feature route imports
import { authRoutes } from './modules/auth/auth.routes.js';
import { studentRoutes } from './modules/student/student.routes.js';
import { skillsRoutes } from './modules/skills/skills.routes.js';
import { careersRoutes } from './modules/careers/careers.routes.js';
import { coursesRoutes } from './modules/courses/courses.routes.js';
import { jobsRoutes } from './modules/jobs/jobs.routes.js';
import { internshipsRoutes } from './modules/jobs/internships.routes.js';
import { applicationsRoutes } from './modules/applications/applications.routes.js';
import { resumeRoutes } from './modules/resume/resume.routes.js';
import { interviewsRoutes } from './modules/interviews/interviews.routes.js';
import { recommendationsRoutes } from './modules/recommendations/recommendations.routes.js';
import { copilotRoutes } from './modules/copilot/copilot.routes.js';
import { governmentSchemesRoutes } from './modules/government-schemes/government-schemes.routes.js';

export const createApp = (): Express => {
  const app = express();

  // Global Security & Parsing Middlewares
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Root & Health Verification Endpoints
  app.get('/health', (_req: Request, res: Response) => {
    return ApiResponse.success(res, {
      status: 'UP',
      service: 'career-readiness-backend',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // REST API Domain Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/skills', skillsRoutes);
  app.use('/api/careers', careersRoutes);
  app.use('/api/courses', coursesRoutes);
  app.use('/api/admin/courses', coursesRoutes);
  app.use('/api/jobs', jobsRoutes);
  app.use('/api/internships', internshipsRoutes);
  app.use('/api/applications', applicationsRoutes);
  app.use('/api/resumes', resumeRoutes);
  app.use('/api/interviews', interviewsRoutes);
  app.use('/api/recommendations', recommendationsRoutes);
  app.use('/api/ai', copilotRoutes);
  app.use('/api/government-schemes', governmentSchemesRoutes);

  // 404 Route Trap
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError('The requested endpoint does not exist.'));
  });

  // Global Centralized Error Middleware
  app.use(errorMiddleware);

  return app;
};
