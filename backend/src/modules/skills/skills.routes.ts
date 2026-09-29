import { Router } from 'express';
import { SkillsController } from './skills.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { addStudentSkillSchema, updateStudentSkillSchema } from './skills.schema.js';

const router = Router();

// Master catalog (public or authenticated)
router.get('/', asyncHandler(SkillsController.getCatalog));

// Student skills (authenticated self-service)
router.get('/me', requireAuth, asyncHandler(SkillsController.getStudentSkills));
router.post(
  '/me',
  requireAuth,
  validateRequest({ body: addStudentSkillSchema }),
  asyncHandler(SkillsController.addStudentSkill)
);
router.put(
  '/me/:id',
  requireAuth,
  validateRequest({ body: updateStudentSkillSchema }),
  asyncHandler(SkillsController.updateStudentSkill)
);
router.delete('/me/:id', requireAuth, asyncHandler(SkillsController.removeStudentSkill));

export const skillsRoutes = router;
