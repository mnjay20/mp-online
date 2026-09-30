import { Router } from 'express';
import { GovernmentSchemesController } from './government-schemes.controller.js';
import { asyncHandler } from '../../utils/async-handler.js';

const router = Router();

// Public & Student accessible
router.get('/', asyncHandler(GovernmentSchemesController.getAllSchemes));
router.post('/recommend', asyncHandler(GovernmentSchemesController.recommendSchemes));
router.get('/:id', asyncHandler(GovernmentSchemesController.getSchemeById));

export const governmentSchemesRoutes = router;
