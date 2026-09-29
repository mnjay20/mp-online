import { Router } from 'express';
import { CoursesController } from './courses.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/rbac.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { updateCourseProgressSchema, createCourseSchema } from './courses.schema.js';

const router = Router();

// Skill Gap Recommendations (Platform courses first, then Tavily internet search, Paid & Unpaid)
router.get('/recommendations/skill-gap', asyncHandler(CoursesController.recommendGapCourses));
router.post('/recommendations/skill-gap', asyncHandler(CoursesController.recommendGapCourses));

// Catalog (Public/Students)
router.get('/', asyncHandler(CoursesController.getAll));
router.get('/:id', asyncHandler(CoursesController.getById));

// Admin Course Management: Add & Remove Courses
router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validateRequest({ body: createCourseSchema }),
  asyncHandler(CoursesController.create)
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  asyncHandler(CoursesController.delete)
);

// Student progress
router.get('/me/progress', requireAuth, asyncHandler(CoursesController.getProgress));
router.put(
  '/me/progress/:id',
  requireAuth,
  validateRequest({ body: updateCourseProgressSchema }),
  asyncHandler(CoursesController.updateProgress)
);

export const coursesRoutes = router;
