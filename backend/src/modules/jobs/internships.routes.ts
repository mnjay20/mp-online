import { Router } from 'express';
import { JobsController } from './jobs.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/rbac.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { createInternshipSchema } from './jobs.schema.js';

const router = Router();

// Public / Candidate view
router.get('/', asyncHandler(JobsController.getAllInternships));
router.get('/:id', asyncHandler(JobsController.getInternshipById));

// Recruiter & Admin management
router.post(
  '/',
  requireAuth,
  requireRole('RECRUITER', 'ADMIN'),
  validateRequest({ body: createInternshipSchema }),
  asyncHandler(JobsController.createInternship)
);

router.get(
  '/:id/candidates',
  requireAuth,
  requireRole('RECRUITER', 'ADMIN'),
  asyncHandler(JobsController.getInternshipCandidates)
);

export const internshipsRoutes = router;

