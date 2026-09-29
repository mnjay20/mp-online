import { Router } from 'express';
import { ResumeController } from './resume.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { registerResumeSchema, analyzeResumeSchema } from './resume.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(ResumeController.getMyResumes));
router.post(
  '/',
  validateRequest({ body: registerResumeSchema }),
  asyncHandler(ResumeController.registerResume)
);
router.post(
  '/:id/analyze',
  validateRequest({ body: analyzeResumeSchema }),
  asyncHandler(ResumeController.analyzeResume)
);

export const resumeRoutes = router;
