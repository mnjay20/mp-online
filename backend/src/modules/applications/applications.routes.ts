import { Router } from 'express';
import { ApplicationsController } from './applications.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { createApplicationSchema, updateApplicationSchema } from './applications.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(ApplicationsController.getMyApplications));
router.post(
  '/',
  validateRequest({ body: createApplicationSchema }),
  asyncHandler(ApplicationsController.createApplication)
);
router.put(
  '/:id',
  validateRequest({ body: updateApplicationSchema }),
  asyncHandler(ApplicationsController.updateApplication)
);
router.delete('/:id', asyncHandler(ApplicationsController.deleteApplication));

export const applicationsRoutes = router;
