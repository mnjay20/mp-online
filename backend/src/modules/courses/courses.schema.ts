import { z } from 'zod';

export const updateCourseProgressSchema = z.object({
  progress_percent: z.number().int().min(0).max(100),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).default('IN_PROGRESS'),
});

export const createCourseSchema = z.object({
  title: z.string().min(1, 'Course title is required').max(255),
  provider: z.string().min(1, 'Course provider is required').max(100),
  description: z.string().min(1, 'Course description is required'),
  url: z.string().url('A valid course URL is required'),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).default('BEGINNER'),
  duration_hours: z.number().int().positive().optional().default(10),
  is_free: z.boolean().default(true),
  price: z.number().min(0).optional().default(0),
  rating: z.number().min(0).max(5).optional().default(4.5),
  skill_ids: z.array(z.string().uuid()).optional().default([]),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
