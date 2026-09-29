import { z } from 'zod';

export const updateCourseProgressSchema = z.object({
  progress_percent: z.number().int().min(0).max(100),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).default('IN_PROGRESS'),
});
