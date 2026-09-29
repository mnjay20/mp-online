import { Router } from 'express';
import { CareersController } from './careers.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { setCareerGoalSchema } from './careers.schema.js';

const router = Router();

// Public catalogue routes
router.get('/', asyncHandler(CareersController.getAll));
router.get('/:id', asyncHandler(CareersController.getById));

// Student goal routes
router.get('/me/goals', requireAuth, asyncHandler(CareersController.getGoals));
router.post(
  '/me/goals',
  requireAuth,
  validateRequest({ body: setCareerGoalSchema }),
  asyncHandler(CareersController.setGoal)
);
router.delete('/me/goals/:id', requireAuth, asyncHandler(CareersController.deleteGoal));

export const careersRoutes = router;
