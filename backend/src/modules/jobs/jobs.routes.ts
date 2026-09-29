import { Router } from 'express';
import { JobsController } from './jobs.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/rbac.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { createJobSchema } from './jobs.schema.js';

const router = Router();

// Public / Candidate view
router.get('/', asyncHandler(JobsController.getAllJobs));
router.get('/:id', asyncHandler(JobsController.getJobById));

// Recruiter & Admin management
router.post(
  '/',
  requireAuth,
  requireRole('RECRUITER', 'ADMIN'),
  validateRequest({ body: createJobSchema }),
  asyncHandler(JobsController.createJob)
);

router.get(
  '/:id/candidates',
  requireAuth,
  requireRole('RECRUITER', 'ADMIN'),
  asyncHandler(JobsController.getJobCandidates)
);

export const jobsRoutes = router;

