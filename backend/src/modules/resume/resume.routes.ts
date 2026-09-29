import { Router } from 'express';
import { ResumeController } from './resume.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { uploadResumeMiddleware } from '../../middleware/upload.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { analyzeResumeSchema } from './resume.schema.js';

const router = Router();

router.use(requireAuth);

// Get student's resume history
router.get('/', asyncHandler(ResumeController.getMyResumes));

// Automated Pipeline: Upload (PDF/DOCX) -> In-memory parse -> Supabase Storage -> AI ATS Analysis
router.post(
  '/upload',
  uploadResumeMiddleware,
  asyncHandler(ResumeController.uploadResume)
);

// Get secure, time-limited signed download URL
router.get('/:id/download-url', asyncHandler(ResumeController.getDownloadUrl));

// On-demand re-analysis for specific target role
router.post(
  '/:id/analyze',
  validateRequest({ body: analyzeResumeSchema }),
  asyncHandler(ResumeController.analyzeResume)
);

export const resumeRoutes = router;
