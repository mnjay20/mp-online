import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';

const router = Router();

router.get('/me', requireAuth, asyncHandler(AuthController.getMe));

export const authRoutes = router;
