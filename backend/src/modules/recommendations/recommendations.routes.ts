import { Router } from 'express';
import { RecommendationsController } from './recommendations.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(RecommendationsController.getMyRecommendations));
router.patch('/:id/dismiss', asyncHandler(RecommendationsController.dismissRecommendation));

export const recommendationsRoutes = router;
