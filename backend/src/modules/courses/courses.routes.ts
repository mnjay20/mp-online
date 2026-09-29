import { Router } from 'express';
import { CoursesController } from './courses.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { updateCourseProgressSchema } from './courses.schema.js';

const router = Router();

// Catalog
router.get('/', asyncHandler(CoursesController.getAll));
router.get('/:id', asyncHandler(CoursesController.getById));

// Student progress
router.get('/me/progress', requireAuth, asyncHandler(CoursesController.getProgress));
router.put(
  '/me/progress/:id',
  requireAuth,
  validateRequest({ body: updateCourseProgressSchema }),
  asyncHandler(CoursesController.updateProgress)
);

export const coursesRoutes = router;
