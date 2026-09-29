import { Router } from 'express';
import { InterviewsController } from './interviews.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { generateInterviewSchema, submitAnswerSchema } from './interviews.schema.js';

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

export const interviewsRoutes = router;
