import { Router } from 'express';
import { CopilotController } from './copilot.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { chatMessageSchema, skillGapRequestSchema, roadmapRequestSchema } from './copilot.schema.js';

const router = Router();

router.use(requireAuth);

// Conversation management
router.get('/conversations', asyncHandler(CopilotController.getConversations));
router.get('/conversations/:id', asyncHandler(CopilotController.getConversationMessages));

// Chat with Copilot
router.post(
  '/chat',
  validateRequest({ body: chatMessageSchema }),
  asyncHandler(CopilotController.chat)
);

// High-level AI workflows
router.post('/career/recommend', asyncHandler(CopilotController.recommendCareer));
router.post(
  '/skill-gap',
  validateRequest({ body: skillGapRequestSchema }),
  asyncHandler(CopilotController.analyzeSkillGap)
);
router.post(
  '/roadmap',
  validateRequest({ body: roadmapRequestSchema }),
  asyncHandler(CopilotController.generateRoadmap)
);
router.post('/match/jobs', asyncHandler(CopilotController.matchJobs));
router.post('/match/internships', asyncHandler(CopilotController.matchInternships));

export const copilotRoutes = router;
