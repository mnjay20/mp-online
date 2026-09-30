import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { registerSchema, loginSchema } from './auth.schema.js';

const router = Router();

// Public auth endpoints
router.post('/register', validateRequest({ body: registerSchema }), asyncHandler(AuthController.register));
router.post('/login', validateRequest({ body: loginSchema }), asyncHandler(AuthController.login));
router.post('/logout', asyncHandler(AuthController.logout));

// Authenticated user session
router.get('/me', requireAuth, asyncHandler(AuthController.getMe));

export const authRoutes = router;
