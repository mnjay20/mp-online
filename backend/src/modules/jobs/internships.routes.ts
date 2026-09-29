import { Router } from 'express';
import { JobsController } from './jobs.controller.js';
import { asyncHandler } from '../../utils/async-handler.js';

const router = Router();

router.get('/', asyncHandler(JobsController.getAllInternships));
router.get('/:id', asyncHandler(JobsController.getInternshipById));

export const internshipsRoutes = router;
