import { Router } from 'express';
import { InterviewsController } from './interviews.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import {
  generateInterviewSchema,
  submitAnswerSchema,
  processTurnSchema,
  generateReportSchema,
} from './interviews.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(InterviewsController.getMyInterviews));

router.post(
  '/generate',
  validateRequest({ body: generateInterviewSchema }),
  asyncHandler(InterviewsController.generateInterview)
);

router.post(
  '/:id/answers',
  validateRequest({ body: submitAnswerSchema }),
  asyncHandler(InterviewsController.submitAnswer)
);

// Real-time Interactive Turn Evaluation (Speech-to-Text processed transcript or direct text)
router.post(
  '/:id/turn',
  validateRequest({ body: processTurnSchema }),
  asyncHandler(InterviewsController.processTurn)
);

// Final Interview Session Scorecard & Feedback Report Generation
router.post(
  '/:id/report',
  validateRequest({ body: generateReportSchema }),
  asyncHandler(InterviewsController.generateReport)
);

// Retrieve Completed Interview Report & Metrics
router.get(
  '/:id/report',
  asyncHandler(InterviewsController.getReport)
);

// Download or Stream Assessment PDF Report Directly
router.get(
  '/:id/report/pdf',
  asyncHandler(InterviewsController.downloadReportPdf)
);

// Convenience download alias
router.get(
  '/:id/download-pdf',
  asyncHandler(InterviewsController.downloadReportPdf)
);

export const interviewsRoutes = router;
