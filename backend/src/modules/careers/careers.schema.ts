import { z } from 'zod';

export const setCareerGoalSchema = z.object({
  career_id: z.string().uuid('Valid career UUID required'),
  goal_title: z.string().max(200).optional(),
  priority: z.number().int().min(1).max(5).default(1),
  target_date: z.string().optional(),
  is_active: z.boolean().default(true),
});
